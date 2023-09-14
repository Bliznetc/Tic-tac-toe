import React from "react";
import { useState } from "react";

function Square({ value, onSquareClick, color }) {
  return (
    <button className="square" onClick={onSquareClick} style={{ color: color }}>
      {value}
    </button>
  );
}

function ToggleButton({ onPlay }) {
  const [isChecked, setIsChecked] = useState(false);

  function handleToggle() {
    setIsChecked(!isChecked);
    console.log("handle1: " + isChecked);
    onPlay(isChecked); // Call onPlay with the new value
  }

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => handleToggle()}
      />
      <span className="slider"></span>
    </label>
  );
}

const n = 3;
const m = 3;

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }
    let erase = false;

    const nextSquares = squares.slice();
    if (erase) {
      nextSquares[i] = null;
    } else {
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let forWinner = [null];
  if (winner) {
    forWinner = highlight(squares);
  }

  console.log(forWinner);
  const isDraw = checkIsDraw(squares, winner);
  if (isDraw) {
    status = "It's a draw, quys";
  }

  let items = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let color = "black";
      if (forWinner.includes(i * m + j)) {
        console.log(i * m + j);
        if (winner === "X") {
          color = "red";
        } else {
          color = "green";
        }
      }

      const curSquare = (
        <Square
          key={i * m + j}
          value={squares[i * m + j]}
          onSquareClick={() => handleClick(i * m + j)}
          color={color}
        />
      );
      items[i].push(curSquare);
    }
  }

  let currentBoard = [];
  for (let i = 0; i < n; i++) {
    currentBoard.push(<div className="board-row">{items[i]}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="Board">{currentBoard}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(n * m).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isChecked, setChecked] = useState(false);
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

  function onChangeToggle() {
    setChecked((prevIsChecked) => {
      // Use the previous state value to calculate the new state
      console.log("handle: " + prevIsChecked);
      const newIsChecked = !prevIsChecked;
      console.log("handle: " + newIsChecked);
      return newIsChecked; // Return the new value to update the state
    });
  }

  let moves;
  if (isChecked) {
    moves = history.slice(0, history.length).map((squares, index) => {
      let description;
      if (index > 0) {
        if (index === history.length - 1) {
          description = "Go to game start";
        } else {
          description = "Go to move #" + (history.length - index - 1);
        }
      } else {
        return null;
      }
      return (
        <li key={index}>
          <button onClick={() => jumpTo(history.length - index - 1)}>
            {description}
          </button>
        </li>
      );
    });
  } else {
    moves = history.slice(0, history.length - 1).map((squares, index) => {
      let description;
      if (index > 0) {
        description = "Go to move #" + index;
      } else {
        description = "Go to game start";
      }
      return (
        <li key={index}>
          <button onClick={() => jumpTo(index)}>{description}</button>
        </li>
      );
    });
  }
  moves.push(
    <p className="Your move" key="Your move">
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
      <div>
        <h1 className="toggleName">Sort moves in ascending order</h1>
        <ToggleButton onPlay={onChangeToggle} />
      </div>
    </div>
  );
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function checkIsDraw(squares, winner) {
  if (winner != null) {
    return false;
  }

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return false;
    }
  }
  return true;
}

function highlight(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let cur = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      cur = [a, b, c];
    }
  }
  return cur;
}

// function MyComponent({ dataArray }) {
//   const joinedArray = dataArray.join(",");
//   return (
//     <div>
//       <h1>Array Elements:</h1>
//       <p className="output">{joinedArray}</p>
//     </div>
//   );
// }
