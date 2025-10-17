import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '../../../Components/ThemeToggle';

export default function Header() {
    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-lg font-medium text-gray-800 dark:text-gray-100">Hello, Ceylon Green Waste Management</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    {/* <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search waste listings..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    /> */}
                </div>
                {/* <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button> */}
                {/* <ThemeToggle /> */}
            </div>
        </header>
    );
}
