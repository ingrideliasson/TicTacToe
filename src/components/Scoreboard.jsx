import React from 'react';

function Scoreboard({scores}) {
  return (
    <div>
      <h2>Scoreboard</h2>
      <p>Player X: {scores.X}</p>
      <p>Player O: {scores.O}</p>
    </div>
  );
}

export default Scoreboard;