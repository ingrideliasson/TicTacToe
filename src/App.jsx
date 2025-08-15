import Board from './components/Board';
import AiBoard from './components/AiBoard'
import Start from './components/Start'
import React from 'react';
import { BrowserRouter,Routes,Route,Link } from 'react-router';


function App() {
  return (    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />}/>
        <Route path="/board" element={<Board />}/>
        <Route path="/aiboard" element={<AiBoard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
