import React, { useEffect, useState } from "react";

function Game() {
  const words = ['banan', 'jabłko'];
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);

  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (incorrectGuesses > 5) {
      setGameOver(true);
      setWon(false);
    }

    if (word.split('').every((letter) => guesses.includes(letter))) {
      setGameOver(true);
      setWon(true);
    }
  }, [incorrectGuesses, guesses, word]);

  const handleGuess = (guess) => {
    if (gameOver) return;
    if (guesses.includes(guess)) return;

    if (word.includes(guess)) {
      setGuesses([...guesses, guess]);
    } else {
      setIncorrectGuesses(incorrectGuesses + 1);
    }
  };

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuesses([]);
    setIncorrectGuesses(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div>
      <h1>Wisielec</h1>
      {gameOver ? (
        <div>
          {won ? 'Wygrałeś!' : 'Przegrałeś!'}
          <button onClick={() => resetGame()}>Play again!</button>
        </div>
      ) : (
        <div>
          <p>Próby: {5 - incorrectGuesses}</p>
          <p>
            {word
              .split('')
              .map((letter, index) => (guesses.includes(letter) ? letter : '_ '))}
          </p>
          <p>
            {'a, ą, b, c, ć, d, e, ę, f, g, h, i, j, k, l, ł, m, n, ń, o, ó, p, r, s, ś, t, u, w, y, z, ź, ż'
              .split(',')
              .map((letter) => (
                <button key={letter} onClick={() => handleGuess(letter.trim())}>
                  {letter.trim()}
                </button>
              ))}
          </p>
        </div>
      )}
    </div>
  );
}

export default Game;
