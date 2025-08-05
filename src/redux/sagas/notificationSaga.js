import { call, put, takeLatest } from "redux-saga/effects";
import { apiService } from "../../services/apiservices";
import {
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  deleteNotificationsSuccess,
  deleteNotificationsFailure,
  fetchNotificationsStatusSuccess,
  fetchNotificationsStatusFailure,
  changeNotificationsStatusSuccess,
  readNotificationsSuccess,
  readNotificationsFailure,
  readNewNotificationsSuccess,
  readNewNotificationsFailure,
  markAsReadSuccess,
} from "../slices/notifications/notificationSlice";

//API call helper function
function* apiCall(url, method, data, headers = {}) {
  try {
    const response = yield call(apiService, {
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data;
  }
}

//Worker saga: Fetch Notification request
function* fetchNotificationRequestSaga(action) {
  try {
    const { id, accessToken, size, page } = action.payload;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/list?userId=" +
        id +
        "&size=" +
        size +
        "&page=" +
        page,
      "GET",
      id,
      headers
    );
    yield put(fetchNotificationsSuccess(data));
  } catch (error) {
    yield put(fetchNotificationsFailure(error?.message));
  } 
}

//Worker saga: Fetch Notification Switch Status
function* fetchNotificationSwitchStatusSaga(action) {
  try {
    const { id, accessToken } = action.payload;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/enabled-status?userId=" + id,
      "GET",
      id,
      headers
    );
    yield put(fetchNotificationsStatusSuccess(data));
  } catch (error) {
    yield put(fetchNotificationsStatusFailure(error?.message));
  } 
}

//Worker saga: Check new Notifications request
function* fetchNewNotificationSaga(action) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + action.payload.accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/has-read-notifications?userId=" + action.payload.id,
      "GET",
      action.payload.id,
      headers
    );
    yield put(readNewNotificationsSuccess(data));
  } catch (error) {
    yield put(readNewNotificationsFailure(error?.message));
  } 
}

//Worker saga: Change Notification Switch Status
function* changeNotificationSwitchStatusSaga(action) {
  try {
    const { id, accessToken, switchState } = action.payload;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/toggle-all-notifications?userId=" +
        id +
        "&isNotificationEnabled=" +
        switchState,
      "POST",
      "",
      headers
    );
    yield put(changeNotificationsStatusSuccess(data));
  } catch (error) {
    yield put(fetchNotificationsStatusFailure(error?.message));
  } 
}

//Worker saga: Delete Notification request
function* deleteNotificationRequestSaga(action) {
  try {
    const { NotificationId, accessToken, id, page, size } = action.payload;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/deleteNotification?notificationId=" + NotificationId,
      "POST",
      NotificationId,
      headers
    );
    yield put(deleteNotificationsSuccess(data));
    yield call(fetchNotificationRequestSaga, {
      payload: { id, accessToken, page, size },
    });
  } catch (error) {
    yield put(deleteNotificationsFailure(error?.message));
  } 
}

//Worker saga: Read Notification request
function* readNotificationRequestSaga(action) {
  try {
    const { notificationId, accessToken } = action.payload;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };
    const data = yield call(
      apiCall,
      "/api/notifications/mark-as-read?notificationId=" + notificationId,
      "POST",
      notificationId,
      headers
    );
    yield put(readNotificationsSuccess(data));
    // yield call(fetchNotificationRequestSaga, { payload: { id, accessToken, page, size } });
  } catch (error) {
    yield put(readNotificationsFailure(error?.message));
  }
}

function* notificationSaga() {
  yield takeLatest("fetchNotificationRequest", fetchNotificationRequestSaga);
  yield takeLatest("deleteNotificationRequest", deleteNotificationRequestSaga);
  yield takeLatest(
    "fetchNotificationSwitchStatus",
    fetchNotificationSwitchStatusSaga
  );
  yield takeLatest(
    "changeNotificationSwitchStatus",
    changeNotificationSwitchStatusSaga
  );
  yield takeLatest("readNotificationRequest", readNotificationRequestSaga);
  yield takeLatest("checkNewNotificationStatus", fetchNewNotificationSaga);
}

export default notificationSaga;