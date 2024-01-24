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
        <button type="submit">Akceptuj zmiany</button>
      </form>
    </div>
  );
};

export default EditAdminForm;
