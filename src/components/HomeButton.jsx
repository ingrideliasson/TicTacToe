import { Link } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";

export default function MainMenu() {
    return (
        <div>
            <Link
          to="/"
          className="text-blue-400 text-4xl"
            >
          <FaHouseChimney />
            </Link>
        </div>
    )
}
