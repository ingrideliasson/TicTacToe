function GameEndPopUp({ isOpen, winner }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {/* Bakgrund */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Själva popupen */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-11 h-1/4 w-1/4">
        <div>
          {winner ? (
            <p>Winner: {winner}!</p>
          ) : (
            <p>Game is a tie!</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default GameEndPopUp;
