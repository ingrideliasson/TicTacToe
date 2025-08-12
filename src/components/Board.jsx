import { useState, useEffect } from 'react';
import GameTimer from './GameTimer'

function Square({value, onSquareClick}) {

  return (
  <button 
  className="border-2 border-sky-300 text-5xl text-sky-500 h-48 w-48 font-cherry"
  onClick={onSquareClick}
  >
    {value}
  </button>
);
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    const newWinner = calculateWinner(squares);
    if (newWinner && newWinner !== winner) {
      setWinner(newWinner);
    }
  }, [squares, winner])

  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)) {  // If the square is already filled or there is a winner, return early
      return;
    }

    const nextSquares = squares.slice(); // Copy of squares array

    if (xIsNext) { // Check whether to fill X or O
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    setSquares(nextSquares); // Update state of array
    setXIsNext(!xIsNext); // Update state of which symbol is next
  }

  //const winner = calculateWinner(squares);
  const isTie = boardIsFull(squares);
  let status;

  if (winner){
    status = winner + " wins!"
  } else { 
    if (isTie){ // There is no winner - if the board is filled, there is a tie
      status = "Game ties."
    } else {
      status = "Next player: " + (xIsNext ? 'X' : 'O');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      
      <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
          <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
          <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
          <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
          <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
          <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
          <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
      <GameTimer gameTime={5.0} xIsNext={xIsNext} winner={winner} setWinner={setWinner}></GameTimer>

      <h1 className="text-4xl text-pink-800 font-cherry ">{status}</h1>
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
    [2, 4, 6]
  ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] // Returns 'X' or 'O'
      }
    }
  return null;
}

function boardIsFull(squares) {

  for (let i = 0; i < squares.length; i++) {

    if (squares[i] === null){
      return null; // If any square is empty, return false
    }
  }

  return true; // If all squares are filled, return true
}