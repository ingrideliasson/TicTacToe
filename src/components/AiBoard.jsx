import { useState, useEffect } from 'react';
import { motion } from "framer-motion";

function Square({ value, onSquareClick, index, isWinningTile, delay = 0 }) {
  const animationVariants = [
    { y: -100, x: -100 },
    { y: -100, x: 0 },
    { y: -100, x: 100 },
    { y: 0, x: -100 },
    { y: 0, x: -100 },
    { y: 0, x: 100 },
    { y: 100, x: -100 },
    { y: 100, x: 0 },
    { y: 100, x: 100 }
  ];

  const [highlight, setHighlight] = useState(false);

  // Start highlight animation after delay
  useEffect(() => {
    if (isWinningTile) {
      const timeout = setTimeout(() => setHighlight(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isWinningTile, delay]);

  return (
    <button
      className="border-2 border-sky-300 h-48 w-48 font-cherry flex items-center justify-center"
      onClick={onSquareClick}
    >
      {value && (
        <motion.span
          key={value + index}
          initial={{ ...animationVariants[index], opacity: 0, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`text-5xl ${
            isWinningTile ? "text-green-500" : "text-sky-500"
          }`}
        >
          <motion.div
            animate={highlight ? { scale: 1.3 } : { scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10
            }}
          >
            {value}
          </motion.div>
        </motion.span>
      )}
    </button>
  );
}

export default function AI_Board() {
  const [currentTurn, setCurrentTurn] = useState('X');
  const [squares, setSquares] = useState(Array(9).fill(null));

  let humanSymbol = 'X';
  let aiSymbol = 'O';

  function makeMove(i, playerSymbol) {
    if (squares[i] || calculateWinner(squares)[0]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = playerSymbol;
    setSquares(nextSquares);
    setCurrentTurn(prevTurn => (prevTurn === humanSymbol ? aiSymbol : humanSymbol));
  }

  function humanMove(i) {
    if (currentTurn !== humanSymbol) return;
    makeMove(i, humanSymbol);
  }

  function computerMove() {
    const emptySquareIndexes = squares
      .map((sq, idx) => (sq === null ? idx : null))
      .filter(idx => idx !== null);

    if (emptySquareIndexes.length === 0) return;

    const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
    makeMove(randomIndex, aiSymbol);
  }

  useEffect(() => {
    if (!calculateWinner(squares)[0] && !boardIsFull(squares) && currentTurn === aiSymbol) {
      const timer = setTimeout(() => {
        computerMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [squares, currentTurn]);

  const [winner, winningTiles] = calculateWinner(squares);
  const isTie = boardIsFull(squares);

  let status;
  if (winner) {
    status = winner + " wins!";
  } else if (isTie) {
    status = "Game ties.";
  } else {
    status = "Next player: " + currentTurn;
  }

  const tileIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
        {tileIdxs.map(i => {
          const isWinningTile = winner && Array.isArray(winningTiles) && winningTiles.includes(i);
          const delay = isWinningTile ? winningTiles.indexOf(i) * 0.3 : 0;
          return (
            <Square
              key={i}
              value={squares[i]}
              index={i}
              onSquareClick={() => humanMove(i)}
              isWinningTile={isWinningTile}
              delay={delay}
            />
          );
        })}
      </div>
      <h1 className="text-4xl text-pink-800 font-cherry">{status}</h1>
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
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

function boardIsFull(squares) {
  return squares.every(square => square !== null);
}
