import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Square({ value, onSquareClick, index, isWinningTile, delay = 0 }) {
  const animationVariants = [
    { y: -100, x: -100 },
    { y: -100, x: 0 },
    { y: -100, x: 100 },
    { y: 0, x: -100 },
    { y: 0, x: -100 },
    { y: 0, x: 100 },
    { y: 100, x: -100 },
    { y: 100, x: 0 },
    { y: 100, x: 100 },
  ];

  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (isWinningTile) {
      const timeout = setTimeout(() => setHighlight(true), delay * 1000);
      return () => clearTimeout(timeout);
    } else {
      setHighlight(false);
    }
  }, [isWinningTile, delay]);

  return (
    <button
      className="border-2 border-blue-300 h-28 w-28 md:h-36 md:w-36 font-cherry flex items-center justify-center"
      onClick={onSquareClick}
    >
      {value && (
        <motion.span
          key={value + index}
          initial={{ ...animationVariants[index], opacity: 0, scale: 0.5 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: highlight ? 1.3 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={`text-5xl ${
            isWinningTile
              ? "text-emerald-400"
              : value === "X"
                ? "text-blue-400"
                : "text-pink-300"
          }`}
        >
          {value}
        </motion.span>
      )}
    </button>
  );
}

export default Square;
