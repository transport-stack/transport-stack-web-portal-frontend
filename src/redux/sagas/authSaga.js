import { call, put, select, delay, takeLatest } from 'redux-saga/effects';
import { apiService } from '../../services/apiservices';
import {
    userLoginSuccess,
    userLoginFailure,
    logoutUser,
    adminLoginSuccess,
    adminLoginFailure,
    logoutAdmin,
    refreshUserTokenSuccess,
    refreshUserTokenFailure,
    refreshAdminTokenSuccess,
    refreshAdminTokenFailure,
} from '../slices/auth/authSlice';

//API call helper function
function* apiCall(url, method, data, headers = {}) {
    try {
        const response = yield call(apiService, {
            method,
            url,
            data,
            headers
        });
        return response.data;
    } catch (error) {
        if (error?.response?.data) {
            throw error.response.data;
        } else if (error?.message) {
            throw error
        }
    }
}

//Workder saga: User Login
function* userLoginSaga(action) {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const data = yield call(
            apiCall,
            '/api/user/login',
            'POST',
            action.payload,
            headers);
        yield put(userLoginSuccess({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenExpiresAt: data.accessTokenExpiresIn,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNumber: data.mobileNumber,
            organizationName: data.organizationName,
            username: data.username,
            id: data.id,
            role: data.roles,
            dialCode: data.dialCode,
        }));

        yield put({ type: 'auth/startUserTokenExpirationMonitor' });

        // yield call(monitorTokenExpirationSaga);
    } catch (error) {
        yield put(userLoginFailure(error.message));
    } 
}

//Workder saga: Admin Login
function* adminLoginSaga(action) {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        const data = yield call(
            apiCall,
            '/api/user/login',
            'POST',
            action.payload,
            headers);
        yield put(adminLoginSuccess({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenExpiresAt: data.accessTokenExpiresIn,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNumber: data.mobileNumber,
            organizationName: data.organizationName,
            username: data.username,
            id: data.id,
            role: data.roles,
        }));

        yield put({ type: 'auth/startAdminTokenExpirationMonitor' });

        // yield call(monitorTokenExpirationSaga);
    } catch (error) {
        yield put(adminLoginFailure(error.message));
    } 
}


//Worker saga: user refresh Token
function* refreshUserTokenSaga() {
    try {
        const { accessToken, refreshToken } = yield select((state) => state.auth.user);

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const data = yield call(
            apiCall,
            '/api/user/generate-new-token',
            'POST',
            { refreshToken },
            headers
        );

        yield put(
            refreshUserTokenSuccess({
                accessToken: data.accessToken,
                tokenExpiresAt: data.accessTokenExpiresIn,
            })
        );

        yield put({ type: 'auth/startUserTokenExpirationMonitor' });
    } catch (error) {
        yield put(refreshUserTokenFailure(error.message));
        yield put(logoutUser());
    } 
}

//Worker saga: user refresh Token
function* refreshAdminTokenSaga() {
    try {
        const { accessToken, refreshToken } = yield select((state) => state.auth.admin);

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const data = yield call(
            apiCall,
            '/api/user/generate-new-token',
            'POST',
            { refreshToken },
            headers
        );

        yield put(
            refreshAdminTokenSuccess({
                accessToken: data.accessToken,
                tokenExpiresAt: data.accessTokenExpiresIn,
            })
        );

        yield put({ type: 'auth/startAdminTokenExpirationMonitor' });
    } catch (error) {
        yield put(refreshAdminTokenFailure(error.message));
        yield put(logoutAdmin());
    } 
}

//Worker saga : Monitor User token expiration
function* monitorUserTokenExpirationSaga() {
    // while (true) {
    const { tokenExpiresAt } = yield select((state) => state.auth.user);
    const currentTime = Date.now();
    const timeLeft = tokenExpiresAt - currentTime;

    if (timeLeft > 0) {
        // wait until the token is about to expire
        yield delay(timeLeft);
        yield put({ type: 'auth/refreshUserTokenRequest' })
    }
    else {
        yield delay(1000);
        yield put(logoutUser());
        // break;
    }
    // }
}

//Worker saga : Monitor Admin token expiration
function* monitorAdminTokenExpirationSaga() {
    // while (true) {
    const { tokenExpiresAt } = yield select((state) => state.auth.admin);
    const currentTime = Date.now();
    const timeLeft = tokenExpiresAt - currentTime;
    if (timeLeft > 0) {
        // wait until the token is about to expire
        yield delay(timeLeft);
        yield put({ type: 'auth/refreshAdminTokenRequest' })

    }
    else {
        yield delay(1000);
        yield put(logoutAdmin());
        // break;
    }
    // }
}

function* checkTokensOnInit() {
    const userExpiresAt = yield select((state) => state.auth.user.tokenExpiresAt);
    const adminExpiresAt = yield select((state) => state.auth.admin.tokenExpiresAt);

    if (userExpiresAt && Date.now() > userExpiresAt) {
        yield put(logoutUser())
    }
    if (adminExpiresAt && Date.now() > adminExpiresAt) {
        yield put(logoutAdmin())
    }
}

//Worker saga: handles user signout
function* userLogoutSaga(action) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + action.payload.accessToken,
        };
        yield call(
            apiCall,
            '/api/user/logout',
            'POST',
            action.payload,
            headers);

        yield put(logoutUser())
    } catch (error) {
        yield put(logoutUser())
    } 
}

//Worker saga: handles admin signout
function* adminLogoutSaga(action) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + action.payload.accessToken,
        };
        yield call(
            apiCall,
            '/api/user/logout',
            'POST',
            action.payload,
            headers);

        yield put(logoutAdmin())
    } catch (error) {
        yield put(logoutAdmin())
    } 
}

function* watchAuth() {
    yield takeLatest('auth/userLoginRequest', userLoginSaga);
    yield takeLatest('auth/refreshUserTokenRequest', refreshUserTokenSaga)
    yield takeLatest('auth/startUserTokenExpirationMonitor', monitorUserTokenExpirationSaga)
    yield takeLatest('auth/adminLoginRequest', adminLoginSaga);
    yield takeLatest('auth/refreshAdminTokenRequest', refreshAdminTokenSaga)
    yield takeLatest('auth/startAdminTokenExpirationMonitor', monitorAdminTokenExpirationSaga);
    yield takeLatest('auth/userLogoutRequest', userLogoutSaga);
    yield takeLatest('auth/adminLogoutRequest', adminLogoutSaga);
    yield call(checkTokensOnInit);
}

export default watchAuth;