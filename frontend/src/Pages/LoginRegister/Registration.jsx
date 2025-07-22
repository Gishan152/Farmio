import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";
import { FormDataToObj } from "../../Utils/FormDataToObj";
import { jwtDecode } from "jwt-decode";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";
import ImageInput from "../../Components/ImageInput";
import { ArrowLeft, User, Mail, Phone, CreditCard, Lock, UserPlus, Sparkles } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
                <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
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
                        <div className="lg:w-1/2 p-8 lg:p-12 space-y-8 overflow-y-auto max-h-[700px]">
                            {/* Header */}
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    Create an account
                                </h2>
                                <p className="text-gray-600">
                                    Join the agricultural revolution today
                                </p>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login" 
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>

                            {/* Registration Form */}
                            <fetcher.Form method="post" className="space-y-6">
                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="username"
                                            type="text"
                                            placeholder="Enter your username"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* NIC Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
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
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
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
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Profile Picture
                                    </label>
                                    <ImageInput
                                        label=""
                                        className="w-full"
                                        maxSizeMB={5}
                                        helperText="PNG, JPG or GIF (max. 5MB)"
                                        onChange={(file) => console.log("Selected file:", file)}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Register as
                                    </label>
                                    <select
                                        name="role"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
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
                                <p className="text-xs text-gray-500">
                                    By creating an account, you agree to our
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

export default Registration;