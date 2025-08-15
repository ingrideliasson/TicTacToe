import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-cherry">
      <div className="flex items-center justify-center gap-4">
        <h1 className="text-9xl font-bold mb-16 text-pink-300 ">Tic</h1>
        <h1 className="text-9xl font-bold mb-16 text-emerald-400 ">Tac</h1>
        <h1 className="text-9xl font-bold mb-16 text-blue-400 ">Toe</h1>
      </div>
      <p className="text-4xl p-8 bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text"> Choose game mode:</p>
      <div className="flex space-x-4 mr-8">
        <Link
          to="/aiboard"
          className="bg-gradient-to-r from-pink-300 to-emerald-400 m-8 px-6 py-4 text-white text-2xl rounded-lg"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="bg-gradient-to-r from-emerald-400 to-blue-400 m-8 px-6 py-4 text-white text-2xl rounded-lg"
        >
          Two Player
        </Link>
      </div>
    </div>
  );
}

// bg-gradient-to-r from-pink-600 to-pink-600 text-transparent bg-clip-text