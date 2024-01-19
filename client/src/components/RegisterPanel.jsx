import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegistrationForm = () => {
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Wprowadź nazwę użytkownika"),
    password: Yup.string().required("Wprowadź hasło"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same")
      .required("Potwierdź hasło"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <label htmlFor="username">Nazwa użytkownika:</label>
          <Field type="text" id="username" name="username" />
          <ErrorMessage name="username" component="div" />
        </div>

        <div>
          <label htmlFor="password">Hasło:</label>
          <Field type="password" id="password" name="password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <div>
          <label htmlFor="confirmPassword">Potwierdź hasło:</label>
          <Field type="password" id="confirmPassword" name="confirmPassword" />
          <ErrorMessage name="confirmPassword" component="div" />
        </div>

        <div>
          <button type="submit">Zarejestruj się</button>
        </div>
      </Form>
    </Formik>
  );
};

export default RegistrationForm;
