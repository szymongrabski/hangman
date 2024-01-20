import React, { useState, useEffect } from "react";
import axios from "axios";
import AddWordForm from "./AddWordForm";
import EditWordForm from "./EditWordForm";

const WordsPanel = () => {
  const [words, setWords] = useState([]);
  const [searchPattern, setSearchPattern] = useState("");
  const [editedWord, setEditedWord] = useState(null);

  const fetchWords = async () => {
    try {
      let url = "http://localhost:5000/words";
      if (searchPattern) {
        url = `http://localhost:5000/words/search/${searchPattern}`;
      }

      const response = await axios.get(url);
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching words:", error.message);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [words]);

  const handleDelete = async (wordId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/words/delete/${wordId}`)

      if (response.data.success) {
        setWords((prevValue) => prevValue.filter((word) => word.word_id !== wordId))
      }

    } catch (error) {
      console.error("Error while deleting word:", error.message)
    }
  }

  const handleEdit = async (word) => {
    setEditedWord(word)
  }

  const handleEditCancel = () => {
    setEditedWord(null)
  }


  return (
    <div>
      <h2>Lista słów</h2>
      <div>
        <label htmlFor="searchPattern">Wyszukaj słowo:</label>
        <input
          id="searchPattern"
          type="text"
          value={searchPattern}
          onChange={(e) => setSearchPattern(e.target.value)}
        />
      </div>
      <ul>
        {words.map((word) => (
          <li key={word.word_id}>
            <div>
              <strong>{word.word}</strong> - {word.category} ({word.definition})
              <div>
                <button onClick={() => handleDelete(word.word_id)}>Usuń</button>
                <button onClick={() => handleEdit(word)}>Edytuj</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {editedWord && (
        <div>
          <h2>Edytuj słowo</h2>
          <EditWordForm
            setWords={setWords}
            word={editedWord}
            onCancel={handleEditCancel}
          />
        </div>
      )}
      <div>
        <h2>Dodaj słowo</h2>
        <AddWordForm setWords={setWords} />
      </div>
    </div>
  );
};

export default WordsPanel;
