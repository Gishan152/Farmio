import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";
import { FormDataToObj } from "../../Utils/FormDataToObj";
import { jwtDecode } from "jwt-decode";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import bg from "../../Assets/bg.jpg"
import ThemeToggle from "../../Components/ThemeToggle";
import ImageInput from "../../Components/ImageInput";

export const RegistrationAction = async ({ request }) => {
    let formData = await request.formData();
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

    useEffect(() => {
        if (fetcher.data && fetcher.data.token) {
            const decoded = jwtDecode(fetcher.data.token);
            console.log(decoded);
            localStorage.setItem("token", fetcher.data.token)
            navigateToRoleRegistration(decoded.roles[0], navigate)
        }
    })

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div className="flex w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div
                    className="relative hidden md:flex md:w-1/2 bg-cover bg-center"
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
                            Create an account
                        </h2>
                        <ThemeToggle />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="underline text-blue-400">Log in</Link>
                    </p>

                    <fetcher.Form method="post" className="space-y-4">
                        {["username", "nic", "email", "phoneNo"].map((name, idx) => (
                            <input
                                key={idx}
                                name={name}
                                type={name === "email" ? "email" : "text"}
                                placeholder={name === "phoneNo" ? "Phone number" : name.charAt(0).toUpperCase() + name.slice(1)}
                                className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        ))}

                        {/* <input
                            type="file"
                            name="profile-pic"
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        /> */}

                        <ImageInput
                            label="Profile Picture"
                            className="w-full"
                            maxSizeMB={5}
                            helperText="PNG, JPG or GIF (max. 5MB)"
                            onChange={(file) => console.log("Selected file:", file)}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />

                        <select
                            name="role"
                            className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <option value="ROLE_FARMER">Farmer</option>
                            <option value="ROLE_BUYER">Buyer</option>
                            <option value="ROLE_TRANSPORT">Transport provider</option>
                            <option value="ROLE_WAREHOUSE">Warehouse provider</option>
                            <option value="ROLE_WASTE">Waste Agent</option>
                        </select>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
                        >
                            {busy ? "Saving..." : "Save"}
                        </button>

                        {fetcher.data?.error && (
                            <p className="text-red-500">{fetcher.data.error}</p>
                        )}
                    </fetcher.Form>

                    {fetcher.error && (
                        <div className="mt-4 text-red-500">{fetcher.error}</div>
                    )}
                </div>
            </div>
        </div>
    );

    // return ( 
    //     <div>
    //         <button onClick={()=>navigate("/")}>Back to website</button>
    //         <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
    //         <fetcher.Form method="post">
    //             <input type="text" name="username" placeholder="Username"/>
    //             <input type="text" name="nic" placeholder="NIC"/>
    //             <input type="email" name="email" placeholder="Email"/>
    //             <input type="phone" name="phoneNo" placeholder="Phone number"/>
    //             <input type="file" name="profile-pic" placeholder="Profile picture"/>
    //             <input type="password" name="password" placeholder="Password"/>
    //             <select name="role" placeholder="Register as">
    //                 <option value="ROLE_FARMER">Farmer</option>
    //                 <option value="ROLE_BUYER">Buyer</option>
    //                 <option value="ROLE_TRANSPORT">Transport provider</option>
    //                 <option value="ROLE_WAREHOUSE">Warehouse provider</option>
    //                 <option value="ROLE_WASTE">Waste Agent</option>
    //             </select>
    //             <button type="submit">
    //                 {busy ? "Saving..." : "Save"}
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

export default Registration;