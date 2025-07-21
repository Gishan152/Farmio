import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, Truck, Warehouse, Recycle, Wheat, Store, MapPin, HandHeart, Shield, TrendingUp, Clock, Award, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeStakeholder, setActiveStakeholder] = useState(0);

    const stakeholders = [
        {
            title: "Farmers",
            icon: <Wheat className="w-6 h-6" />,
            color: "emerald",
            benefits: ["Direct market access", "Better crop prices", "Reduced waste", "Transport coordination"],
            description: "Empowering farmers with direct market access and fair pricing"
        },
        {
            title: "Buyers",
            icon: <Store className="w-6 h-6" />,
            color: "blue",
            benefits: ["Fresh produce sourcing", "Transparent pricing", "Quality assurance", "Reliable supply"],
            description: "Connecting buyers with fresh, quality produce directly from farms"
        },
        {
            title: "Transport Providers",
            icon: <Truck className="w-6 h-6" />,
            color: "orange",
            benefits: ["More delivery jobs", "Optimized routes", "Regular customers", "Fair pricing"],
            description: "Optimizing transport networks for efficient agricultural logistics"
        },
        {
            title: "Warehouses",
            icon: <Warehouse className="w-6 h-6" />,
            color: "purple",
            benefits: ["Storage bookings", "Capacity optimization", "Service visibility", "Steady income"],
            description: "Maximizing storage efficiency and providing reliable infrastructure"
        },
        {
            title: "Waste Agents",
            icon: <Recycle className="w-6 h-6" />,
            color: "green",
            benefits: ["Waste collection jobs", "Resource recovery", "Environmental impact", "New revenue streams"],
            description: "Creating sustainable waste management solutions for agriculture"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <Navbar />

{/* Hero Section */}
            <div className="relative px-6 lg:px-8 pt-20 pb-32">
                {/* Enhanced Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80')",
                        filter: "brightness(0.5)" 
                    }}
                ></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/50 via-green-800/40 to-teal-900/80"></div>
                
                <div className="relative mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Content */}
                        <div className="text-left">
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-8">
                                Connecting 
                                <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                    Fields to Stores
                                </span>
                                <span className="block text-4xl lg:text-5xl xl:text-6xl">
                                    Seamlessly
                                </span>
                            </h1>
                            <p className="text-xl text-gray-100 mb-10 leading-relaxed max-w-2xl">
                                Join Farmio to connect farmers, buyers, transporters, and services in a sustainable agricultural ecosystem.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link 
                                    to="/register" 
                                    className="group px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg flex items-center justify-center"
                                >
                                    Start Growing
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button 
                                    onClick={() => navigate("/how-it-works")}
                                    className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 font-semibold text-lg"
                                >
                                    How It Works
                                </button>
                            </div>
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center p-3 bg-white/95 rounded-lg border border-emerald-100 shadow-sm">
                                    <div className="text-2xl font-bold text-emerald-600">500+</div>
                                    <div className="text-xs text-gray-600">Farmers</div>
                                </div>
                                <div className="text-center p-3 bg-white/95 rounded-lg border border-emerald-100 shadow-sm">
                                    <div className="text-2xl font-bold text-emerald-600">200+</div>
                                    <div className="text-xs text-gray-600">Buyers</div>
                                </div>
                                <div className="text-center p-3 bg-white/95 rounded-lg border border-emerald-100 shadow-sm">
                                    <div className="text-2xl font-bold text-emerald-600">25%</div>
                                    <div className="text-xs text-gray-600">Profit Boost</div>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Flow Diagram with Waste Agents */}
                        <div className="relative flex items-center justify-center">
                            <div className="relative w-full max-w-xl">
                                <div className="rounded-2xl p-8 border border-emerald-100 shadow-lg backdrop-blur-sm">
                                    {/* Central Farmio Hub */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                                            <span className="text-white text-sm font-semibold">farmio</span>
                                        </div>
                                    </div>

                                    {/* Horizontal Flow Layout with Waste Agents */}
                                    <div className="relative flex justify-between items-center">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                                <Wheat className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-xs font-medium text-white mt-2">Farmers</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-emerald-600 mx-1" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                                <Store className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-xs font-medium text-white mt-2">Buyers</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-emerald-600 mx-1" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                                <Truck className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-xs font-medium text-white mt-2">Transport</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-emerald-600 mx-1" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                                <Warehouse className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-xs font-medium text-white mt-2">Warehouses</div>
                                        </div>                                        
                                        <ArrowRight className="w-5 h-5 text-emerald-600 mx-1" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                                                <Recycle className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div className="text-xs font-medium text-white mt-2">Waste Agents</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - Enhanced */}
            <div className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4 shadow-lg border border-emerald-200">
                            <Shield className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Advanced Features</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why Farmio is the 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Future </span>
                            of Agriculture
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Smart technology for a sustainable agricultural ecosystem
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Transactions</h3>
                                <p className="text-gray-600 text-sm">
                                    Safe payments with blockchain technology and encrypted security.
                                </p>
                            </div>
                        </div>

                        <div className="group text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Market Insights</h3>
                                <p className="text-gray-600 text-sm">
                                    Real-time data analytics for better decision making.
                                </p>
                            </div>
                        </div>

                        <div className="group text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Clock className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
                                <p className="text-gray-600 text-sm">
                                    Always-on support for seamless operations and assistance.
                                </p>
                            </div>
                        </div>

                        <div className="group text-center p-6 bg-white rounded-2xl shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all duration-500 hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Award className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Quality Assurance</h3>
                                <p className="text-gray-600 text-sm">
                                    Verified products with comprehensive quality ratings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Stories Section - Enhanced */}
            <div className="py-16 bg-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-100/30 rounded-full blur-3xl"></div>
                
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4 shadow-lg border border-emerald-200">
                            <Star className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Success Stories</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Stories from Our 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Community </span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Real stories, real impact across Sri Lanka
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group bg-white p-6 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                                        alt="Farmer" 
                                        className="w-12 h-12 rounded-full mr-3 border-2 border-emerald-200 shadow-lg"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">Sunil Rathnayake</h4>
                                        <p className="text-sm text-gray-600">Rice Farmer, Anuradhapura</p>
                                        <div className="flex text-yellow-400 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic mb-3 leading-relaxed text-sm">
                                    "Farmio increased my profits by 40% by connecting me directly with buyers. The platform is a game-changer for farmers like me."
                                </p>
                                <div className="text-emerald-600 font-bold text-base">40% Profit Increase</div>
                            </div>
                        </div>

                        <div className="group bg-white p-6 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                                        alt="Buyer" 
                                        className="w-12 h-12 rounded-full mr-3 border-2 border-emerald-200 shadow-lg"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">Priya Fernando</h4>
                                        <p className="text-sm text-gray-600">Organic Store Owner, Colombo</p>
                                        <div className="flex text-yellow-400 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic mb-3 leading-relaxed text-sm">
                                    "Quality verification ensures fresh produce every time. My customers are happier than ever with the consistent quality."
                                </p>
                                <div className="text-emerald-600 font-bold text-base">100% Quality Assured</div>
                            </div>
                        </div>

                        <div className="group bg-white p-6 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                                        alt="Transport" 
                                        className="w-12 h-12 rounded-full mr-3 border-2 border-emerald-200 shadow-lg"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">Kamal Silva</h4>
                                        <p className="text-sm text-gray-600">Transport Provider, Kandy</p>
                                        <div className="flex text-yellow-400 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic mb-3 leading-relaxed text-sm">
                                    "Optimized routes mean more deliveries and steady income. Farmio has transformed my transport business completely."
                                </p>
                                <div className="text-emerald-600 font-bold text-base">3x More Orders</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value Propositions - Enhanced */}
            <div className="py-16 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4 shadow-lg border border-emerald-200">
                            <HandHeart className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Why Choose Us</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Farmio? </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A platform built for Sri Lanka's agricultural community with cutting-edge technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="group text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all duration-500 shadow-lg hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <HandHeart className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Connections</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Connect farmers directly with buyers and services, eliminating middlemen and maximizing profits for everyone.
                                </p>
                            </div>
                        </div>

                        <div className="group text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all duration-500 shadow-lg hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <MapPin className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Local Focus</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Specifically tailored for Sri Lankan agriculture with local language support and regional expertise.
                                </p>
                            </div>
                        </div>

                        <div className="group text-center p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all duration-500 shadow-lg hover:shadow-2xl hover:transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Ecosystem</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    All agricultural services in one comprehensive platform - from farming to final delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Stakeholder Benefits - Enhanced */}
            <div className="py-16 bg-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-100/20 rounded-full blur-3xl"></div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4 shadow-lg border border-emerald-200">
                            <Users className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Stakeholder Benefits</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Benefits for Every 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Stakeholder </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Discover how Farmio creates value for all members of our agricultural community
                        </p>
                    </div>

                    {/* Enhanced Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {stakeholders.map((stakeholder, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveStakeholder(index)}
                                className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                                    activeStakeholder === index
                                        ? 'bg-emerald-600 text-white shadow-xl scale-105 border-2 border-emerald-600'
                                        : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 shadow-lg border-2 border-gray-100 hover:border-emerald-200'
                                }`}
                            >
                                <span className="mr-2 text-base">{stakeholder.icon}</span>
                                <span className="text-sm">{stakeholder.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Enhanced Active Stakeholder Content */}
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 shadow-2xl border border-emerald-100 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/svg%3E")`
                                }}></div>
                            </div>

                            <div className="relative">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg border-2 border-white">
                                        <span className="text-emerald-600 text-xl">{stakeholders[activeStakeholder].icon}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        For {stakeholders[activeStakeholder].title}
                                    </h3>
                                    <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                        {stakeholders[activeStakeholder].description}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {stakeholders[activeStakeholder].benefits.map((benefit, i) => (
                                        <div key={i} className="group flex items-center p-4 bg-white rounded-xl shadow-md border border-emerald-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:transform hover:-translate-y-1">
                                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></div>
                                            <span className="text-gray-700 font-medium text-base">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Call to Action - Enhanced */}
            <div className="relative py-16 bg-gradient-to-br from-emerald-800 to-green-900 overflow-hidden">
                {/* Enhanced Background */}
                <div className="absolute inset-0 opacity-30">
                    <img 
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
                        alt="Rice field background"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl animate-bounce delay-1000"></div>
                
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative">
                    <div className="mb-6">
                        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
                            <Sparkles className="w-4 h-4 text-emerald-300 mr-2" />
                            <span className="text-sm font-semibold text-emerald-200">Join the Revolution</span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                            Transform Sri Lankan 
                            <span className="block bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                                Agriculture
                            </span>
                        </h2>
                        <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
                            Join farmers, buyers, and service providers on Farmio and be part of the agricultural revolution.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/register" 
                            className="group px-8 py-3 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-base shadow-2xl flex items-center justify-center hover:transform hover:scale-105 hover:shadow-white/20"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Join as Farmer
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/register" 
                            className="group px-8 py-3 border-2 border-white/80 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 hover:border-white transition-all duration-300 font-bold text-base shadow-xl flex items-center justify-center hover:transform hover:scale-105"
                        >
                            <Store className="w-5 h-5 mr-2" />
                            Join as Buyer
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>      
    );
};

export default LandingPage;