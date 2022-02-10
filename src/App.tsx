import React, { ChangeEvent, MouseEventHandler, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function Cell({ color, location, onUpdate }: { color: string, location: [number, number], onUpdate: Function }) {
  // const [color, setColor] = useState('⬛️');
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
  //   setColor(newColor);
  }
  return (
    <div role="cell" className="tile">
      <button onClick={changeColor}>{color}</button>
    </div>
  )
}


function Row({ data, row, onUpdate }: { data: string[], row: number, onUpdate: Function }) {
  return (
    <div role="row" className="row">
      {data.map((color, i) => <Cell key={`c${row}-${i}`} color={color} location={[row, i]} onUpdate={onUpdate} />)}
    </div>
  );
}

/*
Wordle 235 1/6

🟩🟩🟩🟩🟩
*/

const defaultGrid: string[][] = new Array(6).fill(new Array(5).fill('⬛️'));

function gridString(grid: string[][]) {
  return grid.map(row => row.join('')).join('\n');
}

function App() {
  const [grid, setGrid] = useState(defaultGrid);
  function update(location: [number, number], newColor: string) {
    const [x, y] = location;
    setGrid(grid.map((row, i) => (
      row.map((cell, j) => (i === x && j === y) ? newColor : cell)
    )));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(gridString(grid));
  }
  return (
    <div id="game">
      <div role="table" className="board">
        {grid.map((cells, i) => {
          return <Row key={`r${i}`} data={cells} row={i} onUpdate={update} />
        })}
      </div>
      <button onClick={copyToClipboard}>Copy!</button>
    </div>
  );
}

export default App;
