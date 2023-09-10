import React from 'react';
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

const n = 20;
const m = 40;

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }
    let erase = false;
    if (squares[i]) {
        erase = true;
    }
    
    const nextSquares = squares.slice();
    if (erase) {
      nextSquares[i] = null;
    }
    else {
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }


  let items = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      items[i].push(
        <Square 
          key={i*m + j}
          value={squares[i * m + j]} 
          onSquareClick={() => handleClick(i * m + j)} 
        />
      )
    }
  }

  let currentBoard = [];
  for (let i = 0; i < n; i++) {
    currentBoard.push(
      <div className="board-row">
        {items[i]}
      </div>
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className='Board'>{currentBoard}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(n * m).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  
  const moves = history.slice(0, history.length - 1).map((squares, index) => {
    let description;
    if (index > 0) {
      description = 'Go to move #' + index;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });
  moves.push(
    <p key="Your move">
      You are at move {currentMove + 1}
    </p>
  );
  
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


function MyComponent({ dataArray }) {
  const joinedArray = dataArray.join(',');
  return (
    <div>
      <h1>Array Elements:</h1>
      <p className='output'>{joinedArray}</p>
    </div>
  );
}