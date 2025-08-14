import { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard.jsx';
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

export default function AiBoard() {
  const [difficulty, setDifficulty] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [currentTurn, setCurrentTurn] = useState(startingPlayer);
  const [squares, setSquares] = useState(Array(9).fill(null));

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

  function playAgain() {
    if (winnerSymbol || isTie) {
      const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X';
      setStartingPlayer(nextStartingPlayer);
      setCurrentTurn(nextStartingPlayer);
      setSquares(Array(9).fill(null));
      setDifficulty(null);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4 items-center">
        <label className="font-nunito text-lg">Difficulty:</label>
        <select
          value={difficulty || ""}
          onChange={(e) => setDifficulty(e.target.value)}
          disabled={!boardIsEmpty(squares)}>
          <option value="" disabled>Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
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

      {winnerSymbol ? (<Scoreboard winner={winnerSymbol} />) : null}
      <h1 className="text-4xl text-pink-800 font-cherry ">{status}</h1>
      <button
        className="font-cherry text-white p-2 bg-sky-300 rounded-lg disabled:opacity-50"
        onClick={playAgain}>
        Play again
      </button>
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


// import { useState, useEffect, useRef } from 'react';
// import Scoreboard from './Scoreboard.jsx'
// import { motion, AnimatePresence } from "framer-motion";
// import GameTimer from './GameTimer'

// function Square({ value, onSquareClick, index, isWinningTile, delay = 0 }) {
//   const animationVariants = [
//     { y: -100, x: -100 },
//     { y: -100, x: 0 },
//     { y: -100, x: 100 },
//     { y: 0, x: -100 },
//     { y: 0, x: -100 },
//     { y: 0, x: 100 },
//     { y: 100, x: -100 },
//     { y: 100, x: 0 },
//     { y: 100, x: 100 }
//   ];

//   const [highlight, setHighlight] = useState(false);

//   // Start highlight animation after delay
//   useEffect(() => {
//     if (isWinningTile) {
//       const timeout = setTimeout(() => setHighlight(true), delay * 1000);
//       return () => clearTimeout(timeout);
//     }
//   }, [isWinningTile, delay]);

//   return (
//     <button
//       className="border-2 border-sky-300 h-48 w-48 font-cherry flex items-center justify-center"
//       onClick={onSquareClick}
//     >
//       {value && (
//         <motion.span
//           key={value}
//           initial={{ ...animationVariants[index], opacity: 0, scale: 0.5 }}
//           animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
//           transition={{ type: "spring", stiffness: 500, damping: 20 }}
//           className={`text-5xl ${
//             isWinningTile ? "text-green-500" : "text-sky-500"
//           }`}
//         >
//           <motion.div
//             animate={highlight ? { scale: 1.3 } : { scale: 1 }}
//             transition={{
//               type: "spring",
//               stiffness: 300,
//               damping: 10
//             }}
//           >
//             {value}
//           </motion.div>
//         </motion.span>
//       )}
//     </button>
//   );
// }

// export default function AiBoard() {

//   const [xIsNext, setXIsNext] = useState(true);
//   const [winner, setWinner] = useState(null);
//   const [gameTime, setGameTime] = useState(10);
//   const inputRefTimer = useRef();
//   const tileIdxs = [0,1,2,3,4,5,6,7,8];

//   const [difficulty, setDifficulty] = useState(null) // easy || medium || hard
//   const [startingPlayer, setStartingPlayer] = useState('X'); // Starting player can be changed
//   const [currentTurn, setCurrentTurn] = useState(startingPlayer); // Starting player starts
//   const [squares, setSquares] = useState(Array(9).fill(null));

//   let humanSymbol = 'X'; // TODO: user should be able to choose symbol at start of game
//   let aiSymbol = 'O';

//     function getSquare(winner, winningTiles, i) {
//   const isWinningTile = winner && Array.isArray(winningTiles) && winningTiles.includes(i);
//   const delay =
//     isWinningTile && winner
//       ? winningTiles.indexOf(i) * 0.3 // delay based on order
//       : 0;

//   return (
//     <Square
//       key={i}
//       value={squares[i]}
//       index={i}
//       onSquareClick={() => handleClick(i)}
//       isWinningTile={isWinningTile}
//       delay={delay}
//     />
//   );
//   }

//     useEffect(() => {
//       const [newWinnerSymbol, winningTiles] = calculateWinner(squares);
//       if (newWinnerSymbol && newWinnerSymbol !== winner) {
//         setWinner([newWinnerSymbol, winningTiles]);
//       }
//     }, [squares]);
  

//   // Generic move function that handles both human and AI moves
//   function makeMove(i, playerSymbol) {
//     if (squares[i] || calculateWinner(squares)) { // If square is already filled or there is already a winner, return early
//         return;
//     }

//     const nextSquares = squares.slice();
//     nextSquares[i] = playerSymbol; // Fill square

//     setSquares(nextSquares); // Update state of squares array
//     setCurrentTurn(prevTurn => (prevTurn === humanSymbol ? aiSymbol : humanSymbol)); // Update state of who's turn it is, if currently X, set to O, and vice versa
//   }

//   //Only for human moves
//   function humanMove(i) {
//     if (!difficulty) return;
//     if (currentTurn !== humanSymbol) return; // Prevent human from clicking when it's not their turn
//     makeMove(i, humanSymbol)
//   }
  
//   // AI moves
//   function computerMove(){

//     if (difficulty === "easy"){
//       let move = findWinningMove(squares, aiSymbol);
//       if (move !== null){
//         makeMove(move, aiSymbol);
//         return;
//       }

//       move = findWinningMove(squares, humanSymbol);
//       if (move !== null){
//         makeMove(move, aiSymbol);
//         return;
//       }

//       const emptySquareIndexes = [];
//       squares.forEach((element, index) => { 
//           if (element === null) {
//               emptySquareIndexes.push(index);
//           }
//       });

//       const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
//       const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
//       makeMove(randomIndex, aiSymbol) 
//       return;
//     }


//     if (difficulty === "medium"){
//       // Check if AI can win this turn, if so, make the move
//       let move = findWinningMove(squares, aiSymbol);
//       if (move !== null){
//           makeMove(move, aiSymbol);
//           return;
//       }

//       // Check if human can win next turn, if so, block them
//       move = findWinningMove(squares, humanSymbol);
//       if (move !== null){
//           makeMove(move, aiSymbol);
//           return;
//       }

//       // If neither the AI or the human can win, place a pawn in a line where we already have a pawn (if possible)
//       move = findStrategicMove(squares, aiSymbol)
//       if (move !== null){
//           makeMove(move, aiSymbol)
//           return;
//       }

//       // Otherwise, place randomly
//       const emptySquareIndexes = [];
//       squares.forEach((element, index) => { 
//           if (element === null) {
//               emptySquareIndexes.push(index);
//           }
//       });

//       const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
//       const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
//       makeMove(randomIndex, aiSymbol)
//       return;
//     }

//     if (difficulty === "hard"){

//       // If AI is first, place in the middle
//       if (boardIsEmpty(squares) && startingPlayer === aiSymbol){
//         makeMove(4, aiSymbol);
//         return;
//       }

//       // AI's second move after starting
//       if ((squares.filter((sq) => sq !== null).length === 2) && startingPlayer === aiSymbol){
//         // Checks that the AI places their pawn in a corner but not the one opposite to where there is already a pawn
//         let possibleCorners;
//         if (squares[0] !== null || squares[8] !== null){
//             possibleCorners = [2 ,6];

//         } else if (squares[2]!== null || squares[6] !== null) {
//           possibleCorners =  [0, 8];

//         } else{
//           possibleCorners = [0, 2, 6, 8]; // If human did not place in a corner, all corners are possible
//         }

//         const random = Math.floor(Math.random() * possibleCorners.length); // Pick random corner
//         const randomCorner = possibleCorners[random];
//         makeMove(randomCorner, aiSymbol);
//         return;
//       }

//       // If human starts in the middle, AI places in corner
//       if ((squares.filter((sq) => sq !== null).length === 1) && startingPlayer === humanSymbol){
//         const corners = [0, 2, 6, 8];
//         const random = Math.floor(Math.random() * corners.length); // Pick random corner
//         const randomCorner = corners[random];
//         if (squares[randomCorner] === null) {
//           makeMove(randomCorner, aiSymbol);
//           return;
//         }
        
//       }

//       let move = findWinningMove(squares, aiSymbol);
//       if (move !== null){
//           makeMove(move, aiSymbol);
//           return;
//       }

//       move = findWinningMove(squares, humanSymbol);
//       if (move !== null){
//           makeMove(move, aiSymbol);
//           return;
//       }

//       move = findStrategicMove(squares, aiSymbol)
//       if (move !== null){
//           makeMove(move, aiSymbol)
//           return;
//       }

//       const emptySquareIndexes = [];
//       squares.forEach((element, index) => { 
//           if (element === null) {
//               emptySquareIndexes.push(index);
//           }
//       });

//       const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
//       const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
//       makeMove(randomIndex, aiSymbol) 
//       return;
//     }
//   }

//   useEffect(() => {
//     if (!difficulty) return; // wait for difficulty
//     if (currentTurn !== aiSymbol) return; // only AI's turn
//     if (calculateWinner(squares) || boardIsFull(squares)) return; // game over

//     const timer = setTimeout(() => {
//         computerMove();
//       }, 1000);

//       return () => clearTimeout(timer);
//     }, [difficulty, currentTurn, squares]);


//     function handleClick(i) {

//     if (squares[i] || calculateWinner(squares)[0]) {  // If the square is already filled or there is a winner, return early
//       return;
//     }

//     const nextSquares = squares.slice(); // Copy of squares array

//     if (xIsNext) { // Check whether to fill X or O
//       nextSquares[i] = "X";
//     } else {
//       nextSquares[i] = "O";
//     }
    
//     setSquares(nextSquares); // Update state of array
//     setXIsNext(!xIsNext); // Update state of which symbol is next
//   }

//   const [_,winningTiles] = calculateWinner(squares);
//   const isTie = boardIsFull(squares);
//   const isFirstMove = boardIsEmpty(squares);
//   let status;

//   if (isFirstMove){
//     status = "First player: " + currentTurn;
//   } else {
//     if (winner){
//     status = winner + " wins!"
//   } else { 
//     if (isTie){ // There is no winner - if the board is filled, there is a tie
//       status = "Game ties."
//     } else {
//       status = "Next player: " + currentTurn;
//     }
//   }
//   }


//   function playAgain(){ // Triggered when "play again" is clicked
//     if (winner || isTie) {
//       const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X'; // Change starting player
//       setStartingPlayer(nextStartingPlayer);
//       setCurrentTurn(nextStartingPlayer);

//       // Empty the board
//       setSquares(Array(9).fill(null));
//       setDifficulty(null);
//     } else {
//       return;
//     }
    
//   }


//   return (
//     <div className="flex flex-col items-center justify-center gap-8">

//       <div className="flex gap-4 items-center">
//       <label className="font-nunito text-lg">Difficulty:</label> 
//         <select
//           value={difficulty || ""}
//           onChange={(e) => setDifficulty(e.target.value)}
//           disabled={!boardIsEmpty(squares)}>
//           <option value="" disabled>Select difficulty</option>
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>
//       </div>
      
//  <div className="grid grid-cols-3 border-4 border-sky-300 rounded-xl">
//       {tileIdxs.map((i)=>
//       getSquare(winner, winningTiles, i))
//         }
//       </div>
//       <div>
//         <input type="number" ref={inputRefTimer} placeholder='Ändra timer sekunder'/>
//         <button onClick={() => setGameTime(inputRefTimer.current.value)}>
//           Spara
//         </button>
//       </div>
//       <GameTimer gameTime={gameTime} xIsNext={xIsNext} winner={winner} setWinner={setWinner}></GameTimer>
//       { winner ? (<Scoreboard winner={winner}/>) : null }
//       <h1 className="text-4xl text-pink-800 font-cherry ">{status}</h1>
//       <button className="font-cherry text-white p-2 bg-sky-300 text-white rounded-lg disabled:opacity-50 "
//       onClick={() => playAgain()}>
//         Play again
//         </button>
//     </div>
//   );
// }

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5], 
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];

//     for (let i = 0; i < lines.length; i++) {
//       const [a, b, c] = lines[i];
//       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//         return [squares[a],lines[i]] // Returns 'X' or 'O'
//       }
//     }
//   return [null,null];
// }

// function boardIsFull(squares) {
//   return squares.every(square => square !== null);
// }

// function boardIsEmpty(squares) {
//   return squares.every(square => square === null);
// }

// // Helper function to check if any player can win on the next move
// function findWinningMove(squares, symbol){  
//     const lines = [
//     [0, 1, 2],
//     [3, 4, 5], 
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];

//   // Loop through each lines two see if it is winnable (two pawns on a row with one empty square)
//   for (let [a, b, c] of lines) {
//     const line =  [squares[a], squares[b], squares[c]];

//     // Count how many places on a line are taken by the same player, and how many on the line are empty
//     const countSymbol = line.filter(val => val === symbol).length;
//     const countEmpty = line.filter(val => val === null).length;

//     // If there are exactly 2 pawns and one empty space on the row, return which space is empty so we can fill/block it later
//     if (countSymbol === 2 && countEmpty === 1) {
//         if (squares[a] === null) return a;
//         if (squares[b] === null) return b;
//         if (squares[c] === null) return c;
//     }
//   }

//   // If no winning move found, return null
//   return null;

// }

// // Helper function for the AI to place a pawn on a row where it already has a pawn
// function findStrategicMove(squares, aiSymbol){
//     const lines = [
//     [0, 1, 2],
//     [3, 4, 5], 
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];

//   let possibleMoves = [];

//   for (let [a, b, c] of lines){
//     const line = [squares[a], squares[b], squares[c]];

//     const countSymbol = line.filter(val => val === aiSymbol).length;
//     const countEmpty = line.filter(val => val === aiSymbol).length;

//     if (countSymbol === 1 && countEmpty === 2){
//         if (squares[a] === null) possibleMoves.push(a);
//         if (squares[b] === null) possibleMoves.push(b);
//         if (squares[c] === null) possibleMoves.push(c);
//     }

//   // If there are possible moves, pick one randomly
//   if (possibleMoves.length > 0){
//     return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
//   }
// }
//   return null;
// }