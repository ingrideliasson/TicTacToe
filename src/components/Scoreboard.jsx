import React, { useState, useEffect } from 'react';

function Scoreboard({winner}) {
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
  });

  useEffect(() => {
    if (winner[0] === 'X') {
      setScores(prevScores => ({ ...prevScores, X: prevScores.X + 1 }));
    } else if (winner[0] === 'O') {
      setScores(prevScores => ({ ...prevScores, O: prevScores.O + 1 }));
    }
  }, [winner]);

  return (
    <div>
      <h2>Scoreboard</h2>
      <p>Player X: {scores.X}</p>
      <p>Player O: {scores.O}</p>
    </div>
  );
}

export default Scoreboard;
