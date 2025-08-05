import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notifications: [],
    error: null,
    message: null,
    switchStatus:true,
    newNotification:null
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        fetchNotificationsSuccess: (state, action) => {
            state.notifications = action.payload;
            state.error = '';
        },
        fetchNotificationsError: (state, action) => {
            state.error = action.payload;
        },
        deleteNotificationsSuccess: (state, action) => {
            // state.notifications = state.notifications.filter(notification=>notification.id!==action.payload.id);
            state.error = '';
            state.message = action.payload.message;
        },
        deleteNotificationsFailure: (state, action) => {
            state.error = action.payload;
        },
        readNotificationsSuccess: (state, action) => {
            state.error = '';
            state.message = action.payload.message;
        },
        readNotificationsFailure: (state, action) => {
            state.error = action.payload;
        },
        markAsReadSuccess: (state, action) => {
            const notificationID = action.payload;
            state.notifications = state.notifications.map((notification) => notification.id === notificationID ? { ...notification, isRead: true } : notification)
        },
        fetchNotificationsStatusSuccess: (state, action) => {
            state.switchStatus = action.payload;
            state.error = '';
        },
        fetchNotificationsStatusFailure: (state, action) => {
            state.error = action.payload;
        },
        changeNotificationsStatusSuccess: (state, action) => {
            state.switchStatus = !state.switchStatus;
            state.error = '';
        },
        readNewNotificationsSuccess: (state, action) => {
            state.newNotification = action.payload
            state.error = '';
        },
        readNewNotificationsFailure: (state, action) => {
            state.newNotification = null
            state.error = action.payload;
        },
    },
});

export const {
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    deleteNotificationsSuccess,
    deleteNotificationsFailure,
    markAsReadSuccess,
    fetchNotificationsStatusSuccess,
    fetchNotificationsStatusFailure,
    changeNotificationsStatusSuccess,
    readNotificationsSuccess,
    readNotificationsFailure,
    readNewNotificationsSuccess,
    readNewNotificationsFailure
} = notificationSlice.actions;

export default notificationSlice.reducer;