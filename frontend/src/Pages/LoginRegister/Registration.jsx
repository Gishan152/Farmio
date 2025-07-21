import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect, useState } from "react";
import { FormDataToObj } from "../../Utils/FormDataToObj";
import { jwtDecode } from "jwt-decode";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import { ArrowLeft, User, Mail, Phone, CreditCard, Lock, UserPlus, Sparkles } from "lucide-react";
import ThemeToggle from "../../Components/ThemeToggle";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { navigateToRoleDashboard } from "@/Utils/navigateToRoleDashboard";

export const RegistrationAction = async ({ request }) => {
    let formData = await request.formData();
    try {
        console.log("form data : ", formData);
        console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
        const res = await api.post("/api/auth/register",
            FormDataToObj(formData)
            , {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        return res.data;
    } catch (err) {
        // Handle Axios error and return a user-friendly error object
        console.error("Registration error:", err);
        let errorMsg = "Registration failed. Please check your details and try again.";
        let fieldErrors = {};
        if (err.response && err.response.data) {
            const data = err.response.data;
            // If backend sends errors as { errors: ["field: message", ...] }
            if (Array.isArray(data.errors)) {
                data.errors.forEach(e => {
                    // Try to split 'field: message'
                    const idx = e.indexOf(": ");
                    if (idx > 0) {
                        const field = e.slice(0, idx);
                        const msg = e.slice(idx + 2);
                        if (!fieldErrors[field]) fieldErrors[field] = [];
                        fieldErrors[field].push(msg);
                    } else {
                        // Not a field error, treat as global
                        errorMsg = e;
                    }
                });
            } else if (typeof data === 'string') {
                errorMsg = data;
            } else if (data.error) {
                errorMsg = data.error;
            }
        } else if (err.message) {
            errorMsg = err.message;
        }
        return { error: errorMsg, fieldErrors };
    }
}

export const RegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return { token };
}

const Registration = () => {
    const navigate = useNavigate();
    let data = useLoaderData();
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";
    const [showPassword, setShowPassword] = useState(false);
    // Helper to get field error(s)
    const getFieldError = (field) => {
        if (fetcher.data && fetcher.data.fieldErrors && fetcher.data.fieldErrors[field]) {
            return fetcher.data.fieldErrors[field].join(". ");
        }
        return null;
    };
    useEffect(() => {
        if (fetcher.data && fetcher.data.token) {
            const decoded = jwtDecode(fetcher.data.token);
            localStorage.setItem("token", fetcher.data.token)
            navigateToRoleDashboard(decoded.roles[0], navigate)
        }
    })
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>
            <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-6xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100 dark:border-gray-800 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Background Image */}
                        <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-[700px]">
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                style={{ 
                                    backgroundImage: `url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")` 
                                }}
                            />
                            {/* Content on Image */}
                            <div className="relative h-full flex flex-col justify-start p-8">
                                {/* Back Button */}
                                <button
                                    onClick={() => navigate("/")}
                                    className="self-start flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-emerald-700 rounded-xl hover:bg-white transition-all duration-300 border border-emerald-200 shadow-lg"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </button>
                            </div>
                        </div>
                        {/* Right Side - Registration Form */}
                        <div className="lg:w-1/2 p-8 lg:p-12 space-y-8 overflow-y-auto max-h-[700px] flex flex-col">
                            {/* Theme Toggle in top right */}
                            <div className="flex justify-end mb-2">
                                <ThemeToggle />
                            </div>
                            {/* Header */}
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Create an account
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Join the agricultural revolution today
                                </p>
                            </div>
                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login" 
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-300"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                            {/* Registration Form */}
                            <fetcher.Form method="post" className="space-y-6">
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            placeholder="Enter your username"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                        {getFieldError('username') && (
                                            <div className="text-xs text-red-600 mt-1">{getFieldError('username')}</div>
                                        )}
                                    </div>
                                </div>
                                {/* NIC Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        NIC
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <CreditCard className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="nic"
                                            type="text"
                                            placeholder="Enter your NIC number"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                        {getFieldError('nic') && (
                                            <div className="text-xs text-red-600 mt-1">{getFieldError('nic')}</div>
                                        )}
                                    </div>
                                </div>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="Enter your email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                        {getFieldError('email') && (
                                            <div className="text-xs text-red-600 mt-1">{getFieldError('email')}</div>
                                        )}
                                    </div>
                                </div>
                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="phoneNo"
                                            type="text"
                                            placeholder="Enter your phone number"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                        {getFieldError('phoneNo') && (
                                            <div className="text-xs text-red-600 mt-1">{getFieldError('phoneNo')}</div>
                                        )}
                                    </div>
                                </div>
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
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
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                        {getFieldError('password') && (
                                            <div className="text-xs text-red-600 mt-1">{getFieldError('password')}</div>
                                        )}
                                    </div>
                                </div>
                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Register as
                                    </label>
                                    <select
                                        name="role"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option value="ROLE_FARMER">Farmer</option>
                                        <option value="ROLE_BUYER">Buyer</option>
                                        <option value="ROLE_TRANSPORT">Transport Provider</option>
                                        <option value="ROLE_WAREHOUSE">Warehouse Provider</option>
                                        <option value="ROLE_WASTE">Waste Agent</option>
                                    </select>
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
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                            Create Account
                                        </>
                                    )}
                                </button>
                                {/* Fetcher Error */}
                                {fetcher.error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-red-600 text-sm font-medium">
                                            {fetcher.error}
                                        </p>
                                    </div>
                                )}
                            </fetcher.Form>
                            {/* Additional Info */}
                            <div className="text-center pt-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    By creating an account, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;
