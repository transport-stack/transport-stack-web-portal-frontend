import { all } from 'redux-saga/effects';
import watchAuth from './authSaga';
import watchHelpSupportSaga from './helpSupportSaga';
import watchVerify from './verifySaga';
import notificationSaga from './notificationSaga';
import cookiesSaga from './cookiesSaga';

export default function* rootSaga() {
    yield all([watchAuth(), watchHelpSupportSaga(), watchVerify(),notificationSaga(),cookiesSaga()]);
}