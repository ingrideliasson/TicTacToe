import { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard.jsx';
import HomeButton from "./HomeButton.jsx";
import DifficultySlider from "./DifficultySlider.jsx"
import GameButton from "./GameButton.jsx";
import Square from "./Square.jsx";
import { calculateWinner, boardIsFull, boardIsEmpty, computerMove, humanMove } from "./gameHelpers.js";

export default function AiBoard() {
  const [difficulty, setDifficulty] = useState("medium");
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [currentTurn, setCurrentTurn] = useState(startingPlayer);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ X: 0, O: 0, });
  const [isFirstGameFinished, setIsFirstGameFinished] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const humanSymbol = 'X';
  const aiSymbol = 'O';
  const [winnerSymbol, winningTiles] = calculateWinner(squares);
  const isTie = boardIsFull(squares);

  // This hook manages the AI's turn. It checks if it's the AI's turn and if the game is still ongoing.
  // If so, it calls the computerMove function 
  useEffect(() => {
    if (!difficulty) return;
    if (currentTurn !== aiSymbol) return;
    if (calculateWinner(squares)[0] || boardIsFull(squares)) return;
    const timer = setTimeout(() => computerMove(squares, difficulty, startingPlayer, aiSymbol, humanSymbol, setSquares, setCurrentTurn), 1000);
    return () => clearTimeout(timer);
  }, [difficulty, currentTurn, squares, startingPlayer]);

  // This hook updates the scores. It runs whenever winnerSymbol changes and increments the score
  // for the winning player ('X' or 'O').
  useEffect(() => {
  if (winnerSymbol && winnerSymbol[0] === 'X') {
    setScores(prevScores => ({ ...prevScores, X: prevScores.X + 1 }));
  } else if (winnerSymbol && winnerSymbol[0] === 'O') {
    setScores(prevScores => ({ ...prevScores, O: prevScores.O + 1 }));
  }
  }, [winnerSymbol]);

  // This hook controls the game's state flags. It sets isGameRunning to false
  // when the game ends (with a winner or a tie) and sets isFirstGameFinished to true.
  // It also handles the case where the board is empty, ensuring isGameRunning is false.
  useEffect(() => {
    if (winnerSymbol || boardIsFull(squares)) {
      setIsGameRunning(false);
      setIsFirstGameFinished(true);
    }
    else if (squares.every(square => square === null))
      setIsGameRunning(false);
    else
      setIsGameRunning(true);
  }, [winnerSymbol, squares])

  // This hook is specifically for the isFirstGameFinished state.
  // It ensures this flag is set to true as soon as the game concludes, either by a win or a tie.
  useEffect(() => {
    if ((winnerSymbol || isTie)) {
      setIsFirstGameFinished(true);
    }
  }, [winnerSymbol, isTie])

  // This function resets the game to start a new round. It changes the starting player,
  // sets the current turn to the new starting player, and clears the board
  function handlePlayAgainButton(){
    const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X';
    setStartingPlayer(nextStartingPlayer);
    setCurrentTurn(nextStartingPlayer);
    setSquares(Array(9).fill(null));
  }

  // This function performs a full reset of the game. It resets the scores to zero, clears the board,
  // and ensures the game-finished flag is set to false
  function handleResetGameButton() {
    const nextStartingPlayer = startingPlayer === 'X' ? 'X' : 'O';
    setStartingPlayer(nextStartingPlayer);
    setCurrentTurn(nextStartingPlayer);
    setScores({ X: 0, O: 0, });
    setSquares(Array(9).fill(null));
    setIsFirstGameFinished(false);
  }

  let status;
  if (boardIsEmpty(squares)) {
    status = "First player: " + (currentTurn);
  } else {
    if (winnerSymbol) {
      status = `${winnerSymbol} wins!`;
    } else if (isTie) {
      status = "Game ties.";
    } else {
      status = `Next player: ${currentTurn}`;
    }
  }

  return (
    <div className="flex flex-col items-center justify-start md:mt-0 gap-4 min-h-screen pt-[3vh] sm:pt-[1vh] xl:pt-[1vh] 2xl:xl:pt-[10vh]">

      <div className="hidden md:block fixed left-[250px] xl:left-[200px] 2xl:left-[750px] md:w-1/3 md:mr-32 md:mt-7 md:mb-0">
        <HomeButton />
      </div>

      <h1 className="text-4xl mt-4 md:text-5xl md:p-2 font-cherry bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text ">
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
              onSquareClick={() => humanMove(i, difficulty, currentTurn, aiSymbol, humanSymbol, squares, setSquares, setCurrentTurn)}
              isWinningTile={isWinningTile}
              delay={delay}
            />
          );
        })}
      </div>

      <div className="flex gap-4 items-center">
        <DifficultySlider
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          disabled={isGameRunning}
        />
      </div>

      <Scoreboard scores={scores} isFirstGameFinished={isFirstGameFinished}/>

      <div className="flex items-center justify-center gap-4">
        <GameButton handleGameButton={handleResetGameButton} text="Reset game" disabled={false}/>
        <GameButton handleGameButton={handlePlayAgainButton} text="Play again" disabled={isGameRunning}/>
      </div>

    </div>
  );
}
