import { call, put, takeLatest } from 'redux-saga/effects';
import { apiService } from '../../services/apiservices';
import {
    submitSupportFormRequest,
    submitSupportFormSuccess,
    submitSupportFormFailure,
} from '../slices/helpsupport/helpSupportSlice';

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
        throw error?.response?.data;
    }
}

//Worker saga: Help Support form submission
function* submitSupportFormSaga(action) {
    try {
        yield put(submitSupportFormRequest());
        const headers = {
            'Content-Type': 'application/json',
        };
        const data = yield call(
            apiCall,
            '/api/help-support/add-query',
            'POST',
            action.payload,
            headers);
        yield put(submitSupportFormSuccess(data?.message));

    } catch (error) {
        yield put(submitSupportFormFailure(error?.message));
    } 
}

function* watchHelpSupportSaga() {
    yield takeLatest('helpSupportSubmit', submitSupportFormSaga);
}

export default watchHelpSupportSaga;