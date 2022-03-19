import React, { FormEvent, useRef, useState } from 'react';
import './App.css';
import guesser, { Guesses, LetterGuess, WordGuess } from './guesser';

function Cell({ color, location, onUpdate }: { color: LetterGuess, location: [number, number], onUpdate: Function }) {
  function changeColor() {
    let newColor: string;
    switch (color) {
      case '⬛️':
        newColor = '🟨';
        break;
      case '🟨':
        newColor = '🟩';
        break;
      case '🟩':
      default:
        newColor = '⬛️';
        break;
    }
    onUpdate(location, newColor);
  }
  return (
    <div role="cell" className="tile">
      <button onClick={changeColor}>{color}</button>
    </div>
  )
}


function Row({ data, row, onUpdate }: { data: WordGuess, row: number, onUpdate: Function }) {
  return (
    <div role="row" className="row">
      {data.map((color, i) => <Cell key={`c${row}-${i}`} color={color} location={[row, i]} onUpdate={onUpdate} />)}
    </div>
  );
}

const defaultGrid: Guesses = new Array(6).fill(new Array(5).fill('⬛️'));

function gridString(grid: string[][]) {
  return grid.map(row => row.join('')).join('\n');
}

function App() {
  const [grid, setGrid] = useState(defaultGrid);
  const [guesses, setGuesses] = useState<(string | undefined)[]>([]);
  const answerElem = useRef<HTMLInputElement>(null);
  function update(location: [number, number], newColor: LetterGuess) {
    const [x, y] = location;
    setGrid(grid.map((row, i) => (
      row.map((cell, j) => (i === x && j === y) ? newColor : cell) as WordGuess
    )));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(gridString(grid));
  }
  function generateGuesses(e: FormEvent) {
    e.preventDefault();
    const answer = answerElem.current?.value.toUpperCase()!;
    setGuesses(guesser(grid, answer));
  }
  function showGuesses() {
    return guesses.map((guess, i) => (
      <div key={`${guess}-${i}`}>{guess || (<em>no suitable word found, please art again</em>)}</div>
    ));
  }
  return (
    <div id="game">
      <div role="table" className="board">
        {grid.map((cells, i) => {
          return <Row key={`r${i}`} data={cells} row={i} onUpdate={update} />
        })}
      </div>
      <button onClick={copyToClipboard}>Copy!</button>
      <form onSubmit={generateGuesses}>
        <label htmlFor="answer">Answer</label>
        <input type="text" required minLength={5} maxLength={5} id="answer" ref={answerElem} />
        <button type="submit">Generate Guesses</button>
      </form>
      {showGuesses()}
    </div>
  );
}

export default App;
