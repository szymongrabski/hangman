import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { useCookies } from 'react-cookie'

const UpdateUserForm = ({ showForm }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [error, setError] = useState(null)
  
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
        const response = await axios.put('http://localhost:5000/users/user', {
            updatedUser: {
                "user_id":  cookies.UserId,
                "username": values.username, 
                "password": values.password 
            }
        });
  
        const success = response.status === 201;
  
        if (success) {
          formik.resetForm()
          setError(null)
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
      { showForm && 
        <div className="form-container">
          <form className="form" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
              <div className="form-field">
                <div className="form-field-content">
                  <label htmlFor="username">Nazwa użytkownika:</label>
                  <input id="username" type="text" {...formik.getFieldProps('username')} />
                </div>
                  {formik.touched.username && formik.errors.username ? (
                  <div className="error">{formik.errors.username}</div>
                  ) : null}
              </div>
              <div className="form-field">
                <div className="form-field-content">
                  <label htmlFor="password">Hasło:</label>
                  <input id="password" type="password" {...formik.getFieldProps('password')} />
                </div>
                  {formik.touched.password && formik.errors.password ? (
                  <div className="error">{formik.errors.password}</div>
                  ) : null}
              </div>
              <div className="form-button">
                <button className="form-btn" type="submit">Zatwierdź zmiany</button>
              </div>
          </form>
          {error && <p>{error}</p>}
        </div>
      }
    </div>
  );
};

export default UpdateUserForm;
