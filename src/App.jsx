import { Routes, Route } from "react-router-dom";


import { useEffect, lazy, Suspense } from "react";

import { useDispatch } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import { getCurrent } from "./redux/auth/operations";
import Loader from "./components/Loader/Loader";
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Dash = lazy(() => import("./pages/Dash/Dash"));
const StatisticsDashboard = lazy(() =>
  import("./pages/Statistics/StatisticsDashboard/StatisticsDashboard")
);

import CurrencyLayout from "./components/Currency/CurrencyLayout/CurrencyLayout";

const CurrencyTab = lazy(() =>
  import("./components/Currency/CurrencyLayout/CurrencyLayout")
);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrent());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dash />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <StatisticsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/currency"
          element={
            <ProtectedRoute>
              <CurrencyLayout />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </Suspense>
  );
}
