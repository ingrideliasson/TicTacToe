import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-sky-400 font-cherry">
      <h1 className="text-8xl font-bold mb-16 bg-gradient-to-r from-pink-600 to-pink-600 text-transparent bg-clip-text">Tic Tac Toe</h1>
      <p className="text-4xl p-8 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 text-transparent bg-clip-text"> Choose game mode:</p>
      <div className="flex space-x-4 mr-8">
        <Link
          to="/aiboard"
          className="bg-blue-600 m-8 px-6 py-3 text-white rounded-lg"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="bg-blue-600 m-8 px-6 py-3 text-white rounded-lg"
        >
          Two Player
        </Link>
      </div>
    </div>
  );
}
