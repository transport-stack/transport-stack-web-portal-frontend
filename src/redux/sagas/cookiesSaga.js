import { put, takeLatest } from "redux-saga/effects";
import { setUseCookiesMeasureRequest } from "../slices/cookies/cookiesSlice";

function* useCookiesMeasureRequestSaga(action) {
  yield put(
    setUseCookiesMeasureRequest({
      status: action.payload?.status,
    })
  );
}

function* watchCookies() {
  yield takeLatest("useCookiesMeasureRequest", useCookiesMeasureRequestSaga);
}

export default watchCookies;
