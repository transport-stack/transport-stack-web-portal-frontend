import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/auth/authSlice';
import loaderReducer from './slices/loader/loaderSlice';
import verifyReducer from './slices/verify/verifySlice'
import rootSaga from './sagas/rootSaga';
import helpSupportReducer from './slices/helpsupport/helpSupportSlice';
import notificationReducer from './slices/notifications/notificationSlice';
import cookiesReducer from './slices/cookies/cookiesSlice';

//Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth','verify','cookies']
}

const rootReducer = combineReducers({
    auth: authReducer,
    loader: loaderReducer,
    verify:verifyReducer,
    helpSupport: helpSupportReducer,
    notifications: notificationReducer,
    cookies:cookiesReducer
    //Add Other reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

//Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false, thunk: false }).concat(sagaMiddleware)
});

//Create a persistor
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store