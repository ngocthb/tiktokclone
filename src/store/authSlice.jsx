import { createSlice } from "@reduxjs/toolkit";
import api from "../config/axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const res = await api.post("auth/login", { email, password });

    const authData = res.data.data;
    sessionStorage.setItem("authData", JSON.stringify(authData));

    sessionStorage.setItem("token", JSON.stringify(res.data.meta.token));

    dispatch(loginSuccess(authData));
  } catch (error) {
    dispatch(loginFailure(error.response));
  }
};

// Kiểm tra token khi ứng dụng khởi chạy
// export const checkLoginStatus = () => (dispatch) => {
//   const authData = JSON.parse(localStorage.getItem("authData"));

//   if (authData) {
//     const currentTime = new Date().getTime();
//     if (currentTime < authData.expiresAt) {
//       dispatch(loginSuccess(authData));
//     } else {
//       // Token hết hạn
//       localStorage.removeItem("authData");
//       dispatch(logout());
//     }
//   }
// };

// Xử lý đăng xuất
export const logoutUser = () => (dispatch) => {
  sessionStorage.removeItem("authData");
  sessionStorage.removeItem("token");
  dispatch(logout());
};

export default authSlice.reducer;
