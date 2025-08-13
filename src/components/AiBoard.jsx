import {useState, useEffect} from 'react';
import Scoreboard from './Scoreboard.jsx'

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

export default function AI_Board() {
  const [currentTurn, setCurrentTurn] = useState('X'); // User always starts. TODO: user should not always start
  const [squares, setSquares] = useState(Array(9).fill(null));

  let humanSymbol = 'X'; // TODO: user should be able to choose symbol at start of game
  let aiSymbol = 'O';

  // Generic move function that handles both human and AI moves
  function makeMove(i, playerSymbol) {
    if (squares[i] || calculateWinner(squares)) { // If square is already filled or there is already a winner, return early
        return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = playerSymbol; // Fill square

    setSquares(nextSquares); // Update state of squares array
    setCurrentTurn(prevTurn => (prevTurn === humanSymbol ? aiSymbol : humanSymbol)); // Update state of who's turn it is, if currently X, set to O, and vice versa
  }

  //Only for human moves
  function humanMove(i) {
    if (currentTurn !== humanSymbol) return; // Prevent human from clicking when it's not their turn
    makeMove(i, humanSymbol)
  }
  
  // Currently, the AI makes a random move
  function computerMove(){
    const emptySquareIndexes = [];

    // Find which squares are empty, extract their indeces to new array
    squares.forEach((element, index) => { 
        if (element === null) {
            emptySquareIndexes.push(index);
        }
    });

    const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
    const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
    makeMove(randomIndex, aiSymbol) // Call function to fill square 
  }

    useEffect(() => {
    // Check if it’s AI’s turn and no winner yet
    if (!calculateWinner(squares) && !boardIsFull(squares) && currentTurn === aiSymbol) {
        // Call AI move with a small delay
        const timer = setTimeout(() => {
        computerMove();
        }, 1000);

        return () => clearTimeout(timer); // Timer cleanup
    }
    }, [squares, currentTurn]); // useEffect triggers when dependencies in here changes, so when the board updates or player turn changes



  const winner = calculateWinner(squares);
  const isTie = boardIsFull(squares);
  let status;

  if (winner){
    status = winner + " wins!"
  } else { 
    if (isTie){ // There is no winner - if the board is filled, there is a tie
      status = "Game ties."
    } else {
      status = "Next player: " + currentTurn;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      
      <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
          <Square value={squares[0]} onSquareClick={() => humanMove(0)}/>
          <Square value={squares[1]} onSquareClick={() => humanMove(1)}/>
          <Square value={squares[2]} onSquareClick={() => humanMove(2)}/>
          <Square value={squares[3]} onSquareClick={() => humanMove(3)}/>
          <Square value={squares[4]} onSquareClick={() => humanMove(4)}/>
          <Square value={squares[5]} onSquareClick={() => humanMove(5)}/>
          <Square value={squares[6]} onSquareClick={() => humanMove(6)}/>
          <Square value={squares[7]} onSquareClick={() => humanMove(7)}/>
          <Square value={squares[8]} onSquareClick={() => humanMove(8)}/>
      </div>

      { winner ? (<Scoreboard winner={winner}/>) : null }
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
  return squares.every(square => square !== null);
}