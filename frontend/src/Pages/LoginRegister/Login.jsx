import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import bg from '../../Assets/bg.jpg';
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
    console.log("data : ", data)

    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    useEffect(() => {
        if (fetcher.data && fetcher.data.token) {
            const decoded = jwtDecode(fetcher.data.token);
            console.log(decoded);
            localStorage.setItem("token", fetcher.data.token)
            // if (decoded.isTemp) {
            //     navigateToRoleRegistration(decoded.roles[0], navigate)
            // } else {
            //     navigateToRoleDashboard(decoded.roles[0], navigate)
            // }
            navigateToRoleDashboard(decoded.roles[0], navigate)
        }
    })

    // const [dark, setDark] = useState(false);
    // useEffect(() => {
    //     document.documentElement.classList.toggle('dark', dark);
    // }, [dark]);


    const [isDark, toggleDark] = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-8 space-y-8 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Welcome back
                    </h2>
                    <ThemeToggle />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    New here?{' '}
                    <Link to="/register" className="underline text-blue-500 hover:text-blue-700">Register</Link>
                </p>

                <fetcher.Form method="post" className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your Email"
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m2.062 2.062A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.234-.938 4.675m-2.062-2.062A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.938-1.938" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /></svg>
                            )}
                        </button>
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
                        className={`w-full py-2 rounded-lg font-semibold shadow transition bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 ${busy ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={busy}
                    >
                        {busy && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        )}
                        {busy ? "Logging in..." : "Login"}
                    </button>
                </fetcher.Form>
            </div>
        </div>
    );

    //  return ( 
    //     <div>
    //         <button onClick={()=>navigate("/")}>Back to website</button>
    //         <button onClick={()=>navigate("/registration")}>New here? Signup</button>
    //         <fetcher.Form method="post">
    //             <input type="text" name="username" />
    //             <input type="password" name="password" />
    //             <button type="submit">
    //                 {busy ? "Logging in..." : "Login"}
    //             </button>
    //             {fetcher.data?.error && (
    //                 <p style={{ color: "red" }}>{fetcher.data.error}</p>
    //             )}
    //         </fetcher.Form>
    //         {fetcher.error && (
    //             <div>
    //                 {fetcher.error}
    //             </div>
    //         )}
    //     </div>
    //  );
}

export default Login;