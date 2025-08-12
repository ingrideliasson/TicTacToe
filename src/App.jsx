import Board from './components/Board';
import AiBoard from './components/AiBoard'
import React from 'react';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-4" >

      <div className="flex flex-col items-center gap-4 font-nunito text-xl">
        <h2>2 Player game</h2>
        <Board/>
      </div>

      <div className="flex flex-col items-center gap-4 font-nunito text-xl">
        <h2>AI opponent</h2>
        <AiBoard/>
      </div>
      
    </div>
  );
}

export default App;
