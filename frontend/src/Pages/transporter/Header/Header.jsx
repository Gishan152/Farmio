import { Cog8ToothIcon, LinkIcon, MagnifyingGlassIcon, BellIcon} from "@heroicons/react/24/solid";

export default function Header() {
    return (
        // <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white"></header>
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="text-lg font-semibold dark:text-gray-100">Hello Chamath</div>
            <div className="flex items-center gap-3">
                {/* Search input with properly centered icon */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-1 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                    </div>
                </div>

                {/* Icon buttons with consistent sizing */}
                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Cog8ToothIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>
                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <LinkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>

                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </button>

                {/* Profile avatar */}
                <img
                    src="https://randomuser.me/api/portraits/men/20.jpg"
                    alt="Profile avatar"
                    className="w-8 h-8 rounded-full"
                />
            </div>
        </header>
    );
}
