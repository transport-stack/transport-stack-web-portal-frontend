import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cookiesMeasureStatus: true,
};

const cookiesSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    setUseCookiesMeasureRequest: (state, action) => {
      state.cookiesMeasureStatus = action.payload.status;
    },
  },
});

export const { setUseCookiesMeasureRequest } = cookiesSlice.actions;

export default cookiesSlice.reducer;
