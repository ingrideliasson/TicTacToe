import React from 'react';

function Scoreboard({scores}) {
  return (
    <div className="font-cherry text-emerald-400 flex flex-col items-center justify-center text-3xl md:text-5xl pb-10">
      <h2>X vs O</h2>
      <p>{scores.X} - {scores.O}</p>
    </div>
  );
}

export default Scoreboard;