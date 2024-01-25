import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from "axios";
import { useCookies } from 'react-cookie'

const Game = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
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

  const updateRanking = async (amount) => {
    try {
      const response = await axios.put("http://localhost:5000/ranking/user", {
        userId: cookies.UserId,
        username: cookies.Username,
        scoreChange: amount,
      })
    } catch (error) {
      console.error("Error updating ranking:", error)
    } 
  }

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
        if (incorrectGuesses >= 5) {
            setGameOver(true);
            setWon(false);
            updateRanking(-1)
        }
      
        if (word.split("").every((letter) => guesses.includes(letter))) {
            setGameOver(true);
            setWon(true);
            updateRanking(1)
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
      <h1 className="game-title">Wisielec</h1>
      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <div>
          {gameOver ? (
            <div className="end-item">
              {won ? (
                <div>
                    <p>Wygrałeś!</p>
                    <p>{word} - {definition}</p>
                </div>
              ) : (
                    <p>Przegrałeś! Hasło to: {word}</p>
              )}
              <button className="btn" onClick={() => resetGame()}>Zagraj ponownie!</button>
            </div>
          ) : (
            <div>
              <div className="category">{category} </div>
              <div className="lifes">
                {Array(5 - incorrectGuesses)
                  .fill()
                  .map((_, index) => (
                    <FavoriteBorderIcon key={index} />
                  ))}
              </div>
              <div className="guesses">
                {word
                  .split("")
                  .map((letter, index) => (guesses.includes(letter) ? letter : "_ "))}
              </div>
              <div className="letters">
                {"a, ą, b, c, ć, d, e, ę, f, g, h, i, j, k, l, ł, m, n, ń, o, ó, p, r, s, ś, t, u, w, y, z, ź, ż"
                  .split(",")
                  .map((letter) => (
                    <button className="letter" key={letter} onClick={() => handleGuess(letter.trim())}>
                      {letter.trim()}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
