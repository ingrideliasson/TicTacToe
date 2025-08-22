import { useState, useEffect } from "react";
import GameTimer from "./GameTimer";
import Scoreboard from "./Scoreboard.jsx";
import HomeButton from "./HomeButton.jsx";
import GameButton from "./GameButton.jsx";
import { calculateWinner, boardIsFull, boardIsEmpty } from "./gameHelpers.js";
import Square from "./Square.jsx";

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState("X");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [gameTime, setGameTime] = useState(10);
  const tileIdxs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [timerKey, setTimerKey] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isFirstGameFinished, setIsFirstGameFinished] = useState(false); 


  // Check for a winner and set the state.
  useEffect(() => {
      if (winner) {
          return; 
      }
      const [newWinnerSymbol, winningTiles] = calculateWinner(squares);
      if (newWinnerSymbol) {
          setWinner([newWinnerSymbol, winningTiles]);
      }
  }, [squares, winner]);

  // Update scores when a winner is found.
  useEffect(() => {
    if (winner && winner[0] === "X") {
      setScores((prevScores) => ({ ...prevScores, X: prevScores.X + 1 }));
    } else if (winner && winner[0] === "O") {
      setScores((prevScores) => ({ ...prevScores, O: prevScores.O + 1 }));
    }
  }, [winner]);

  // Update `isGameRunning` and `isFirstGameFinished` based on game state.
  useEffect(() => {
    if (winner || boardIsFull(squares)) {
      setIsGameRunning(false);
      setIsFirstGameFinished(true);
    } else if (boardIsEmpty(squares))
      setIsGameRunning(false);
    else setIsGameRunning(true);
  }, [winner, squares]);

  function getSquare(winner, winningTiles, i) {
    const isWinningTile =
      winner && Array.isArray(winningTiles) && winningTiles.includes(i);
    const delay =
      isWinningTile && winner
        ? winningTiles.indexOf(i) * 0.3 // delay based on order
        : 0;

    return (
      <Square
        key={i}
        value={squares[i]}
        index={i}
        onSquareClick={() => handleClick(i)}
        isWinningTile={isWinningTile}
        delay={delay}
      />
    );
  }

  // The event handler for a square click. It updates the board with the current player's
  // symbol ('X' or 'O') and switches the turn to the other player.
  function handleClick(i) {
    // If the square is already filled or there is a winner, return early
    if (squares[i] || calculateWinner(squares)[0] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // Resets the board and game state for a new round, but keeps the current scores.
  // It also alternates the starting player.
  function handlePlayAgainButton() {
    const nextStartingPlayer = startingPlayer === "X" ? "O" : "X";
    setStartingPlayer(nextStartingPlayer);
    setSquares(Array(9).fill(null));
    setXIsNext(xIsNext ? true : false);
    setWinner(null);
    setTimerKey((prevKey) => prevKey + 1);
  }

  // Resets the entire game, including the board, scores, and timer, to their initial starting values.
  function handleResetGameButton() {
    const nextStartingPlayer = startingPlayer === "X" ? "O" : "X";
    setStartingPlayer(nextStartingPlayer);
    setSquares(Array(9).fill(null));
    setXIsNext(xIsNext ? true : false);
    setWinner(null);
    setTimerKey((prevKey) => prevKey + 1);
    setGameTime(10);
    setScores({ X: 0, O: 0 });
    setIsFirstGameFinished(false);
  }

  const isTie = boardIsFull(squares); 
  const [winnerSymbol, winningTiles] = winner || [null, null]; 

  let status;
  if (boardIsEmpty(squares)) {
    status = "First player: " + (xIsNext ? 'X' : 'O');
  } else {
    if (winner) {
      status = `${winnerSymbol} wins!`;
    } else if (isTie) {
      status = "Game ties.";
    } else {
      status = `Next player: ${xIsNext ? "X" : "O"}`;
    }
  }
  return (
    <div className="flex flex-col items-center justify-evenly h-screen gap-2 p-2">

    <div className="hidden md:block fixed top-2 left-24">
      <HomeButton />
    </div>

    <h1 
      className="text-4xl mt-4 md:text-5xl p-2 font-cherry bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text text-center">
      {status}
    </h1>

    <div className="grid grid-cols-3 border-2 border-neutral-200 shadow-lg w-[90vw] max-w-sm">
      {tileIdxs.map((i) => getSquare(winner, winningTiles, i))}
    </div>

    <div className="flex items-center justify-center mt-2">
      <GameTimer
        key={timerKey}
        gameTime={gameTime}
        setGameTime={setGameTime}
        xIsNext={xIsNext}
        winner={winner}
        setWinner={setWinner}
        isTie={isTie}
        isGameRunning={isGameRunning}
      />
    </div>

      <div className="w-full flex justify-center min-h-[3rem]">
        <Scoreboard scores={scores} isFirstGameFinished={isFirstGameFinished} />
      </div>

      <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
        <GameButton
          handleGameButton={handleResetGameButton}
          text="Reset game"
          disabled={false}
        />
        <GameButton
          handleGameButton={handlePlayAgainButton}
          text="Play again"
          disabled={isGameRunning}
        />
      </div>

  </div>
);
}