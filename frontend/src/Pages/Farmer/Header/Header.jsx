import { Cog8ToothIcon, LinkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Profilepicture from "../../../Assets/Farmer/Profile Pictures/2.1.jpg";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        // <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white"></header>
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="text-lg font-semibold dark:text-gray-100">Hello Manuja</div>
            <div className="flex items-center gap-3">
                  

                {/* Profile avatar */}
              <Link to="/farmer/profile" className="cursor-pointer">
                <img
                    src={Profilepicture}
                    alt="Profile avatar"
                    className="w-8 h-8 rounded-full"
                />
                </Link>
            </div>
        </header>
    );
}
