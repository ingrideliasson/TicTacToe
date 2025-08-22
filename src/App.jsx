import Board from './components/Board';
import AiBoard from './components/AiBoard'
import Start from './components/Start'
import React from 'react';
import { HashRouter,Routes,Route } from 'react-router-dom';


function App() {
  return (    
    <HashRouter>
      <Routes>
        <Route path="/" element={<Start />}/>
        <Route path="/board" element={<Board />}/>
        <Route path="/aiboard" element={<AiBoard />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
