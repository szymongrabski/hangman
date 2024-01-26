import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const AddWordForm = ({ setWords }) => {
  const formik = useFormik({
    initialValues: {
      word: "",
      category: "",
      definition: "",
    },
    validationSchema: Yup.object({
      word: Yup.string().required("Wprowadź słowo"),
      category: Yup.string().required("Wprowadź kategorie"),
      definition: Yup.string().required("Wprowadź definicje")
    }),
    onSubmit: async (values) => {
      try {
        const newWord = { 
          "word": values.word, 
          "category": values.category,
          "definition": values.definition 
        };

        const response = await axios.post('http://localhost:5000/words/add', newWord);
  
        const success = response.status === 201;
  
        if (success) {
          setWords(prevWords => [...prevWords, newWord]);
          formik.resetForm();
        }
      } catch (error) {
        console.error(error);
        formik.resetForm();
      } 
    }
  });

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div className="form-field">
          <div className="form-field-content">
            <label htmlFor="word">Słowo:</label>
            <input id="word" type="text" {...formik.getFieldProps('word')} />
          </div>
          {formik.touched.word && formik.errors.word ? (
            <div className="error">{formik.errors.word}</div>
          ) : null}
        </div>
        <div className="form-field">
          <div className="form-field-content">
            <label htmlFor="category">Kategoria:</label>
            <input id="category" type="text" {...formik.getFieldProps('category')} />
          </div>
          {formik.touched.category && formik.errors.category ? (
            <div className="error">{formik.errors.category}</div>
          ) : null}
        </div>
        <div className="form-field">
          <div className="form-field-content">
            <label htmlFor="definition">Definicja:</label>
            <textarea id="definition" {...formik.getFieldProps('definition')} />
          </div>
          {formik.touched.definition && formik.errors.definition ? (
            <div className="error">{formik.errors.definition}</div>
          ) : null}
        </div>
        <div className="form-button">
          <button className="admin-btn" type="submit">Dodaj słowo</button>
        </div>
      </form>
    </div>
  );
};

export default AddWordForm;
