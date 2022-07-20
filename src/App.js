import React, { useState, useEffect } from "react";

import "App.css";

const limit = 5;

function App() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");
  const [penalty, setPenalty] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState(null);
  const [highScore, setHighScore] = useState(0);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [randomLetter, setRandomLetter] = useState(generateRandomLetter());
  const finished = count === limit;
  const cardColor = (finished && !success && "error") || "success";

  useEffect(() => {
    const localStorageHighScore = localStorage.getItem("highScore");
    if (localStorageHighScore) setHighScore(localStorageHighScore);
  }, []);

  useEffect(() => {
    let t = null;
    if (startTimer) {
      t = setInterval(getTimer, 10);
    } else clearInterval(t);
    return () => {
      clearInterval(t);
    };
  }, [startTimer]);
  useEffect(() => {
    if (count === limit) {
      const totalPenalty = penalty * 500; // mili seconds penalty
      const withPenaltyMs = currentTimer + totalPenalty;
      if (highScore > withPenaltyMs || !highScore) {
        setSuccess(true);
        setHighScore(withPenaltyMs);
        localStorage.setItem("highScore", withPenaltyMs);
      }
      setResult(withPenaltyMs);
      setStartTimer(false);
    }
  }, [count]);

  function formatTimeFromMs(time) {
    const seconds = parseInt(time / 1000);
    const miliSeconds = parseInt(time % 1000);
    return `${seconds}.${("000" + miliSeconds).slice(-3)}s`;
  }

  function getTimer() {
    setCurrentTimer((prev) => prev + 10);
  }

  function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  function onInputChange(event) {
    const { value } = event.target || {};
    if (value.length === 1) {
      setStartTimer(true);
    }
    setInput((prev) => {
      if (prev.length < value.length) {
        if (value[value?.length - 1].toUpperCase() !== randomLetter) {
          setPenalty((prevPenalty) => prevPenalty + 1);
        } else {
          setCount((prevCount) => prevCount + 1);
          setRandomLetter(generateRandomLetter());
        }
        return value;
      }

      return prev;
    });
  }
  function reset() {
    setCount(0);
    setCurrentTimer(0);
    setPenalty(0);
    setResult(null);
    setInput("");
    setSuccess(false);
  }

  return (
    <div className="App">
      <p className="bold h2">Type the alphabet</p>
      <p className="h4">
        Typing game to see how fast you type. Timer starts when you do :
      </p>

      <div className="card">
        <p className={` bold h1 ${cardColor}`}>
          {finished && (success ? "SUCCESS" : "FAIL")}
          {!finished && randomLetter}
        </p>
      </div>
      {!!startTimer && (
        <p className="h4">
          <span className="timer">Timer: </span>
          <span className="timer">{`${formatTimeFromMs(currentTimer)}s`}</span>
        </p>
      )}
      {!!result && (
        <p className="h4">
          My {finished && success && "new high "}score:{" "}
          {formatTimeFromMs(result)}
        </p>
      )}
      {!success && !!highScore && (
        <p className="h4">High score: {formatTimeFromMs(highScore)}</p>
      )}

      <div className="input">
        <input value={input} disabled={finished} onChange={onInputChange} />
        <button type="submit" disabled={startTimer} onClick={reset}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default App;
