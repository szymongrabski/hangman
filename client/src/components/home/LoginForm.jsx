import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie'

const LoginForm = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['user'])
  const [error, setError] = useState(null)
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Wprowadź nazwę użytkownika"),
      password: Yup.string().required("Wprowadź hasło"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/users/login', { 
          "username": values.username, 
          "password": values.password 
        });

        setCookie('Username', response.data.username)
        setCookie('UserId', response.data.userId)
        setCookie('AuthToken', response.data.token)
  
        const success = response.status === 201;
  
        if (success) {
          navigate('/mainpage');
          formik.resetForm()
        }
      } catch (error) {
        console.error(error);
        if (error.response.data.message) {
          setError(error.response.data.message);
        }
        formik.resetForm()
      } 
    }
  })

  return (
    <div>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div>
            <label htmlFor="username">Nazwa użytkownika:</label>
            <input id="username" type="text" {...formik.getFieldProps('username')} />
            {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
            ) : null}
        </div>
        <div>
            <label htmlFor="password">Hasło:</label>
            <input id="password" type="password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
            ) : null}
        </div>
        <button type="submit">Zaloguj</button>
        </form>
        {error && <p>{error}</p>}
    </div>
  );
};

export default LoginForm;
