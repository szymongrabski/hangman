import React, { useEffect, useState } from "react";
import axios from "axios";

const Game = () => {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("")
  const [definition, setDefinition] = useState("")
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/words");
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord.word);
      setCategory(randomWord.category)
      setDefinition(randomWord.definition)
    }
  }, [words]);

  const handleGuess = (guess) => {
    if (gameOver) return;
    if (guesses.includes(guess)) return;

    if (word.includes(guess)) {
      setGuesses([...guesses, guess]);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
    }
  };

  useEffect(() => {
    if (words && words.length > 0) {
        if (incorrectGuesses > 5) {
            setGameOver(true);
            setWon(false);
        }
      
        if (word.split("").every((letter) => guesses.includes(letter))) {
            setGameOver(true);
            setWon(true);
        }
    }
  }, [incorrectGuesses, guesses, word]);

  const resetGame = () => {
    if (words.length > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord.word);
        setCategory(randomWord.category)
        setDefinition(randomWord.definition)
    }
    setGuesses([]);
    setIncorrectGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div>
      <h1>Wisielec</h1>
      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <div>
          {gameOver ? (
            <div>
              {won ? (
                <div>
                    <p>Wygrałeś!</p>
                    <p>{word} - {definition}</p>
                </div>
              ) : (
                    <p>Przegrałeś!</p>
              )}
              <button onClick={() => resetGame()}>Zagraj ponownie!</button>
            </div>
          ) : (
            <div>
              <p>Kategoria: {category} </p>
              <p>Próby: {5 - incorrectGuesses}</p>
              <p>
                {word
                  .split("")
                  .map((letter, index) => (guesses.includes(letter) ? letter : "_ "))}
              </p>
              <p>
                {"a, ą, b, c, ć, d, e, ę, f, g, h, i, j, k, l, ł, m, n, ń, o, ó, p, r, s, ś, t, u, w, y, z, ź, ż"
                  .split(",")
                  .map((letter) => (
                    <button key={letter} onClick={() => handleGuess(letter.trim())}>
                      {letter.trim()}
                    </button>
                  ))}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
