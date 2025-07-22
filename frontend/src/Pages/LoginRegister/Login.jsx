import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import bg from '../../Assets/bg.jpg';
import { ArrowLeft, User, Lock, LogIn, Sparkles } from "lucide-react";
import useDarkMode from "../../Hooks/userDarkMode";
import ThemeToggle from "../../Components/ThemeToggle";
import { navigateToRoleDashboard } from "../../Utils/navigateToRoleDashboard";

export const loginAction = async ({ request }) => {
    let formData = await request.formData();
    try {
        console.log("form data : ", formData);
        console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
        const res = await api.post("/api/auth/login", {
            email: formData.get("email"),
            password: formData.get("password")
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return res.data;
    } catch (err) {
        // Handle Axios error and return a user-friendly error object
        console.error("Login error:", err);
        let errorMsg = "Login failed. Please check your credentials and try again.";
        if (err.response && err.response.data) {
            errorMsg = err.response.data;
        } else if (err.message) {
            errorMsg = err.message;
        }
        return { error: errorMsg };
    }
}

export const loginLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return { token };
}

const Login = () => {
    const navigate = useNavigate();
    let data = useLoaderData();
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";
    useEffect(() => {
        if (fetcher.data && fetcher.data.token) {
            const decoded = jwtDecode(fetcher.data.token);
            localStorage.setItem("token", fetcher.data.token)
            navigateToRoleDashboard(decoded.roles[0], navigate)
        }
    })
    const [isDark, toggleDark] = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[600px]">
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${bg})` }}
                            />
                            {/* Content on Image */}
                            <div className="relative h-full flex flex-col justify-between p-8">
                                {/* Back Button */}
                                <button
                                    onClick={() => navigate("/")}
                                    className="self-start flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </button>
                            </div>
                        </div>
                        {/* Right Side - Login Form */}
                        <div className="lg:w-1/2 p-8 lg:p-12 space-y-8 flex flex-col">
                            {/* Theme Toggle in top right */}
                            <div className="flex justify-end mb-2">
                                <ThemeToggle />
                            </div>
                            {/* Header */}
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Welcome back
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Sign in to your account to continue
                                </p>
                            </div>
                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    New to Farmio?{' '}
                                    <Link 
                                        to="/register" 
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-300"
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                            {/* Login Form */}
                            <fetcher.Form method="post" className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Enter your email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                            onClick={() => setShowPassword(v => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.338 7.24 19.5 12 19.5c1.658 0 3.237-.335 4.646-.94M21.084 11.982a10.45 10.45 0 00-2.972-3.76M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c2.042 0 3.97.613 5.542 1.667" /><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 8.223A10.477 10.477 0 0121.066 12c-1.292 4.337-5.306 7.5-10.066 7.5a10.45 10.45 0 01-4.646-.94" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Error Message */}
                                {fetcher.data?.error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-600 text-sm font-medium">
                                            {fetcher.data.error}
                                        </p>
                                    </div>
                                )}
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className="group w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {busy ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                            Sign In
                                        </>
                                    )}
                                </button>
                            </fetcher.Form>
                            {/* Additional Info */}
                            <div className="text-center pt-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    By signing in, you agree to our
                                    {' '}<Link to="/terms-and-conditions" className="text-emerald-600 hover:underline">Terms and Conditions</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;