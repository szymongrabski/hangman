import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const WordsContext = createContext();

export const WordsProvider = ({ children }) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        getWords()
    }, [])

    const getWords = async () => {
        const response = await axios.get("http://localhost:5000/words")
        setWords(response.data)
    }

    return (
        <WordsContext.Provider value={{ setWords, words }}>
        {children}
        </WordsContext.Provider>
    );
};
