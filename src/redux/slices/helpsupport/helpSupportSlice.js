import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    submitting: false,
    submitError: null,
    submitSuccess: null,
}

const helpSupportSlice = createSlice({
    name: 'helpSupport',
    initialState,
    reducers: {
        submitSupportFormRequest: (state) => {
            state.submitting = true;
            state.submitError = null;
            state.submitSuccess = null;
        },
        submitSupportFormSuccess: (state, action) => {
            state.submitting = false;
            state.submitError = null;
            state.submitSuccess = action.payload;

        },
        submitSupportFormFailure: (state, action) => {
            state.submitting = false;
            state.submitSuccess = null;
            state.submitError = action.payload;
        },
        resetSupportFormState: () => initialState,
    },
});

export const {
    submitSupportFormRequest,
    submitSupportFormSuccess,
    submitSupportFormFailure,
    resetSupportFormState,
} = helpSupportSlice.actions;

export default helpSupportSlice.reducer;