import { useState } from "react";

export default function DifficultySlider() {
  const options = ["Easy", "Medium", "Hard"];
  const [value, setValue] = useState(1); // Default: "Medium"

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative w-64">
        {/* Slider Track */}
        <div className="h-2 bg-gray-300 rounded-full"></div>

        {/* Slider Options */}
        <div className="flex justify-between absolute w-full top-1/2 -translate-y-1/2">
          {options.map((opt, i) => (
            <button
              key={i}
              className={`w-6 h-6 rounded-full border-2 
                ${value === i ? "bg-blue-500 border-blue-700" : "bg-white border-gray-400"}`}
              onClick={() => setValue(i)}
            />
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="text-lg font-medium">
        Selected: {options[value]}
      </div>
    </div>
  );
}
