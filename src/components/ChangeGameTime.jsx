import { useState, useEffect, useRef } from "react";

function ChangeGameTime({ gameTime, setGameTime, isGameRunning }) {

  const [newGameTime, setNewGameTime] = useState(10);
  const [newGameTimeMessage, setNewGameTimeMessage] = useState('');
  const gameTimeRef = useRef(gameTime);

  useEffect(() => {
    gameTimeRef.current = gameTime;
  }, [gameTime]);

  useEffect(() => {
    setNewGameTimeMessage("");
    setNewGameTime(gameTimeRef.current);
  }, [isGameRunning, gameTime])

  function handleNewGameTime() {
    const value = parseInt(newGameTime, 10);
    if (isNaN(value) || value < 1 || value > 60) {
      setNewGameTimeMessage('Values between 1 and 60.');
      setNewGameTime(gameTime);
      return;
    } else {
      setGameTime(value);
      setNewGameTimeMessage('Time is updated.');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-[200px]">
        <label htmlFor="newGameTime">Game time</label>
        <div className="flex items-center space-x-2">
          <input
            readOnly={isGameRunning}
            type="number"
            id="newGameTime"
            onChange={(e) => setNewGameTime(e.target.value)}
            value={newGameTime} className="
            border
            border-gray-400
            rounded
            px-2
            py-1
            focus:border-blue-500
            focus:ring
            focus:ring-blue-500
            focus:ring-opacity-50
            w-20"/>
          <button
            disabled={isGameRunning}
            onClick={handleNewGameTime} className="
            font-cherry 
            text-white 
            text-xl 
            py-1 
            px-2 
            bg-gradient-to-r 
            from-emerald-400 
            to-blue-400 
            rounded-lg 
            disabled:opacity-50 
            h-full">
            Save
          </button>
        </div>
        <p className="text-red-500 h-6 text-left">
        {newGameTimeMessage}
      </p>
      </div>
      
    </>
  )
}

export default ChangeGameTime;