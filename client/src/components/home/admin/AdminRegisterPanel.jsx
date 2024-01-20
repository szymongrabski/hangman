import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { AuthContext } from "../../../contexts/AuthContext";

const AdminRegistrationForm = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      verification: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Wprowadź nazwę użytkownika"),
      verification: Yup.string().required("Wprowadź weryfikacje"),
      password: Yup.string().required("Wprowadź hasło"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same")
        .required("Potwierdź hasło"),
    }),
    onSubmit: async (values) => {
      try {
  
        const response = await axios.post('http://localhost:5000/admins/signup', { 
          "username": values.username,
          "verification": values.verification, 
          "password": values.password 
        });
  
        const success = response.status === 201;
  
        if (success) {
          setCookie('Username', response.data.username)
          setCookie('UserId', response.data.adminId)
          setCookie('AuthToken', response.data.token)
          formik.resetForm()
          setError(null)
          navigate('/adminpanel');
        }
      } catch (error) {
        console.error(error);
        setError(error.response.data.message);
        formik.resetForm()
      } 
    }
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div>
          <label htmlFor="username">Nazwa admina:</label>
          <input id="username" type="text" {...formik.getFieldProps('username')} />
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="verification">Weryfikacja:</label>
          <input id="verification" type="text" {...formik.getFieldProps('verification')} />
          {formik.touched.verification && formik.errors.verification ? (
            <div>{formik.errors.verification}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input id="password" type="password" {...formik.getFieldProps('password')} />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword">Potwierdź hasło:</label>
          <input id="confirmPassword" type="password" {...formik.getFieldProps('confirmPassword')}/>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div>{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <button type="submit">Rejestruj</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminRegistrationForm;
