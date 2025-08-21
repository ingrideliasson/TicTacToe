export function boardIsFull(squares) {
  return squares.every(square => square !== null);
}

export function boardIsEmpty(squares) {
  return squares.every((square) => square === null);
}

export function calculateWinner(squares) {
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

export function findWinningMove(squares, symbol) {
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

export function findStrategicMove(squares, aiSymbol) {
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

export function makeMove(i, playerSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol) {
  if (squares[i] || calculateWinner(squares)[0]) return;
  const nextSquares = squares.slice();
  nextSquares[i] = playerSymbol;
  setSquares(nextSquares);
  setCurrentTurn(prevTurn => (prevTurn === humanSymbol ? aiSymbol : humanSymbol));
}

export function humanMove(i, difficulty, currentTurn, aiSymbol, humanSymbol, squares, setSquares, setCurrentTurn ) {
  if (!difficulty) return;
  if (currentTurn !== humanSymbol) return;
  makeMove(i, humanSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
}



export function computerMove(squares, difficulty, startingPlayer, aiSymbol, humanSymbol, setSquares, setCurrentTurn) {
  if (difficulty === "easy") {
    let move = findWinningMove(squares, aiSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    const emptySquareIndexes = squares
      .map((v, idx) => v === null ? idx : null)
      .filter(v => v !== null);
    const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
    makeMove(randomIndex, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
    return;
  }

  if (difficulty === "medium") {
    let move = findWinningMove(squares, aiSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    move = findWinningMove(squares, humanSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    const emptySquareIndexes = squares
      .map((v, idx) => v === null ? idx : null)
      .filter(v => v !== null);
    const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
    makeMove(randomIndex, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
    return;
  }

  if (difficulty === "hard") {
    if (boardIsEmpty(squares) && startingPlayer === aiSymbol) {
      return makeMove(4, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
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
      return makeMove(randomCorner, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
    }

    if (squares.filter((sq) => sq !== null).length === 1 && startingPlayer === humanSymbol) {
      const corners = [0, 2, 6, 8];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      if (squares[randomCorner] === null) return makeMove(randomCorner, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
    }

    let move = findWinningMove(squares, aiSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    move = findWinningMove(squares, humanSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    move = findStrategicMove(squares, aiSymbol);
    if (move !== null) return makeMove(move, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);

    const emptySquareIndexes = squares
      .map((v, idx) => v === null ? idx : null)
      .filter(v => v !== null);
    const randomIndex = emptySquareIndexes[Math.floor(Math.random() * emptySquareIndexes.length)];
    makeMove(randomIndex, aiSymbol, squares, setSquares, setCurrentTurn, aiSymbol, humanSymbol);
    return;
  }
}
