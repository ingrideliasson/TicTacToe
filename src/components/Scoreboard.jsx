import React from 'react';

function Scoreboard({ scores, isFirstGameFinished }) {
  if (isFirstGameFinished) {
    return (
      <div className="flex flex-col items-center justify-center font-cherry bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text text-3xl md:text-4xl">
        <h2>X vs O</h2>
        <p>{scores.X} - {scores.O}</p>
      </div>
    );
  } else
    return (<></>);
}

export default Scoreboard;