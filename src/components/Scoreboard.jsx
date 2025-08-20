import React from 'react';

function Scoreboard({ scores, isFirstGameFinished }) {
  if (isFirstGameFinished) {
    return (
      <div className="font-cherry bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text flex flex-col items-center justify-center text-3xl md:text-4xl md:pb-4">
        <h2>X vs O</h2>
        <p>{scores.X} - {scores.O}</p>
      </div>
    );
  } else
    return (<></>);
}

export default Scoreboard;