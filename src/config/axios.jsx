import axios from "axios";
import Swal from "sweetalert2";

const baseUrl = "https://tiktok.fullstack.edu.vn/api/";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = sessionStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore, null);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred. Please try again.";

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        message = "You need to login to perform this action.";
      }
      // else if (status === 403) {
      //   message =
      //     "Forbidden. You don't have permission to perform this action.";
      // } else if (status === 404) {
      //   message = "Resource not found.";
      // } else if (status === 409) {
      //   message = "Conflict occurred. Please check your input.";
      // } else if (status >= 500) {
      //   message = "Server error. Please try again later.";
      // }
    }
    // else if (error.request) {
    //   message =
    //     "No response from server. Please check your internet connection.";
    // } else {
    //   message = error.message || "An unknown error occurred.";
    // }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      timer: 1500,
      showConfirmButton: false,
      position: "center",
    });

    return Promise.reject(error);
  }
);

export default api;
