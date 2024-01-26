import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const EditAdminForm = ( {adminId, username, onCancel}) => {

  const formik = useFormik({
    initialValues: {
      username: username,
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Wprowadź nazwę użytkownika"),
      password: Yup.string().required("Wprowadź hasło"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same")
        .required("Potwierdź hasło"),
    }),
    onSubmit: async (values) => {
      try {
  
        const response = await axios.put('http://localhost:5000/admins/admin', {
          "admin_id": adminId,   
          "username": values.username,
          "password": values.password 
        });
  
        const success = response.status === 201;
  
        if (success) {
          formik.resetForm()
          onCancel()
        }
      } catch (error) {
        formik.resetForm()
        onCancel()
      } 
    }
  })

  return (
    <div className="form-container">
      <form className="form" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div className="form-field">
          <div className="form-field-content">
            <label htmlFor="username">Nazwa admina:</label>
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
        <div className="form-field">
          <div className="form-field-content">
            <label htmlFor="confirmPassword">Potwierdź hasło:</label>
            <input id="confirmPassword" type="password" {...formik.getFieldProps('confirmPassword')}/>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <div className="form-button">
          <button className="form-btn" type="submit">Akceptuj zmiany</button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminForm;
