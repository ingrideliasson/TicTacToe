import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-cherry">
      <div className="flex items-center justify-center gap-2 text-7xl md:text-9xl font-bold mb-8 md:mb-12">
        <h1 className="text-pink-300 ">Tic</h1>
        <h1 className="text-emerald-400 ">Tac</h1>
        <h1 className="text-blue-400 ">Toe</h1>
      </div>
      <p className="text-3xl md:text-4xl p-8 mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text"> Choose game mode:</p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        <Link
          to="/aiboard"
          className="bg-gradient-to-r from-pink-300 to-emerald-400 px-10 py-4 text-white text-lg md:text-xl rounded-lg"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="bg-gradient-to-r from-emerald-400 to-blue-400 px-12 py-4 text-white text-lg md:text-xl rounded-lg"
        >
          Two Player
        </Link>
      </div>
    </div>
  );
}
