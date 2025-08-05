import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userOtpDetails: {
    mobileNo: null,
    email: null,
    userId: null,
    register: null,
  },
  userMobileNumberDetails: {
    mobileNo: '',
    userId: '',
  },
  mobileNoverified: {
    isValidated: false
  },
  verifiedScreen: {
    email: null,
    mobile: null,
  },
  resendOtpClicks: {
    email: 0,
    mobile: 0,
  },
  dataServiceLogin: {
    status: false,
    path: ''
  },

};

const registerSlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    verifyUserOtpDetails: (state, action) => {
      state.userOtpDetails.email = action.payload.email;
      state.userOtpDetails.mobileNo = action.payload.mobileNo;
      state.userOtpDetails.userId = action.payload.userId;
      state.userOtpDetails.register = action.payload.register;
    },
    verifyUserMobileNumber: (state, action) => {
      state.userMobileNumberDetails.mobileNo = action.payload.mobileNo;
      state.userMobileNumberDetails.userId = action.payload.userId;
      state.userMobileNumberDetails.dialCode = action.payload.dialCode;
    },
    verifyMobileOtpFromProfile: (state, action) => {
      state.mobileNoverified.isValidated = action.payload.isValidated;
    },
    removeVerifiedUserOtpDetails: (state) => {
      state.userOtpDetails.email = null;
      state.userOtpDetails.mobileNo = null;
      state.userOtpDetails.userId = null;
      state.userOtpDetails.register = null;
    },
    setVerifiedScreen: (state, action) => {
      state.verifiedScreen.email = action.payload.email;
      state.verifiedScreen.mobile = action.payload.mobile;
    },
    setResendOtpClicks: (state, action) => {
      state.resendOtpClicks.email = action.payload.email;
      state.resendOtpClicks.mobile = action.payload.mobile;
    },
    userDataServiceLogin: (state, action) => {
      state.dataServiceLogin.status = action.payload.status;
      state.dataServiceLogin.path = action.payload.path;
    },
  },
});

export const {
  verifyUserOtpDetails,
  removeVerifiedUserOtpDetails,
  setVerifiedScreen,
  setResendOtpClicks,
  verifyUserMobileNumber,
  verifyMobileOtpFromProfile,
  userDataServiceLogin
} = registerSlice.actions;

export default registerSlice.reducer;
