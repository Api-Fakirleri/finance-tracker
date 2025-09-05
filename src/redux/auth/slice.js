import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { register, login, logout, getCurrent } from "./operations";

const emptyUser = { id: null, username: null, email: null, balance: 0 };

const initialState = {
  user: emptyUser,
  token: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  isRefreshing: false,
};

// payload farklı şekillerde dönebilir:
// A) { token, user: { id, username, email, balance } }
// B) { id, username, email, balance } (token yoksa)
// Bu yardımcı, hangisi geldiyse uygun user’ı çıkarır:
const pickUser = (payload) => {
  if (!payload) return emptyUser;
  if (payload.user)
    return {
      id: payload.user.id ?? null,
      username: payload.user.username ?? null,
      email: payload.user.email ?? null,
      balance: typeof payload.user.balance === "number" ? payload.user.balance : 0,
    };
  return {
    id: payload.id ?? null,
    username: payload.username ?? null,
    email: payload.email ?? null,
    balance: typeof payload.balance === "number" ? payload.balance : 0,
  };
};

const slice = createSlice({
  
  name: "auth",
  initialState,
  reducers: {
    resetAuthError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) => {
    // --- addCase'ler ÖNCE ---
    // current
    b.addCase(getCurrent.pending, (s) => {
      s.isRefreshing = true;
    });
    b.addCase(getCurrent.fulfilled, (s, { payload }) => {
      s.isRefreshing = false;
      s.user = pickUser(payload);
      s.isLoggedIn = true;
      s.error = null;
    });
    b.addCase(getCurrent.rejected, (s) => {
      s.isRefreshing = false;
      s.isLoggedIn = false;
      s.user = emptyUser;
    });

    // logout
    b.addCase(logout.fulfilled, () => {
      return initialState;
    });

    // --- addMatcher'lar SONRA ---

    // register/login pending
    b.addMatcher(isAnyOf(register.pending, login.pending), (s) => {
      s.loading = true;
      s.error = null;
    });
    // register/login fulfilled
    b.addMatcher(isAnyOf(register.fulfilled, login.fulfilled), (s, { payload }) => {
      s.loading = false;
      s.error = null;
      s.user = pickUser(payload);
      s.token = payload?.token ?? s.token; // bazı signup’larda token gelmeyebilir
      s.isLoggedIn = Boolean(s.token);
    });
    // register/login rejected
    b.addMatcher(isAnyOf(register.rejected, login.rejected), (s, { payload }) => {
      s.loading = false;
      s.error = payload?.message || "Auth error";
    });
  },
});

export const { resetAuthError } = slice.actions;
export const authReducer = slice.reducer;
