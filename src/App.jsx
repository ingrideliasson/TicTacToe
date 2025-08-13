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



// function App() {
//   return (
//     <div className="flex items-center justify-center min-h-screen gap-4" >

//       <div className="flex flex-col items-center gap-4 font-nunito text-xl">
//         <h2>2 Player game</h2>
//         <Board/>
//       </div>

//       <div className="flex flex-col items-center gap-4 font-nunito text-xl">
//         <h2>AI opponent</h2>
//         <AiBoard/>
//       </div>
      
//     </div>
//   );
// }

// export default App;
