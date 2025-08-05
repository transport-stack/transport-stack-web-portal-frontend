import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
    name: 'loader',
    initialState: {
        activeRequests: 0
    },
    reducers: {
        incrementRequests: (state) => {
            state.activeRequests += 1;
        },
        decrementRequests: (state) => {
            state.activeRequests = Math.max(state.activeRequests - 1, 0)
        },
    },
});

export const { incrementRequests, decrementRequests } = loaderSlice.actions;

export default loaderSlice.reducer;