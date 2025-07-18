import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
// import { ChevronRightIcon as ArrowRightSolidIcon } from '@heroicons/react/24/solid';


export default function SidebarItem({ label, to, icon: Icon, children, currentPath }) {
    const hasChildren = Array.isArray(children);
    // If any child route is active, keep parent open
    const isAnyChildActive = hasChildren && children.some(child => {
        if (child.to && location.pathname.startsWith(currentPath + "/" + child.to)) return true;
        if (Array.isArray(child.children)) {
            return child.children.some(grandchild => grandchild.to && location.pathname.startsWith(grandchild.to));
        }
        return false;
    });
    const [open, setOpen] = useState(isAnyChildActive);

    useEffect(() => {
        if (isAnyChildActive && !open) setOpen(true);
    }, [isAnyChildActive]);

    return (
        <li className="mb-2">
            {hasChildren ? (
                <button
                    onClick={() => setOpen(!open)}
                    className="flex justify-between items-center w-full gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5 text-gray-500" />}
                        {label}
                    </span>
                    <ChevronRightIcon className={`w-4 h-4 ml-2 transform transition ${open ? 'rotate-90' : ''}`} />
                </button>
            ) : (
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${isActive
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }
                >
                    {Icon && <Icon className="h-5 w-5 text-gray-500" />}
                    {label}
                </NavLink>
            )}

            {hasChildren && open && (
                <ul className="pl-4 mt-1 space-y-1">
                    {children.map(child => (
                        <SidebarItem key={child.label} {...child} currentPath={currentPath + "/" + child.to}/>
                    ))}
                </ul>
            )}
        </li>
    );
}
