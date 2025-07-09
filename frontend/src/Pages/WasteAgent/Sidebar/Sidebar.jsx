import {
	ArrowRightStartOnRectangleIcon,
	Cog8ToothIcon,
	UserIcon,
} from "@heroicons/react/24/solid";
import SidebarItem from "./SidebarItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const menu = [
	{ label: "Listing", to: "listings" },
	{ label: "Requests", to: "requests" },
	{ label: "manage Payments", to: "manage-payments" },
	{ label: "Profile", to: "profile" },
	{ label: "chat", to: "chat" },
];

export default function Sidebar() {
	const navigate = useNavigate();

	const handleProfileClick = () => {
		navigate("/waste-agent/profile");
	};

	return (
		<aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between min-h-screen">
			<div>
				<div className="flex items-center mb-8">
					<div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold text-xl mr-3">
						F
					</div>
					<span className="font-bold text-lg text-gray-900 dark:text-gray-100">
						Farmio
					</span>
				</div>
				<div className="flex items-center gap-3 mb-8">
					<Avatar>
						<AvatarImage
							src="https://avatar.iran.liara.run/public"
							alt="Naleeka Kumarasinghe"
						/>
						<AvatarFallback>NK</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-semibold text-gray-900 dark:text-gray-100">
							Naleeka
							<span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs px-2 py-0.5 rounded ml-1">
								Agent
							</span>
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							naleeka843@gmail.com
						</div>
					</div>
				</div>
				<nav className="flex flex-col gap-2">
					<ul className="capitalize">
						{menu.map((item) => (
							<SidebarItem key={item.label} {...item}/>
						))}
					</ul>
				</nav>
			</div>
			<div>
				<div className="flex flex-col gap-2">
					<button
						className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-green-500 transition text-sm"
						aria-label="Settings"
					>
						<Cog8ToothIcon className="h-7 w-8 flex-shrink-0" />
						<span>Settings</span>
					</button>

					<button
						className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-green-500 transition text-sm"
						aria-label="User Profile"
						onClick={handleProfileClick}
					>
						<UserIcon className="h-7 w-8 flex-shrink-0" />
						<span>Profile</span>
					</button>

					<button
						className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-red-500 transition text-sm"
						aria-label="Logout"
					>
						<ArrowRightStartOnRectangleIcon className="h-7 w-8 flex-shrink-0" />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</aside>
	);
}
