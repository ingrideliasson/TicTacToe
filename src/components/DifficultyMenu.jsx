import { useState } from "react";

export default function DifficultyDropdown({ difficulty, setDifficulty, disabled }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  return (
    <div className="relative">
      <button
        className={` w-40 bg-white font-nunito text-gray-500 text-lg ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        {difficulty
          ? options.find((o) => o.value === difficulty)?.label
          : "Select difficulty"}
      </button>

      {open && (
        <ul className="absolute mt-2 w-40 bg-gray-50 text-gray-700 font-nunito border rounded-lg shadow-lg z-50">
          {options.map((opt) => (
            <li
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setDifficulty(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
