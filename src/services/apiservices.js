import axios from "axios";
import store from '../redux/store';
import { logoutAdmin, logoutUser } from "../redux/slices/auth/authSlice";
import { incrementRequests, decrementRequests } from "../redux/slices/loader/loaderSlice";


// const API_BASE_URL = "http://13.200.235.35:8080/runner-service-1.0"; // Dev Replace with API base URL
// const API_BASE_URL = "http://13.233.123.19/"; // QA Replace with API base URL
// const API_BASE_URL = "https://delhi.transportstack.in/"; // Prod Replace with API base URL

export const apiService = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

//Add request interceptor
apiService.interceptors.request.use(
  (config) => {
    store.dispatch(incrementRequests());
    return config;
  },
  (error) => {
    store.dispatch(decrementRequests());
    return Promise.reject(error);
  }
);

//Add response interceptor
apiService.interceptors.response.use(
  (response) => {
    store.dispatch(decrementRequests());
    return response;
  },
  (error) => {
    store.dispatch(decrementRequests());
    if (error?.response && error?.response?.status === 401 && !error?.response?.request?.responseURL?.includes('api/user/login') && !error?.response?.request?.responseURL?.includes('api/admin/login')) {
      if (error?.response?.request?.responseURL?.includes('api/user/generate-new-token')) {
        store.dispatch(logoutUser());
        store.dispatch(logoutAdmin());
      } else {
        store.dispatch({ type: "auth/refreshUserTokenRequest" });
      }
    }
    return Promise.reject(error);
  }
);

//Register 
export const registerAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/register", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error registering user: ", error);
    throw error;
  }
};

//Register API By admin
export const registerAPIByAdmin = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/register-by-admin", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error registering user: ", error);
    throw error;
  }
};

//Approve/Reject dataset request
export const datasetRequestDetailAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,

      },
    };
    const response = await apiService.post("/api/dataset/request/approval", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Dataset Request API Failed: ", error);
    throw error;
  }
};

//Approve/Reject service request
export const servicesetRequestDetailAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/serviceset/request/approval", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Service Request API Failed: ", error);
    throw error;
  }
};

//Send Mobile OTP
export const sendMobileOtpAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/send-tentative-mobile-otp", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Send Mobile OTP API error: ", error);
    throw error;
  }
};

//Send Mobile OTP
export const getAdminApprovalEmailTriggerAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/send-registration-success-email", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Send Mobile OTP API error: ", error);
    throw error;
  }
};

//Send Email OTP
export const sendEmailOtpAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/send-email-otp", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Send Email OTP API error: ", error);
    throw error;
  }
};

//Verify Email OTP
export const verifyEmailOtpAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/verify-email-otp", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Verify Email OTP API error: ", error);
    throw error;
  }
};

//Approve  User
export const approveUserAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/user/activate-user", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Approve user API  error: ", error);
    throw error;
  }
};

// Delete User/Admin API
export const deleteUserAPI = async (name, data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data: data,
    }

    const response = await apiService.delete("/api/" + name + "/delete-user", config);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error in delete user API: ", error);
    throw error;
  }
};

//Activate User
export const activateUserAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/user/reactivate-user", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Activate User API error: ", error);
    throw error;
  }
};

//Deactivate User
export const deactivateUserAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/deactivate-user", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Deactivate User API error: ", error);
    throw error;
  }
};

//Getting registered user list
export const getUserLists = async (param) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/user/get-all-approved-users-by-page?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching userList API data: ", error);
    throw error;
  }
};

//Getting registered user list for approval
export const getAllUsersAPI = async (param) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/user/get-all-users-by-page?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching userList API data: ", error);
    throw error;
  }
};

//Calling admin approval mode
export const getAdminApprovalModeAPI = async () => {
  try {
    // const state = store.getState();
    // const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/super-admin/settings/admin_approval_mode", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin approval mode: ", error);
    throw error;
  }
};

//updating admin approval mode
export const updateAdminApprovalModeAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/super-admin/settings/update", data, options);
    return response.data;
  } catch (error) {
    console.error("Error updating admin approval mode: ", error);
    throw error;
  }
};

//Getting dataset list
export const getDataLists = async (param) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/dataset/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset list API data: ", error);
    throw error;
  }
};

//Getting dataset request list for approval
export const getDatasetLists = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/request/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset request approval list API data: ", error);
    throw error;
  }
};

//Getting service request list for approval
export const getServicesetLists = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/serviceset/request/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching service request approval list API data: ", error);
    throw error;
  }
};


//Getting service list
export const getServiceLists = async (param) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/serviceset/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching service list API data: ", error);
    throw error;
  }
};

//Getting all the document list
export const getDocumentationList = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/document/getAllDocuments?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching document list: ", error);
    throw error;
  }
};

//Getting single document list with id
export const getDocumentDetailsByIdAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/document/getDocumentById?id=" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching document details: ", error);
    throw error;
  }
};

//Create new document 
export const createDocumentApi = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/document/createDocument", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error creating new document: ", error);
    throw error;
  }
};

//Update a document 
export const updateDocumentApi = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/document/updateDocument", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error while updating document: ", error);
    throw error;
  }
};

// Delete Document data
export const deleteDocumentAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/document/deleteDocument", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Download Document data
export const downloadDocumentAPI = async (data) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: 'blob'
    };
    const response = await apiService.get("/api/document/downloadDocument?key=" + data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error downloading the file: ", error);
    throw error;
  }
};


//Getting Help & Support list
export const getHelpAndSupportList = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/help-support/get-all-queries?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching help&support list: ", error);
    throw error;
  }
};

//Get Query Data with id
export const getQueryDataApi = async (id) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/help-support/query/" + id, options);
    return response.data;
  } catch (error) {
    console.error("Error while getting query data with id: ", error);
    throw error;
  }
};


//Update a help and service query 
export const updateQueryAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/help-support/update-query", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error while updating query: ", error);
    throw error;
  }
};

//Getting dataset details
export const getDataDetails = async (id, type = 'admin') => {
  try {
    const state = store.getState();
    let token = '';
    if (type === 'user') {
      token = state.auth.user.accessToken;
    }

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
      },
    };
    const response = await apiService.get("/api/dataset/detail?id=" + id + "&userCategory=" + type, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset details API data: ", error);
    throw error;
  }
};

//Getting service details
export const getServiceDetails = async (id) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/serviceset/detail?id=" + id, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching service details API data: ", error);
    throw error;
  }
};

//Change password
export const changePasswordAPI = async (data, accessToken) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
    };
    const response = await apiService.post("/api/user/change-password", data, options);
    return response.data;
  } catch (error) {
    console.error("Error in change password API: ", error);
    throw error;
  }
};

//view dataset request detail
export const viewDatasetAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        id: data.id
      }
    };
    const response = await apiService.get("/api/dataset/request/detail", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching datset request detail API: ", error);
    throw error;
  }
};

//View service request details 
export const viewServicesetAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        id: data.id
      }
    };
    const response = await apiService.get("/api/serviceset/request/detail", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching service request details API: ", error);
    throw error;
  }
};

//View user
export const viewUserAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/view-user", data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details API: ", error);
    throw error;
  }
};

//Forgot password
export const forgotPasswordAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/forgot-password", data, options);
    return response.data;
  } catch (error) {
    console.error("Error in forgot password API: ", error);
    throw error;
  }
};

//Reset password
export const resetPasswordAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/confirm-forgot-password", data, options);
    return response.data;
  } catch (error) {
    console.error("Error in Reset password API: ", error);
    throw error;
  }
};

// Reset password when admin creates credentials
export const resetPasswordAdminAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/reset-password", data, options);
    return response.data;
  } catch (error) {
    console.error("Error in reset password API: ", error);
    throw error;
  }
};

//Create new Dataset 
export const postDatasetAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/dataset/create", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error creating new Dataset: ", error);
    throw error;
  }
};


//Update user details
export const updateUserDetailsAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("api/user/update-user-details", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error updating user details: ", error);
    throw error;
  }
};

//Modify data set 
export const editDataSetAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("api/dataset/update", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error in modify dataset API: ", error);
    throw error;
  }
};

// Delete API
export const deleteAPI = async (name, data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/" + name + "/delete", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error in delete API: ", error);
    throw error;
  }
};

//Create new Service 
export const postServiceAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/serviceset/create", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error creating new service: ", error);
    throw error;
  }
};

//Modify service
export const editServiceAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("api/serviceset/update", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error in modify service API: ", error);
    throw error;
  }
};

//Upload File
export const uploadFileAPI = async (data, category) => {
  //(data)
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
      },
    };
    let requestURL = ''
    if (category === 'dataset') {
      requestURL = "/api/dataset/upload";
    } else if (category === 'service') {
      requestURL = "/api/serviceset/upload";
    }
    const response = await apiService.post(requestURL, data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error Uploading File: ", error);
    throw error;
  }
};

//Delete uploaded file
export const deleteFileAPI = async (data, category) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    let requestURL = ''
    if (category === 'dataset') {
      requestURL = "/api/dataset/deleteS3File";
    } else if (category === 'service') {
      requestURL = "/api/serviceset/deleteS3File";
    }
    const response = await apiService.post(requestURL, data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error deleting file: ", error);
    throw error;
  }
};

//Getting master dropdown list
export const getDropdownAPI = async (name, userType = 'user', accessTokenRequired) => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessTokenRequired ? 'Bearer ' + (userType === 'admin' ? state.auth.admin.accessToken : state.auth.user.accessToken) : '',
      },
    };
    const response = await apiService.get("/api/master/" + name, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error fetching master data: ", error);
    throw error;
  }
};

// Mobile OTP API's
export const getMobileOtpAPI = async (name, data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.post("/api/user/" + name, data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error sending Mobile OTP: ", error);
    throw error;
  }
};

// Request form submission
export const postRequestFormAPI = async (data, type) => {
  try {
    const state = store.getState();
    const token = state.auth.user.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    let requestURL = ''
    if (type === 'Data') {
      requestURL = "/api/dataset/request/submit";
    } else if (type === 'Service') {
      requestURL = "/api/serviceset/request/submit";
    }
    const response = await apiService.post(requestURL, data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error Submitting Request Form: ", error);
    throw error;
  }
};

//Download file
export const downloadFileAPI = async (fileurl, userType = "user", authRequired = "true") => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        "Content-Type": "application/octet-stream",
        'Authorization': authRequired ? 'Bearer ' + (userType === 'admin' ? state.auth.admin.accessToken : state.auth.user.accessToken) : '',
      },
      responseType: 'blob'
    };
    const response = await apiService.get(fileurl, options);
    return response;
  } catch (error) {
    console.error("Error downloading the file: ", error);
    throw error;
  }
};

//Get Agency Options 
export const getAgencyOptionsAPI = async () => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/agency-list", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Agency options: ", error);
    throw error;
  }
};

//Get Category Options 
export const getCategoryOptionsAPI = async (params) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/category-list?agency=" + params, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Catergory options: ", error);
    throw error;
  }
};

//Search audit log api list
export const searchAuditLogApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/audit-trails?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error while searching audit log list: ", error);
    throw error;
  }
};

//search view reports api list
export const getViewReportsApi = async (path) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/" + path, options);
    return response.data;
  } catch (error) {
    console.error("Error while getting reports list : ", error);
    throw error;
  }
};

//Get Filename Options 
export const getFilenameOptionsAPI = async (agency, category) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/file-list?agency=" + agency + "&category=" + category, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching filename options: ", error);
    throw error;
  }
};

//Get admin users list 
export const getAdminUserList = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/super-admin/get-all-approved-users-by-page?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Admin user list: ", error);
    throw error;
  }
};

//Deactivate Admin
export const deactivateAdminAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/super-admin/deactivate-user", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Deactivate Admin API error: ", error);
    throw error;
  }
};

//Register Admin user API By superadmin
export const registerAdminAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/super-admin/register-by-admin", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error registering admin user: ", error);
    throw error;
  }
};

//Update Admin user API By superadmin
export const updateAdminAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/super-admin/update-user-details", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Error updating admin user: ", error);
    throw error;
  }
};

//view Admin
export const viewAdminAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/super-admin/view-user", data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin user: ", error);
    throw error;
  }
};

//Get Role Options 
export const getRoleOptionsAPI = async () => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/super-admin/list-role-types", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Role options: ", error);
    throw error;
  }
};

//Getting dashboard metrics data api
export const getUserDashboardMetrics = async (path) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/" + path, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics: ", error);
    throw error;
  }
};

//Getting dashboard metrics data api
export const getAverageApprovalTimeApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/request-management-dashboard/avg-approval-time?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting Breakdown of total data requests
export const getBreakdownDataRequestApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/request-management-dashboard/dataset-breakdown?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting Breakdown of total service requests
export const getBreakdownServiceRequestApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/request-management-dashboard/serviceset-breakdown?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting Type of use for service request
export const getTypeServiceRequestApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/service-management-dashboard/purpose-category?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting Type of use for data request
export const getTypeDataRequestApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/data-management-dashboard/purpose-category?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

// //Getting Type of use for data request
// export const getDataTypeRequestTypeApi = async (param) => {
//   try {
//     const state = store.getState();
//     const token = state.auth.admin.accessToken;
//     const options = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token,
//       },
//     };
//     const response = await apiService.get("/api/report/data-management-dashboard/purpose-category?" + param, options);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user dashboard metrics by organization type: ", error);
//     throw error;
//   }
// };

//Getting Datasets Availed by Type
export const getDatasetAvailedTypeDataApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/data-catalogue-dashboard/metrics-by-type?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting Datasets Availed by Trend
export const getDatasetAvailedTrendDataApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("api/report/data-catalogue-dashboard/datasets-availed-metrics?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting top dataset download
export const getTopDatasetDownloadApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/data-catalogue-dashboard/top-downloads?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting top dataset subscribed
export const getTopDatasetSubscribedApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/data-catalogue-dashboard/top-subscriptions?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting breakdown api for help and support dashboard
export const getBreakdownDataApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/help-support/get-queries-by-category?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting service Charging Models with Service Counts
export const getServiceCountModelApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/service-catalogue-dashboard/metrics-by-charging-model?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard registration metrics: ", error);
    throw error;
  }
};

//Getting Top Services Subscribed Metrics
export const getServiceTopSubscribedApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/service-catalogue-dashboard/top-services-subscribed-metrics?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard registration metrics: ", error);
    throw error;
  }
};

//Getting Services Availed data
export const getSevicesAvailedApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/service-catalogue-dashboard/services-availed-metrics?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard registration metrics: ", error);
    throw error;
  }
};

//Getting user dashboard metrics by organization type
export const getUserDashboardPieChartApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/user-dashboard/metrics-by-org-type?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard metrics by organization type: ", error);
    throw error;
  }
};

//Getting user dashboard registration metrics
export const getUserDashboardLineChartApi = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/report/user-dashboard/registration-metrics?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user dashboard registration metrics: ", error);
    throw error;
  }
};

//Download resource API
export const downloadResourceAPI = async (category, subcategory) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: 'blob'
    };
    const response = await apiService.get("/api/document/download/" + category + '/' + subcategory, options);
    return response;
  } catch (error) {
    console.error("Error downloading resource: ", error);
    throw error;
  }
};

//Show Notification list
export const getNotificationListAPI = async (data, userType = 'user') => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (userType === 'admin' ? state.auth.admin.accessToken : state.auth.user.accessToken),
      },
    };
    const response = await apiService.get("/api/notifications/list?userId=" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification list API: ", error);
    throw error;
  }
};

//Delete notification
export const deleteNotificationAPI = async (data, userType = 'user') => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (userType === 'admin' ? state.auth.admin.accessToken : state.auth.user.accessToken),
      },
    };
    const response = await apiService.post("/api/notifications/deleteNotification?notificationId=" + data, '', options);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification: ", error);
    throw error;
  }
};

//Status report - User report API
export const userReportAPI = async (data) => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.auth.admin.accessToken,
      },
    };
    const response = await apiService.get("/api/report/user-status?" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user report data: ", error);
    throw error;
  }
};

export const fetchSearchResultsAPI = async (data) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await apiService.get("/api/search/results?searchTerm=" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching user report data: ", error);
    throw error;
  }
}

//Super Admin - pending request list
export const getPendingRequestAPI = async (data, id) => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.auth.admin.accessToken,
      },
    };
    const response = await apiService.get("/api/super-admin/pending-request/" + id + "?" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending request list API: ", error);
    throw error;
  }
};


// Super Admin - view pending request details
export const getPendingRequestDetailsAPI = async (data, id) => {
  try {
    const state = store.getState();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.auth.admin.accessToken,
      },
    };
    const response = await apiService.get("/api/super-admin/pending-request/" + id + "/details?" + data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending request details API: ", error);
    throw error;
  }
};

// Super Admin - view pending request details
export const updateRequestAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,

      },
    };
    const response = await apiService.post("/api/document/request/updateRequestStatus", data, options);
    return response.data;
  } catch (error) {
    // Handle or throw the error as needed
    console.error("Update Document delete Request API Failed: ", error);
    throw error;
  }
};

//Getting Featured products list
export const getFeaturedProducts = async (param) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await apiService.get("/api/user-requests/featured-products", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products list API data: ", error);
    throw error;
  }
};

//My Subscription/Request list 

export const getSubscribeRequestList = async (type, pageNumber) => {
  try {
    const state = store.getState();
    const token = state.auth.user.accessToken;
    const userid = state.auth.user.profile.id;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/user-" + type + "/list?page=" + (pageNumber - 1) + "&size=9&userId=" + userid, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching My subscription List API data: ", error);
    throw error;
  }
};

//unsubscribing the data or service request
export const getUnsubscribeDataApi = async (name, requestId) => {
  try {
    const state = store.getState();
    const token = state.auth.user.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.delete("/api/user-subscriptions/" + name + "/unsubscribe/" + requestId, options);
    return response.data;
  } catch (error) {
    console.error("Error while un subscribing data or service : ", error);
    throw error;
  }
};

//My Subscription/Request Details 

export const getSubscribeRequestDetails = async (type, data) => {
  try {
    const state = store.getState();
    const token = state.auth.user.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/user-" + type + "/details", data, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching My subscription/ Request details API data: ", error);
    throw error;
  }
};

//Getting Subscribed status details
export const getSubscribedStatus = async (id, type) => {
  try {
    const state = store.getState();
    const token = state.auth.user.accessToken;

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
      },
    };
    let requestURL = '';
    if (type === 'dataset') {
      requestURL = '/api/user-subscriptions/dataset/subscription-status?datasetId=';
    } else if (type = 'serviceset') {
      requestURL = '/api/user-subscriptions/serviceSet/subscription-status?serviceSetId=';
    }
    const response = await apiService.get(requestURL + id, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching subscribed status details API data: ", error);
    throw error;
  }
};

//Get Serviceset master Options 
export const getServiceOptionsAPI = async () => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/serviceset/serviceset-master", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Service set  options: ", error);
    throw error;
  }
};

//Get status master
export const getStatusFilterAPI = async () => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/admin/list-request-status", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching status options: ", error);
    throw error;
  }
};

//Get dataset provider
export const getDataProvidersAPI = async (value) => {
  try {
    const response = await apiService.get("/api/dataset/filter/data-provider?datasetTypeId=" + value);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataprovider options: ", error);
    throw error;
  }
};

//Get dataset API Availability options
export const getAPIavailabilityAPI = async (value1, value2) => {
  try {
    const response = await apiService.get("/api/dataset/filter/api-availability?datasetTypeId=" + value1 + "&dataProviderId=" + value2);
    return response.data;
  } catch (error) {
    console.error("Error fetching API Availability options: ", error);
    throw error;
  }
};

//Get service charging model option by type of service
export const getChargingModelByTypeAPI = async (value) => {
  try {
    const response = await apiService.get("/api/serviceset/filter/charging-model/by-service-type?serviceSetTypeId=" + value);
    return response.data;
  } catch (error) {
    console.error("Error fetching charging model options: ", error);
    throw error;
  }
};

//Get Transport mode option by type of sevice
export const getTransportModeAPI = async (value) => {
  try {
    const response = await apiService.get("/api/serviceset/filter/transport-mode?serviceSetTypeId=" + value);
    return response.data;
  } catch (error) {
    console.error("Error fetching transport mode options: ", error);
    throw error;
  }
};
//Get service charging model option by type of service and transport mode
export const getChargingModelByServiceModeAPI = async (value1, value2) => {
  try {
    const response = await apiService.get("/api/serviceset/filter/charging-model?serviceSetTypeId=" + value1 + "&transportModeId=" + value2);
    return response.data;
  } catch (error) {
    console.error("Error fetching charging model options: ", error);
    throw error;
  }
};

/*
  New API integrations for below task items:

  1. Registry for Admin/Data Provider and Data User to be kept separate. Unique combination of email id and mobile number
  should be able to register as data user as well as data provider / admin

  2. Should include a predefined dropdown for organisation that are reflecting in dataset management as well.
  So that view for data provider is linked to its profile type

  3. Include dropdown list for all available admin/data providers. Also include option to select multiple approver.
*/

export const getOrganizationListApi = async () => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await apiService.get("/api/master/organization-name", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Role options: ", error);
    throw error;
  }
};

//Get Category Options
export const getDesignatedApproverUsersAPI = async (params) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/super-admin/designated-approver-users?organizationNames=" + params, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching designated approver list: ", error);
    throw error;
  }
};

export const getChangeRequestStatusFilterAPI = async () => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/admin/change-request-status", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching change request status options: ", error);
    throw error;
  }
};

export const getDatasetChangeRequestLists = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/change-request/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset change request list API data: ", error);
    throw error;
  }
};

export const getServicesetChangeRequestLists = async (param) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/serviceset/change-request/list?" + param, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching service request approval list API data: ", error);
    throw error;
  }
};

export const getDatasetChangeRequestDetailAPI = async (params) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/dataset/change-request/detail?id=" + params, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset change request details: ", error);
    throw error;
  }
};

export const getServiceChangeRequestDetailAPI = async (params) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.get("/api/serviceset/change-request/detail?id=" + params, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching dataset change request details: ", error);
    throw error;
  }
};

export const approveRejectDatasetUpdateRequestAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/dataset/change-request/approval", data, options);
    return response.data;
  } catch (error) {
    console.error("Dataset Update Request API Failed: ", error);
    throw error;
  }
};

export const approveRejectServiceUpdateRequestAPI = async (data) => {
  try {
    const state = store.getState();
    const token = state.auth.admin.accessToken;
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    };
    const response = await apiService.post("/api/serviceset/change-request/approval", data, options);
    return response.data;
  } catch (error) {
    console.error("Service Update Request API Failed: ", error);
    throw error;
  }
};

export const getApiDoc = async () => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    const response = await apiService.get("/v3/docs", options);
    return response.data;
  } catch (error) {
    console.error("Error fetching Role options: ", error);
    throw error;
  }
};
