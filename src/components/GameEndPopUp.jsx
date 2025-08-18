import { motion } from 'framer-motion'
import bgImage from '../images/tic-tac-toe.background.png';

function GameEndPopUp({ isOpen, setIsOpen, winner, reset, newGame }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: .8,
        ease: "easeOut",
      }}
      className="fixed inset-0 flex items-center justify-center z-10">
      {/* Bakgrund */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Själva popupen */}
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg z-11 h-[700px] w-[340px] bg-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <button className="font-cherry p-2 px-4 bg-sky-300 text-white rounded-lg disabled:opacity-50 "
          onClick={() => {
            setIsOpen(false);
          }}
        >X</button>
        <div className="flex justify-center items-center h-1/2 font-cherry text-3xl ">
          <div className='bg-red-400 text-white p-3 rounded-lg'>
          {winner ? (
            <p>Winner: {winner[0]}!</p>
          ) : (
            <p>Game is a tie!</p>
            )}
          </div>
        </div>
        <div className="absolute bottom-20 inset-x-0 flex justify-center space-x-4">
          <button className="font-cherry text-white p-2 px-4 bg-sky-300 rounded-lg disabled:opacity-50"
            onClick={() => {
              reset();
              setIsOpen(false);
            }}
          >Reset</button>

          <button className="font-cherry p-2 px-4 bg-sky-300 text-white rounded-lg disabled:opacity-50 "
            onClick={() => {
              newGame();
              setIsOpen(false);
            }}
          >New Game</button>
        </div>
      </div>
    </motion.div>
  );
}

export default GameEndPopUp;
