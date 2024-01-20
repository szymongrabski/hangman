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
    <div>
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div>
          <label htmlFor="word">Słowo:</label>
          <input id="word" type="text" {...formik.getFieldProps('word')} />
          {formik.touched.word && formik.errors.word ? (
            <div>{formik.errors.word}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="category">Kategoria:</label>
          <input id="category" type="text" {...formik.getFieldProps('category')} />
          {formik.touched.category && formik.errors.category ? (
            <div>{formik.errors.category}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="definition">Definicja:</label>
          <textarea id="definition" {...formik.getFieldProps('definition')} />
          {formik.touched.definition && formik.errors.definition ? (
            <div>{formik.errors.definition}</div>
          ) : null}
        </div>
        <button type="submit">Dodaj słowo</button>
      </form>
    </div>
  );
};

export default AddWordForm;
