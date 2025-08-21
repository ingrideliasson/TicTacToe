import { useState } from "react";

export default function DifficultySlider({ difficulty, setDifficulty, disabled }) {

  const options = ["Easy", "Medium", "Hard"];
  const [value, setValue] = useState(1); // Default: "Medium"

  const difficultyMapper = {
    0: "easy",
    1: "medium",
    2: "hard"
  };

  return (
    <div
        className={` flex flex-col items-center gap-4 p-6"  ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}>
      
      <div
        className="relative w-64">
        {/* Slider Track */}
        <div className="h-1 bg-neutral-200 rounded-full"></div>

        {/* Slider Options */}
        <div className="flex justify-between absolute w-full top-1/2 -translate-y-1/2">
          {options.map((opt, i) => (
            <button
              key={i}
              className={`w-6 h-6 md:w-4 md:h-4 rounded-full border-2 
                ${value === i ? "bg-amber-300 border-amber-400" : "bg-white border-neutral-300"} 
                ${disabled ? "opacity-80 cursor-not-allowed" : ""}`
              }
              onClick={() => {
                if (!disabled) {
                  setValue(i);
                  setDifficulty(difficultyMapper[i]);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="text-lg font-medium font-nunito text-gray-700">
        {options[value]}
      </div>
    </div>
  );
}
