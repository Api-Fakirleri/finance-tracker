import { createAsyncThunk } from "@reduxjs/toolkit";
import { setToken, removeToken, userTransactionsApi } from "../../shared/api";
import axios from "axios";
const AUTH_ENDPOINTS = {
  signUp: "/api/auth/sign-up",
  signIn: "/api/auth/sign-in",
  signOut: "/api/auth/sign-out",
  current: "/api/users/current",
};
export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/transactions", transactionData);
      return response.data; // backend’den gelen yeni transaction
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// REGISTER → backend username bekliyor
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await userTransactionsApi.post(AUTH_ENDPOINTS.signUp, { username, email, password });
      // Çoğu senaryoda { token, user } döner; bazen direkt user dönebilir.
      if (data?.token) setToken(data.token);
      return data; // { token, user }  veya  { id, username, email, balance }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Register failed" });
    }
  }
);

// LOGIN
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await userTransactionsApi.post(AUTH_ENDPOINTS.signIn, { email, password });
    if (data?.token) setToken(data.token);
    return data; // { token, user }
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});

// LOGOUT
export const logout = createAsyncThunk("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    if (token) setToken(token);
    await userTransactionsApi.delete(AUTH_ENDPOINTS.signOut);
    removeToken();
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Logout failed" });
  }
});

// REFRESH PAGE -> Refresh yapıldığında token silinmemesi için
export const getCurrent = createAsyncThunk("auth/refresh", async (_, thunkApi) => {
  const savedToken = thunkApi.getState().auth.token;
  if (savedToken) {
    setToken(savedToken);
  } else {
    return thunkApi.rejectWithValue("Token doesn't exist");
  }
  // CURRENT USER →  { id, username, email, balance }
  try {
    const { data } = await userTransactionsApi.get(AUTH_ENDPOINTS.current);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

// Userın BALANCE değeri döner
export const getBalanceThunk = createAsyncThunk("getBalannce", async (_, thunkApi) => {
  try {
    const { data } = await userTransactionsApi.get(AUTH_ENDPOINTS.current);
    return data.balance;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});
