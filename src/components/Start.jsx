import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-cherry px-4 sm:px-8">

      <div className="flex flex-row flex-wrap items-center justify-center gap-2 text-6xl sm:text-7xl md:text-9xl font-bold mb-6 sm:mb-8 md:mb-12 text-center">
        <h1 className="text-amber-300">Tic</h1>
        <h1 className="text-green-400">Tac</h1>
        <h1 className="text-blue-400">Toe</h1>
      </div>

      <p className="text-2xl sm:text-3xl md:text-4xl p-4 sm:p-6 mb-6 text-center bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
        Choose game mode:
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-md">
        <Link
          to="/aiboard"
          className="flex-1 text-center bg-gradient-to-r from-green-400 to-blue-400 px-8 py-4 text-white text-lg sm:text-xl rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="flex-1 text-center bg-gradient-to-r from-amber-400 to-green-400 px-10 py-4 text-white text-lg sm:text-xl rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          Two Player
        </Link>
      </div>
    </div>
  );
}
