import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const EditWordForm = ({ setWords, word, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      word: word.word,
      category: word.category,
      definition: word.definition,
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

        const response = await axios.put(`http://localhost:5000/words/update/${word.word_id}`, newWord);
  
        const success = response.status === 201;
  
        if (success) {
          setWords((prevWords) => 
            prevWords.map((prevWord) => 
              prevWord.word_id === word.word_id ? newWord : prevWord
            )
          );
          onCancel()
          formik.resetForm();
        }
      } catch (error) {
        console.error(error);
        onCancel()
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
        <button type="submit">Akceptuj zmiany</button>
        <button onClick={onCancel}>Anuluj</button>
      </form>
    </div>
  );
};

export default EditWordForm;
