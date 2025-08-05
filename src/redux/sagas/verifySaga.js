import { put, takeLatest } from 'redux-saga/effects';
import {
    verifyUserOtpDetails,
    verifyUserMobileNumber,
    removeVerifiedUserOtpDetails,
    setVerifiedScreen,
    setResendOtpClicks,
    verifyMobileOtpFromProfile,
    userDataServiceLogin
} from '../slices/verify/verifySlice';

function* userDataServiceLoginSaga(action) {
    yield put(userDataServiceLogin(
        {
            status: action.payload?.status ? action.payload.status : false,
            path: action.payload?.path ? action.payload.path : '',
        }
    ));
}


function* callVerifyUserOtpDetailsSaga(action) {
    yield put(verifyUserOtpDetails({
        email: action.payload.email,
        mobileNo: action.payload.mobileNo,
        userId: action.payload.userId,
        register: action.payload.register
    }));
}
function* callVerifyUserMobileNumberSaga(action) {
    yield put(verifyUserMobileNumber({
        mobileNo: action.payload.mobileNo,
        userId: action.payload.userId,
        dialCode: action.payload.dialCode,
    }));
}
function* callVerifyMobileOtpFromProfileSaga(action) {
    yield put(verifyMobileOtpFromProfile({
        isValidated: action.payload.isValidated,
    }));
}
function* callRemoveVerifiedUserOtpDetailSaga() {
    yield put(removeVerifiedUserOtpDetails());
}

function* callSettingVerifyScreenSaga(action) {
    yield put(setVerifiedScreen(
        {
            email: action.payload?.email ? action.payload.email : null,
            mobile: action.payload?.mobile ? action.payload.mobile : null,
        }
    ));
}
function* callResendOtpClicksSaga(action) {
    yield put(setResendOtpClicks(
        {
            email: action.payload?.email ? action.payload.email : 0,
            mobile: action.payload?.mobile ? action.payload.mobile : 0,
        }
    ));
}


function* watchVerify() {
    yield takeLatest("verifyUserOtpDetails", callVerifyUserOtpDetailsSaga);
    yield takeLatest("verifyUserMobileNumber", callVerifyUserMobileNumberSaga);
    yield takeLatest("verifyMobileOtpFromProfile", callVerifyMobileOtpFromProfileSaga);
    yield takeLatest("RemoveVerifiedUserOtpDetails", callRemoveVerifiedUserOtpDetailSaga);
    yield takeLatest("setVerifiedScreen", callSettingVerifyScreenSaga);
    yield takeLatest("setResendOtpClicks", callResendOtpClicksSaga);
    yield takeLatest("verify/userDataServiceLoginRequest", userDataServiceLoginSaga);
}

export default watchVerify;