import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function SidebarItem({ label, to, icon: Icon, children }) {
    const [open, setOpen] = useState(false);
    const hasChildren = Array.isArray(children);

    return (
        <li className="mb-1">
            {hasChildren ? (
                <>
                    <button
                        onClick={() => setOpen(!open)}
                        className={`flex items-center justify-between w-full gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${
                            open 
                                ? 'bg-green-50 text-green-600' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                            <span>{label}</span>
                        </div>
                        <ChevronDownIcon 
                            className={`w-4 h-4 transition-transform duration-200 ${
                                open ? 'rotate-180' : ''
                            }`} 
                        />
                    </button>
                    
                    {open && (
                        <ul className="pl-11 mt-1 space-y-1">
                            {children.map(child => (
                                <SidebarItem key={child.label} {...child} />
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-green-50 text-green-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }
                >
                    {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                    <span>{label}</span>
                </NavLink>
            )}
        </li>
    );
}