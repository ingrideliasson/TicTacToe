import {useState, useEffect} from 'react';
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

export default function AiBoard() {
  const [difficulty, setDifficulty] = useState(null) // easy || medium || hard
  const [startingPlayer, setStartingPlayer] = useState('X'); // Starting player can be changed
  const [currentTurn, setCurrentTurn] = useState(startingPlayer); // Starting player starts
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
    if (!difficulty) return;
    if (currentTurn !== humanSymbol) return; // Prevent human from clicking when it's not their turn
    makeMove(i, humanSymbol)
  }
  
  // AI moves
  function computerMove(){

    if (difficulty === "easy"){
      let move = findWinningMove(squares, aiSymbol);
      if (move !== null){
        makeMove(move, aiSymbol);
        return;
      }

      move = findWinningMove(squares, humanSymbol);
      if (move !== null){
        makeMove(move, aiSymbol);
        return;
      }

      const emptySquareIndexes = [];
      squares.forEach((element, index) => { 
          if (element === null) {
              emptySquareIndexes.push(index);
          }
      });

      const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
      const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
      makeMove(randomIndex, aiSymbol) 
      return;
    }


    if (difficulty === "medium"){
      // Check if AI can win this turn, if so, make the move
      let move = findWinningMove(squares, aiSymbol);
      if (move !== null){
          makeMove(move, aiSymbol);
          return;
      }

      // Check if human can win next turn, if so, block them
      move = findWinningMove(squares, humanSymbol);
      if (move !== null){
          makeMove(move, aiSymbol);
          return;
      }

      // If neither the AI or the human can win, place a pawn in a line where we already have a pawn (if possible)
      move = findStrategicMove(squares, aiSymbol)
      if (move !== null){
          makeMove(move, aiSymbol)
          return;
      }

      // Otherwise, place randomly
      const emptySquareIndexes = [];
      squares.forEach((element, index) => { 
          if (element === null) {
              emptySquareIndexes.push(index);
          }
      });

      const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
      const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
      makeMove(randomIndex, aiSymbol)
      return;
    }

    if (difficulty === "hard"){

      // If AI is first, place in the middle
      if (boardIsEmpty(squares) && startingPlayer === aiSymbol){
        makeMove(4, aiSymbol);
        return;
      }

      // AI's second move after starting
      if ((squares.filter((sq) => sq !== null).length === 2) && startingPlayer === aiSymbol){
        const corners = [0, 2, 6, 8];
        const random = Math.floor(Math.random() * corners.length); // Pick random corner
        const randomCorner = corners[random];
        makeMove(randomCorner, aiSymbol);
        return;
      }

      // If human starts in the middle, AI places in corner
      if ((squares.filter((sq) => sq !== null).length === 1) && startingPlayer === humanSymbol){
        const corners = [0, 2, 6, 8];
        const random = Math.floor(Math.random() * corners.length); // Pick random corner
        const randomCorner = corners[random];
        makeMove(randomCorner, aiSymbol);
        return;
      }

      let move = findWinningMove(squares, aiSymbol);
      if (move !== null){
          makeMove(move, aiSymbol);
          return;
      }

      move = findWinningMove(squares, humanSymbol);
      if (move !== null){
          makeMove(move, aiSymbol);
          return;
      }

      move = findStrategicMove(squares, aiSymbol)
      if (move !== null){
          makeMove(move, aiSymbol)
          return;
      }

      const emptySquareIndexes = [];
      squares.forEach((element, index) => { 
          if (element === null) {
              emptySquareIndexes.push(index);
          }
      });

      const indexChoices = Math.floor(Math.random() * emptySquareIndexes.length); // Get random element of the extracted indexes (e.g. 1 or 2 if array is of length 2)
      const randomIndex = emptySquareIndexes[indexChoices]; // Choose random empty square based on the index
      makeMove(randomIndex, aiSymbol) 
      return;
    }
  }

  // // This is neeced to trigger the AI to start after difficulty has been set when they are first player
  //   useEffect(() => {
  //     if (
  //       difficulty &&
  //       boardIsEmpty(squares) &&
  //       startingPlayer === aiSymbol &&
  //       currentTurn === aiSymbol
  //     ) {
  //       const timer = setTimeout(() => {
  //         computerMove();
  //       }, 1000);

  //       return clearTimeout(timer);
  //     }
  //   }, [difficulty, squares, currentTurn, startingPlayer]);

  // // For regular AI moves
  //   useEffect(() => {
  //     // Check if it’s AI’s turn and no winner yet, and difficulty has been set
  //     if (
  //       difficulty && 
  //       !calculateWinner(squares) && 
  //       !boardIsFull(squares) && 
  //       currentTurn === aiSymbol
  //     ) {
  //         // Call AI move with a small delay
  //         const timer = setTimeout(() => {
  //         computerMove();
  //         }, 1000);

  //         return () => clearTimeout(timer); // Timer cleanup
  //   }
  //   }, [squares, currentTurn]); // useEffect triggers when dependencies in here changes, so when the board updates or player turn changes

  useEffect(() => {
    if (!difficulty) return; // wait for difficulty
    if (currentTurn !== aiSymbol) return; // only AI's turn
    if (calculateWinner(squares) || boardIsFull(squares)) return; // game over

    const timer = setTimeout(() => {
        computerMove();
      }, 1000);

      return () => clearTimeout(timer);
    }, [difficulty, currentTurn, squares]);


  const winner = calculateWinner(squares);
  const isTie = boardIsFull(squares);
  const isFirstMove = boardIsEmpty(squares);
  let status;

  if (isFirstMove){
    status = "First player: " + currentTurn;
  } else {
    if (winner){
    status = winner + " wins!"
  } else { 
    if (isTie){ // There is no winner - if the board is filled, there is a tie
      status = "Game ties."
    } else {
      status = "Next player: " + currentTurn;
    }
  }
  }


  function playAgain(){ // Triggered when "play again" is clicked
    if (winner || isTie) {
      const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X'; // Change starting player
      setStartingPlayer(nextStartingPlayer);
      setCurrentTurn(nextStartingPlayer);

      // Empty the board
      setSquares(Array(9).fill(null));
      setDifficulty(null);
    } else {
      return;
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

      <h1 className="text-4xl text-pink-800 font-cherry ">{status}</h1>
      <button className="font-cherry text-white p-2 bg-sky-300 text-white rounded-lg disabled:opacity-50 "
      onClick={() => playAgain()}>
        Play again
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
        return squares[a] // Returns 'X' or 'O'
      }
    }
  return null;
}

function boardIsFull(squares) {
  return squares.every(square => square !== null);
}

function boardIsEmpty(squares) {
  return squares.every(square => square === null);
}

// Helper function to check if any player can win on the next move
function findWinningMove(squares, symbol){  
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

  // Loop through each lines two see if it is winnable (two pawns on a row with one empty square)
  for (let [a, b, c] of lines) {
    const line =  [squares[a], squares[b], squares[c]];

    // Count how many places on a line are taken by the same player, and how many on the line are empty
    const countSymbol = line.filter(val => val === symbol).length;
    const countEmpty = line.filter(val => val === null).length;

    // If there are exactly 2 pawns and one empty space on the row, return which space is empty so we can fill/block it later
    if (countSymbol === 2 && countEmpty === 1) {
        if (squares[a] === null) return a;
        if (squares[b] === null) return b;
        if (squares[c] === null) return c;
    }
  }

  // If no winning move found, return null
  return null;

}

// Helper function for the AI to place a pawn on a row where it already has a pawn
function findStrategicMove(squares, aiSymbol){
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

  let possibleMoves = [];

  for (let [a, b, c] of lines){
    const line = [squares[a], squares[b], squares[c]];

    const countSymbol = line.filter(val => val === aiSymbol).length;
    const countEmpty = line.filter(val => val === aiSymbol).length;

    if (countSymbol === 1 && countEmpty === 2){
        if (squares[a] === null) possibleMoves.push(a);
        if (squares[b] === null) possibleMoves.push(b);
        if (squares[c] === null) possibleMoves.push(c);
    }

  // If there are possible moves, pick one randomly
  if (possibleMoves.length > 0){
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
}
  return null;
}



  // Can be used to reset game
  // function resetGame(){
  //   const nextStartingPlayer = startingPlayer === 'X' ? 'X' : 'O'; // Keep same starting player
  //   setStartingPlayer(nextStartingPlayer);
  //   setCurrentTurn(nextStartingPlayer);

  //   // Empty the board
  //   setSquares(Array(9).fill(null));
  // }