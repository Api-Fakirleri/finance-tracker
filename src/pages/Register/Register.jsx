import React from "react";
import logo from "./logo.png";
import css from "./Register.module.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/auth/operations";
import { Navigate, useNavigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../../redux/auth/selectors";
import { selectTransactionsLoading } from "../../redux/transactions/selectors";
import { IoMailOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdPerson2 } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PassControl from "../../components/PassControl/PassControl";
import Loader from "../../components/Loader/Loader";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

// ✅ En az 1 küçük, 1 büyük, 1 sayı, 1 özel karakter kontrolü
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;

// Yup şema
const RegisterSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "En az 3 Karakter")
    .max(30, "En fazla 30 karakter")
    .required("Zorunlu"),
  email: Yup.string().email("Geçerli bir e-posta gir").required("Zorunlu"),
  password: Yup.string()
    .min(6, "En az 6 karakter")
    .max(18, "En fazla 18 karakter")
    .required("Zorunlu")
    .matches(
      PASSWORD_REGEX,
      "Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Zorunlu"),
});

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authLoading = useSelector((s) => s.auth.loading);
  const { error } = useSelector((s) => s.auth);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const isLoading = useSelector(selectTransactionsLoading);

  if (isRefreshing || authLoading || isLoading) {
    return <Loader />;
  }

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { username, email, password } = values;
    try {
      await dispatch(register({ username, email, password })).unwrap();
      iziToast.success({
        title: "Başarılı 🎉",
        message: "Kayıt başarılı!",
        position: "topRight",
        timeout: 3000,
        class: "custom-success-toast",
        theme: "dark",
      });
    } catch (err) {
      iziToast.error({
        title: "Hata ❌",
        message: err.message || "Kayıt başarısız!",
        position: "topRight",
        timeout: 3000,
        class: "custom-error-toast",
        theme: "dark",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Register</title>
      <div className={css.shell}>
        <div className={css.bgDecor} />

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange={false}
        >
          {({ isSubmitting, values }) => (
            <Form className={css.Form} noValidate>
              <img src={logo} alt="Logo" />

              <div className={css.inputs}>
                {/* Username */}
                <div className={css.inputWrap}>
                  <MdPerson2 className={css.icon} />
                  <Field
                    name="username"
                    type="text"
                    placeholder="Name"
                    className={css.text}
                  />
                </div>
                <div className={css.error}>
                  <ErrorMessage name="username" />
                </div>

                {/* Email */}
                <div className={css.inputWrap}>
                  <IoMailOutline className={css.icon} />
                  <Field
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    className={css.text}
                  />
                </div>
                <div className={css.error}>
                  <ErrorMessage name="email" />
                </div>

                {/* Password */}
                <div className={css.inputWrap}>
                  <RiLockPasswordLine className={css.icon} />
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className={css.text}
                  />
                </div>
                <div className={css.error}>
                  <ErrorMessage name="password" />
                </div>

                {/* Confirm Password */}
                <div className={css.inputWrap}>
                  <RiLockPasswordLine className={css.icon} />
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className={css.text}
                  />
                </div>
                <div className={css.error}>
                  <ErrorMessage name="confirmPassword" />
                </div>

                <PassControl password={values.password} />
              </div>

              <button
                className={css.login}
                type="submit"
                disabled={authLoading || isSubmitting || isLoading}
              >
                REGISTER
              </button>

              <button
                className={css.reg}
                type="button"
                onClick={() => navigate("/")}
              >
                LOG IN
              </button>

              {error && <p style={{ color: "crimson" }}>{error}</p>}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
