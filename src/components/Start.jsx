import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Tic Tac Toe</h1>
      <p> Choose game mode:</p>
      <div className="flex space-x-4">
        <Link
          to="/aiboard"
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Single Player
        </Link>
        <Link
          to="/board"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Two player
        </Link>
      </div>
    </div>
  );
}
