import { useState, useEffect , useRef} from 'react';
import GameTimer from './GameTimer'
import Scoreboard from './Scoreboard.jsx'
import GameEndPopUp from './GameEndPopUp.jsx'


import { motion, AnimatePresence } from "framer-motion";



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
          key={value}
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


export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [gameTime, setGameTime] = useState(10);
  const inputRefTimer = useRef();
  const tileIdxs = [0,1,2,3,4,5,6,7,8];
  const [scores, setScores] = useState({ X: 0, O: 0, });
  const [isTie, setIsTie] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const [showPopUp, setShowPopUp] = useState(false);

  //Kollar efter lika
  useEffect(() => {
    setIsTie(boardIsFull(squares));
  }, [squares]);

  function getSquare(winner, winningTiles, i) {
  const isWinningTile = winner && Array.isArray(winningTiles) && winningTiles.includes(i);
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

  //Pop-up play again
  useEffect(() => {
    if (isTie || winner) {
      setShowPopUp(true);
    }
  }, [isTie, winner]);

  useEffect(() => {
    const [newWinnerSymbol, winningTiles] = calculateWinner(squares);
    if (newWinnerSymbol && newWinnerSymbol !== winner) {
      setWinner([newWinnerSymbol, winningTiles]);
    }
  }, [squares]);


  
  // Reset board when gameTime changes
  useEffect(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  }, [gameTime]);


  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)[0]) {  // If the square is already filled or there is a winner, return early
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

  function newGame() {
    const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X'; // Change starting player
    setStartingPlayer(nextStartingPlayer);
    setSquares(Array(9).fill(null));
    setXIsNext(xIsNext? true : false);
    setWinner(null);
    setTimerKey(prevKey => prevKey + 1);
  }

  const [_,winningTiles] = calculateWinner(squares);

  const isFirstMove = boardIsEmpty(squares);
  let status;

  if(isFirstMove){
    status = "First player: " + (xIsNext ? 'X' : 'O');
  } else {
    if (winner){
    status = winner[0] + " wins!"
  } else { 
    if (isTie){ // There is no winner - if the board is filled, there is a tie
      status = "Game ties."
    } else {
      status = "Next player: " + (xIsNext ? 'X' : 'O');
    }
  }
  }

  

  // Uppdatera 'scores' 
  useEffect(() => {
    if (winner && winner[0] === 'X') {
      setScores(prevScores => ({ ...prevScores, X: prevScores.X + 1 }));
    } else if (winner && winner[0] === 'O') {
      setScores(prevScores => ({ ...prevScores, O: prevScores.O + 1 }));
    }
  }, [winner]);
 
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <GameEndPopUp isOpen={showPopUp} setIsOpen={setShowPopUp} winner={winner} reset={newGame} newGame ={newGame} />
      <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
      {tileIdxs.map((i)=>
      getSquare(winner, winningTiles, i))
        }
      </div>
      <div>
        <input type="number" ref={inputRefTimer} placeholder='Ändra timer sekunder'/>
        <button onClick={() => setGameTime(inputRefTimer.current.value)}>
          Spara
        </button>
      </div>
      <GameTimer key={timerKey} gameTime={gameTime} xIsNext={xIsNext} winner={winner} setWinner={setWinner} isTie={isTie}></GameTimer>
      <h1 className="text-4xl text-pink-800 font-cherry ">{status}</h1>
      { (winner || isTie) && <Scoreboard scores={scores} /> }
      <button className="font-cherry text-white p-2 bg-sky-300 text-white rounded-lg disabled:opacity-50 "
      onClick={() => newGame()}> 
        New game
      </button>
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
        return [squares[a],lines[i]] // Returns 'X' or 'O'
      }
    }
  return [null,null];
}

function boardIsFull(squares) {

  for (let i = 0; i < squares.length; i++) {

    if (squares[i] === null){
      return null; // If any square is empty, return false
    }
  }

  return true; // If all squares are filled, return true
}

function boardIsEmpty(squares) {
  return squares.every(square => square === null);
}