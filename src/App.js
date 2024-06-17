import React, { useCallback, useEffect, useState, useRef } from 'react';
import './App.css';
import { paragraphs } from './paragraphs';
import Content from './Content';

let ranIndex = Math.floor(Math.random() * paragraphs.length);

const App = () => {
  const maxTime = 60;
  const [paragraph, setParagraph] = useState(paragraphs[ranIndex]);
  const [time, setTime] = useState(maxTime);
  const [word, setWord] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [acc, setAcc] = useState(0);

  const totalChars = useRef(0);
  const totalCorrectChars = useRef(0);
  const timer = useRef();

  const callbackRef = useCallback(inputEl => {
    if (inputEl) {
      document.addEventListener('keydown', () => inputEl.focus());
    }
  }, []);

  useEffect(() => {
    if (timer.current && time > 0) {
      timer.current = setTimeout(() => setTime(t => t - 1), 1000);
    }

    if (time <= 0) {
      clearTimeout(timer.current);
      return;
    }
  }, [time]);

  const handleInput = (e) => {
    const { value } = e.target;
    setWord(value);
    setCharIndex(value.length);

    if (time <= 0 || value.length > paragraph.length) return;

    const { mistakes, cpm, wpm } = testCalculator(value, paragraph);
    setMistakes(mistakes);
    setCpm(cpm);
    setWpm(wpm);
    testAccuracy(value, paragraph);

    if (!timer.current) {
      timer.current = setTimeout(() => setTime(t => t - 1), 1000);
    }
  };

  function testCalculator(typedValue, originalValue) {
    const mistakes = typedValue.split('').reduce((acc, typedChar, index) => {
      return typedChar !== originalValue[index] ? acc + 1 : acc;
    }, 0);

    const cpm = Math.floor((typedValue.length / 5) * (60 / (maxTime - time)));
    const wpm = Math.floor((typedValue.length / 5) * (60 / (maxTime - time)));
    return { mistakes, cpm, wpm };
  }

  function testAccuracy(value, paragraph) {
    if (value.length > charIndex) {
      totalChars.current += 1;
      if (value[charIndex] === paragraph[charIndex]) {
        totalCorrectChars.current += 1;
      }
      setAcc(Math.round((totalCorrectChars.current / totalChars.current) * 100));
    }
  }

  const handleTryAgain = () => {
    if (time > 0) return;
    handleReset();
  };

  function handleReset() {
    setTime(maxTime);
    setWord('');
    setCharIndex(0);
    setMistakes(0);
    setWpm(0);
    setCpm(0);
    setAcc(0);
    clearTimeout(timer.current);
    totalChars.current = 0;
    totalCorrectChars.current = 0;
    timer.current = undefined;
  }

  function handleRestart() {
    let ri = Math.floor(Math.random() * paragraphs.length);

    if (ri !== ranIndex) {
      ranIndex = ri;
      setParagraph(paragraphs[ri]);
      handleReset();
    }
  }

  return (
    <div className="App">
      <h1>Typing Speed Test</h1>
      <h2>Test your typing skills</h2>

      <div className="tab">
        <div className="timer" onClick={handleTryAgain}>
          {time > 0 ? (
            <>
              <p>{time}</p>
              <small>seconds</small>
            </>
          ) : (
            <small>Try Again!</small>
          )}
        </div>
        <div className="square">
          <p>{wpm}</p>
          <small>words/min</small>
        </div>
        <div className="square">
          <p>{cpm}</p>
          <small>char/min</small>
        </div>
        <div className="square">
          <p>{mistakes}</p>
          <small>mistakes</small>
        </div>
        <div className="square">
          <p>{acc}</p>
          <small>% Accuracy</small>
        </div>
      </div>
      <input 
        type="text" 
        value={word} 
        autoFocus 
        onChange={handleInput} 
        ref={callbackRef} 
        style={{ opacity: 0 }} 
      />

      <Content paragraph={paragraph} charIndex={charIndex} word={word} />
      <span className="restart" onClick={handleRestart}>&#x27F3;</span>
    </div>
  );
};

export default App;
