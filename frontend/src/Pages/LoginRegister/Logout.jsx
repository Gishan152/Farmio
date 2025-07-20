import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../Components/ThemeToggle";
import bg from '../../Assets/bg.jpg';

export default function Logout() {
    const navigate = useNavigate();
    const [loggedOut, setLoggedOut] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLoggedOut(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-200/30 rounded-full blur-3xl animate-bounce delay-1000"></div>
            <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-6xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100 dark:border-gray-800 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Background Image */}
                        <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[400px]">
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${bg})` }}
                            />
                        </div>
                        {/* Right Side - Logout Card */}
                        <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 min-h-[400px]">
                            {/* Theme Toggle in top right */}
                            <div className="w-full flex justify-end mb-4">
                                <ThemeToggle />
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                {loggedOut ? "Logged Out" : "Logout"}
                            </h2>
                            {!loggedOut ? (
                                <>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-lg">
                                        Are you sure you want to log out?
                                    </p>
                                    <button
                                        className="group w-full max-w-xs py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-[1.02]"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-center text-lg">
                                        You have been successfully logged out.
                                    </p>
                                    <button
                                        className="group w-full max-w-xs py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-[1.02]"
                                        onClick={() => navigate("/login")}
                                    >
                                        Go to Login
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
