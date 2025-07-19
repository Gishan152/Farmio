import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect, useState } from "react";
import { FormDataToObj } from "../../Utils/FormDataToObj";
import { jwtDecode } from "jwt-decode";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import bg from "../../Assets/bg.jpg"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../../Components/ThemeToggle";
import ImageInput from "../../Components/ImageInput";
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
    console.log("data : ", data)
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
            console.log(decoded);
            localStorage.setItem("token", fetcher.data.token)
            // navigateToRoleRegistration(decoded.roles[0], navigate)
            navigateToRoleDashboard(decoded.roles[0], navigate)
        }
    })

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8 space-y-8 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Create an account
                    </h2>
                    <ThemeToggle />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Already have an account?{' '}
                    <Link to="/login" className="underline text-green-600 hover:text-green-800">Log in</Link>
                </p>
                <fetcher.Form method="post" className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        {getFieldError('username') && (
                            <div className="text-xs text-red-600 mt-1">{getFieldError('username')}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="nic" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">NIC</label>
                        <input
                            id="nic"
                            name="nic"
                            type="text"
                            placeholder="NIC"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        {getFieldError('nic') && (
                            <div className="text-xs text-red-600 mt-1">{getFieldError('nic')}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        {getFieldError('email') && (
                            <div className="text-xs text-red-600 mt-1">{getFieldError('email')}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="phoneNo" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Phone Number</label>
                        <input
                            id="phoneNo"
                            name="phoneNo"
                            type="text"
                            placeholder="Phone number"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        {getFieldError('phoneNo') && (
                            <div className="text-xs text-red-600 mt-1">{getFieldError('phoneNo')}</div>
                        )}
                    </div>
                    {/* <ImageInput
                            label="Profile Picture"
                            className="w-full"
                            maxSizeMB={5}
                            helperText="PNG, JPG or GIF (max. 5MB)"
                            onChange={(file) => console.log("Selected file:", file)}
                        /> */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Password"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-2 top-7 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
                    <div>
                        <label htmlFor="role" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Register as</label>
                        <select
                            id="role"
                            name="role"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option value="ROLE_FARMER">Farmer</option>
                            <option value="ROLE_BUYER">Buyer</option>
                            <option value="ROLE_TRANSPORT">Transport provider</option>
                            <option value="ROLE_WAREHOUSE">Warehouse provider</option>
                            <option value="ROLE_WASTE">Waste Agent</option>
                        </select>
                    </div>
                    {/* Show error from API response */}
                    {fetcher.data?.error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
                            <span>{fetcher.data.error}</span>
                        </div>
                    )}
                    {/* Show network/unexpected error */}
                    {fetcher.error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
                            <span>{String(fetcher.error)}</span>
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold shadow transition bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2 ${busy ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={busy}
                    >
                        {busy && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        )}
                        {busy ? "Registering..." : "Register"}
                    </button>
                </fetcher.Form>
            </div>
        </div>
    );
}

export default Registration;
