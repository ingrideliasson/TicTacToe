
function GameButton({ handleGameButton, text, disabled }) {
  return (
    <button
      disabled={disabled} 
      className="
      font-cherry
      text-white
      text-xl
      p-3
      px-6
      bg-gradient-to-r
      from-emerald-400
      to-blue-400
      rounded-lg
      disabled:opacity-50 "
      onClick={() => handleGameButton()}>
      {text}
    </button>
  )
}

export default GameButton;