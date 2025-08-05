import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: null,
        profile: null,
        role: null,
        error: null
    },
    admin: {
        accessToken: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: null,
        profile: null,
        role: null,
        error: null
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoginSuccess: (state, action) => {
            const { accessToken, refreshToken, tokenExpiresAt, firstName, lastName, mobileNumber, organizationName, username, id, role, dialCode } = action.payload;
            if (role.includes("ROLE_USER")) {
                state.user.accessToken = accessToken;
                state.user.refreshToken = refreshToken;
                state.user.tokenExpiresAt = Date.now() + tokenExpiresAt * 1000;
                state.user.isAuthenticated = true;
                state.user.profile = {
                    firstName: firstName,
                    lastName: lastName,
                    mobileNumber: mobileNumber,
                    organizationName: organizationName,
                    username: username,
                    id: id,
                    dialCode: dialCode,
                };
                state.user.role = role;
                state.user.error = null;
            } else {
                state.user.error = "User is not Authorized to access";
                state.user.isAuthenticated = false;
            }
        },
        userLoginFailure: (state, action) => {
            state.user.error = action.payload;
        },
        logoutUser: (state) => {
            state.user.accessToken = null;
            state.user.refreshToken = null;
            state.user.tokenExpiresAt = null;
            state.user.profile = null;
            state.user.role = null;
            state.user.isAuthenticated = null;
            state.user.error = null;
        },
        resetUserError: (state) => {
            state.user.error = null
        },
        adminLoginSuccess: (state, action) => {
            const { accessToken, refreshToken, tokenExpiresAt, firstName, lastName, mobileNumber, organizationName, username, id, role } = action.payload;
            if (role.includes("ROLE_ADMIN") || role.includes('ROLE_SUPER_ADMIN') || role.includes('ROLE_DATA_PROVIDER')) {
                state.admin.accessToken = accessToken;
                state.admin.refreshToken = refreshToken;
                state.admin.tokenExpiresAt = Date.now() + tokenExpiresAt * 1000;
                state.admin.role = role;
                state.admin.profile = {
                    firstName: firstName,
                    lastName: lastName,
                    mobileNumber: mobileNumber,
                    organizationName: organizationName,
                    username: username,
                    id: id,
                };
                state.admin.error = null;
                state.admin.isAuthenticated = true;

            } else {
                state.admin.error = "User is not Authorized to access";
                state.admin.isAuthenticated = false;
            }

        },
        adminLoginFailure: (state, action) => {
            state.admin.error = action.payload;
        },
        logoutAdmin: (state) => {
            state.admin.accessToken = null;
            state.admin.refreshToken = null;
            state.admin.tokenExpiresAt = null;
            state.admin.profile = null;
            state.admin.role = null;
            state.admin.isAuthenticated = null;
            state.admin.error = null;
        },
        resetAdminError: (state) => {
            state.admin.error = null
        },

        refreshUserTokenSuccess: (state, action) => {
            const { accessToken, tokenExpiresAt } = action.payload;
            state.user.accessToken = accessToken;
            state.user.tokenExpiresAt = Date.now() + tokenExpiresAt * 1000;
        },
        refreshUserTokenFailure: (state, action) => {
            state.user.error = action.payload;
        },
        refreshAdminTokenSuccess: (state, action) => {
            const { accessToken, tokenExpiresAt } = action.payload;
            state.admin.accessToken = accessToken;
            state.admin.tokenExpiresAt = Date.now() + tokenExpiresAt * 1000;
        },
        refreshAdminTokenFailure: (state, action) => {
            state.admin.error = action.payload;
        },
    },
});

export const {
    userLoginSuccess,
    userLoginFailure,
    logoutUser,
    adminLoginSuccess,
    adminLoginFailure,
    logoutAdmin,
    resetUserError,
    resetAdminError,
    refreshUserTokenSuccess,
    refreshUserTokenFailure,
    refreshAdminTokenSuccess,
    refreshAdminTokenFailure,
} = authSlice.actions;

export default authSlice.reducer;