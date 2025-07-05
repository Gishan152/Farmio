import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function SidebarItem({ label, to, children }) {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(children);

    return (
        <li className="mb-2">
            {hasChildren ? (
                <button
                    onClick={() => setOpen(!open)}
                    className="flex justify-between items-center w-full gap-3 px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span>{label}</span>
                    <ChevronRightIcon className={`w-4 h-4 ml-2 transform transition ${open ? 'rotate-90' : ''}`} />
                </button>
            ) : (
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                    }
                >
                    {label}
                </NavLink>
            )}

            {hasChildren && open && (
                <ul className="pl-4 mt-1 space-y-1">
                    {children.map(child => (
                        <SidebarItem key={child.label} {...child} />
                    ))}
                </ul>
            )}
        </li>
    );
}
