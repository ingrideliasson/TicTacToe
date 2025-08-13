import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">Tic Tac Toe</h1>
      <p class="m-8 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text"> Choose game mode:</p>
      <div className="flex space-x-4">
        <Link
          to="/aiboard"
          className="bg-gradient-to-r from-blue-600 to-green-500 m-8 px-6 py-3 text-white rounded-lg"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="bg-gradient-to-r from-green-500 to-indigo-400 m-8 px-6 py-3 text-white rounded-lg"
        >
          Two Player
        </Link>
      </div>
    </div>
  );
}
