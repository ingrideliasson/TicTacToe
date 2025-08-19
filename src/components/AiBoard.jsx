import { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard.jsx';
import { motion } from "framer-motion";
import HomeButton from "./HomeButton.jsx";
import DifficultyMenu from "./DifficultyMenu.jsx";
//import DifficultySlider from "./DifficultySlider.jsx"

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

  useEffect(() => {
    if (isWinningTile) {
      const timeout = setTimeout(() => setHighlight(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isWinningTile, delay]);

  return (
    <button
      className="border-2 border-blue-300 h-28 w-28 md:h-36 md:w-36 font-cherry flex items-center justify-center"
      onClick={onSquareClick}
    >
      {value && (
        <motion.span
          key={value + index}
          initial={{ ...animationVariants[index], opacity: 0, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`text-5xl ${
            isWinningTile ? "text-emerald-400" : "text-blue-400"
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

export default function AiBoard() {
  const [difficulty, setDifficulty] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [currentTurn, setCurrentTurn] = useState(startingPlayer);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ X: 0, O: 0, });
  const [isFirstGameFinished, setIsFirstGameFinished] = useState(false);

  let humanSymbol = 'X';
  let aiSymbol = 'O';

  function makeMove(i, playerSymbol) {
    if (squares[i] || calculateWinner(squares)[0]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = playerSymbol;
    setSquares(nextSquares);
    setCurrentTurn(prevTurn => (prevTurn === humanSymbol ? aiSymbol : humanSymbol));
  }

  function humanMove(i) {
    if (!difficulty) return;
    if (currentTurn !== humanSymbol) return;
    makeMove(i, humanSymbol);
  }

  function computerMove() {
    if (difficulty === "easy") {
      let move = findWinningMove(squares, aiSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      move = findWinningMove(squares, humanSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      const emptySquareIndexes = squares
        .map((v, idx) => v === null ? idx : null)
        .filter(v => v !== null);
      const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
      makeMove(randomIndex, aiSymbol);
      return;
    }

    if (difficulty === "medium") {
      let move = findWinningMove(squares, aiSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      move = findWinningMove(squares, humanSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      move = findStrategicMove(squares, aiSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      const emptySquareIndexes = squares
        .map((v, idx) => v === null ? idx : null)
        .filter(v => v !== null);
      const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
      makeMove(randomIndex, aiSymbol);
      return;
    }

    if (difficulty === "hard") {
      if (boardIsEmpty(squares) && startingPlayer === aiSymbol) {
        return makeMove(4, aiSymbol);
      }

      if (squares.filter((sq) => sq !== null).length === 2 && startingPlayer === aiSymbol) {
        let possibleCorners;
        if (squares[0] !== null || squares[8] !== null) {
          possibleCorners = [2, 6];
        } else if (squares[2] !== null || squares[6] !== null) {
          possibleCorners = [0, 8];
        } else {
          possibleCorners = [0, 2, 6, 8];
        }
        const randomCorner = possibleCorners[Math.floor(Math.random() * possibleCorners.length)];
        return makeMove(randomCorner, aiSymbol);
      }

      if (squares.filter((sq) => sq !== null).length === 1 && startingPlayer === humanSymbol) {
        const corners = [0, 2, 6, 8];
        const randomCorner = corners[Math.floor(Math.random() * corners.length)];
        if (squares[randomCorner] === null) return makeMove(randomCorner, aiSymbol);
      }

      let move = findWinningMove(squares, aiSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      move = findWinningMove(squares, humanSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      move = findStrategicMove(squares, aiSymbol);
      if (move !== null) return makeMove(move, aiSymbol);

      const emptySquareIndexes = squares
        .map((v, idx) => v === null ? idx : null)
        .filter(v => v !== null);
      const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
      makeMove(randomIndex, aiSymbol);
      return;
    }
  }

  useEffect(() => {
    if (!difficulty) return;
    if (currentTurn !== aiSymbol) return;
    if (calculateWinner(squares)[0] || boardIsFull(squares)) return;
    const timer = setTimeout(() => computerMove(), 1000);
    return () => clearTimeout(timer);
  }, [difficulty, currentTurn, squares]);

  const [winnerSymbol, winningTiles] = calculateWinner(squares);
  const isTie = boardIsFull(squares);
  const isFirstMove = boardIsEmpty(squares);

  let status;
  if (isFirstMove) {
    status = "First player: " + currentTurn;
  } else if (winnerSymbol) {
    status = winnerSymbol + " wins!";
  } else if (isTie) {
    status = "Game ties.";
  } else {
    status = "Next player: " + currentTurn;
  }

    useEffect(() => {
    if (winnerSymbol && winnerSymbol[0] === 'X') {
      setScores(prevScores => ({ ...prevScores, X: prevScores.X + 1 }));
    } else if (winnerSymbol && winnerSymbol[0] === 'O') {
      setScores(prevScores => ({ ...prevScores, O: prevScores.O + 1 }));
    }
    }, [winnerSymbol]);

  function newGame(){ // Triggered when "new game" is clicked
    if (winnerSymbol || isTie) {
      const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X'; // Change starting player
      setStartingPlayer(nextStartingPlayer);
      setCurrentTurn(nextStartingPlayer);
      setSquares(Array(9).fill(null));
      setDifficulty(null); // Difficulty is reset
    } else {
      return;
    }
  }

  function resetGame(){ // Instead of starting a new game, the current game resets with the same starting player and difficulty. Can be clicked during a game. 
    const nextStartingPlayer = startingPlayer === 'X' ? 'X' : 'O'; // Keep the same starting player
    setStartingPlayer(nextStartingPlayer);
    setCurrentTurn(nextStartingPlayer);
    setScores({ X: 0, O: 0, });
    // Empty the board
    setSquares(Array(9).fill(null));
  }

  // Update isFirstGameFinished
  useEffect(() => {
    if ((winnerSymbol || isTie)) {
      setIsFirstGameFinished(true);
    }
  }, [winnerSymbol, isTie])

  return (
    <div className="flex flex-col items-center justify-start mt-8 md:mt-0 gap-4 min-h-screen">

      <div className="md:w-1/3 md:mr-32 md:mt-12 mb-8 md:mb-0 ">
        <HomeButton />
      </div>
      <DifficultySlider/>
      <h1 
      className="text-4xl md:text-5xl p-2 font-cherry bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text ">
      {status}
      </h1>

      <div className="grid grid-cols-3 border-2 border-blue-300">
        {squares.map((value, i) => {
          const isWinningTile = winnerSymbol && winningTiles.includes(i);
          const delay = isWinningTile ? winningTiles.indexOf(i) * 0.3 : 0;
          return (
            <Square
              key={i}
              value={value}
              index={i}
              onSquareClick={() => humanMove(i)}
              isWinningTile={isWinningTile}
              delay={delay}
            />
          );
        })}
      </div>

      <div className="flex gap-4 items-center">
        <DifficultyMenu
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          disabled={!boardIsEmpty(squares)}
        />
      </div>

      <Scoreboard scores={scores} isFirstGameFinished={isFirstGameFinished}/>

      <div className="flex items-center justify-center gap-4">
        <button className="font-cherry text-white text-xl p-3 px-6 bg-gradient-to-r from-pink-300 to-emerald-400 rounded-lg disabled:opacity-50 "
        onClick={() => resetGame()}>
          Reset Score
          </button>
        <button className="font-cherry text-white text-xl p-3 px-6 bg-gradient-to-r from-emerald-400 to-blue-400  rounded-lg disabled:opacity-50 "
        onClick={() => newGame()}> 
          New game
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return [null, []];
}

function boardIsFull(squares) {
  return squares.every(square => square !== null);
}

function boardIsEmpty(squares) {
  return squares.every(square => square === null);
}

function findWinningMove(squares, symbol) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    const countSymbol = line.filter(val => val === symbol).length;
    const countEmpty = line.filter(val => val === null).length;
    if (countSymbol === 2 && countEmpty === 1) {
      if (squares[a] === null) return a;
      if (squares[b] === null) return b;
      if (squares[c] === null) return c;
    }
  }
  return null;
}

function findStrategicMove(squares, aiSymbol) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  let possibleMoves = [];
  for (let [a, b, c] of lines) {
    const line = [squares[a], squares[b], squares[c]];
    const countSymbol = line.filter(val => val === aiSymbol).length;
    const countEmpty = line.filter(val => val === null).length;
    if (countSymbol === 1 && countEmpty === 2) {
      if (squares[a] === null) possibleMoves.push(a);
      if (squares[b] === null) possibleMoves.push(b);
      if (squares[c] === null) possibleMoves.push(c);
    }
  }
  if (possibleMoves.length > 0) {
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
  return null;
}