import { Link, useNavigate } from "react-router-dom";
import bg from '../Assets/bg.jpg'; // Update path to your background image
import ThemeToggle from "../Components/ThemeToggle";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full min-h-screen bg-gray-900 text-black dark:text-white overflow-hidden">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center dark:mix-blend-overlay"
                style={{ backgroundImage: `url(${bg})` }}
            />

            {/* Overlay for darkening */}
            <div className="absolute inset-0 bg-white dark:bg-black opacity-70 dark:opacity-20" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-5xl mx-auto px-6 lg:px-12">
                {/* Navbar */}
                <nav className="w-full flex items-center justify-between py-6">
                    <div className="text-xl font-bold">farmio.</div>
                    <div className="space-x-4">
                        <button className="hover:underline">Products</button>
                        <button className="hover:underline">Company</button>
                        <button className="hover:underline">Pricing</button>
                        <button className="hover:underline">For Accountants</button>
                    </div>
                    <div className="space-x-4">
                        <ThemeToggle />
                        <Link to="/login" className="hover:underline">Log in</Link>
                        <Link to="/register" className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">
                            Get started
                        </Link>
                    </div>
                </nav>

                {/* Hero text + actions */}
                <div className="mt-20 max-w-xl space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        Connecting fields to stores, Seamlessly
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-300">
                        Run payments, extend net terms and automate collections compliance.
                    </p>
                    <div className="flex space-x-4">
                        <Link to="/register" className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-500 transition">
                            Get started
                        </Link>
                        {/* <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition">
                            Talk to a human
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );

    // return ( 
    //     <div>
    //         <button onClick={()=>navigate("/login")}>Login</button>
    //         <button onClick={()=>navigate("/register")}>Register</button>
    //     </div>
    //  );
}

export default LandingPage;