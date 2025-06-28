import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import bg from '../../Assets/bg.jpg';
import useDarkMode from "../../Hooks/userDarkMode";
import ThemeToggle from "../../Components/ThemeToggle";


export const loginAction = async ({ request }) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/login", {
        username: formData.get("username"),
        password: formData.get("password")
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.data;
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
            if (decoded.isTemp) {
                navigateToRoleRegistration(decoded.roles[0], navigate)
            } else {
                navigate("/user")
            }
        }
    })

    // const [dark, setDark] = useState(false);
    // useEffect(() => {
    //     document.documentElement.classList.toggle('dark', dark);
    // }, [dark]);

    const [isDark, toggleDark] = useDarkMode();

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div className="flex w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div
                    className="relative hidden md:flex md:w-1/2 bg-cover"
                    style={{ backgroundImage: `url(${bg})` }}
                >
                    <div className="flex flex-1 justify-center items-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                        <h1 className="text-white text-2xl">
                            Capturing Moments, Creating Memories
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="absolute right-2 top-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded"
                    >
                        Back to website
                    </button>
                </div>

                <div className="w-full md:w-1/2 p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                            Welcome back
                        </h2>
                        <ThemeToggle />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        New here?{' '}
                        <Link to="/register" className="underline text-blue-400">Register</Link>
                    </p>

                    <fetcher.Form className="space-y-4">
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />

                        {fetcher.data?.error && (
                            <p className="w-full px-3 text-red-500">{fetcher.data.error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
                        >
                            {busy ? "Logging in..." : "Login"}
                        </button>
                    </fetcher.Form>
                </div>
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