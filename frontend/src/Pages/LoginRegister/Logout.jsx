import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../Components/ThemeToggle";

export default function Logout() {
    const navigate = useNavigate();
    const [loggedOut, setLoggedOut] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLoggedOut(true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8 space-y-8 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        {loggedOut ? "Logged Out" : "Logout"}
                    </h2>
                    <ThemeToggle />
                </div>
                {!loggedOut ? (
                    <>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                            Are you sure you want to log out?
                        </p>
                        <button
                            className="w-full py-2 rounded-lg font-semibold shadow transition bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                            You have been successfully logged out.
                        </p>
                        <button
                            className="w-full py-2 rounded-lg font-semibold shadow transition bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
