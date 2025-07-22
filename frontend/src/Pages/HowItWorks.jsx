import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    Users, 
    Truck, 
    Warehouse, 
    Recycle, 
    Wheat, 
    Store, 
    Shield,
    CheckCircle,
    UserPlus,
    Search,
    ShoppingCart,
    CreditCard,
    Star,
    ArrowDown,
    MessageCircle
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section - Updated to match About Us */}
            <div className="relative px-6 lg:px-8 pt-24 pb-16 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-semibold text-emerald-700">How Farmio Works</span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                        How 
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Farmio </span>
                        Works
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                        Discover our seamless 6-step process connecting farmers, buyers, and service providers in Sri Lanka's digital agricultural ecosystem
                    </p>
                </div>
            </div>

            {/* System Flow Diagram */}
            <div className="py-20 bg-white">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            System Flow
                        </h2>
                        <p className="text-lg text-gray-600">
                            How all stakeholders interact in the Farmio ecosystem
                        </p>
                    </div>

                    {/* Flow Steps */}
                    <div className="space-y-16">
                        {/* Step 1: Registration */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                1
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <UserPlus className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">User Registration & Verification</h3>
                                    <p className="text-gray-600">All users register and get verified on the platform</p>
                                </div>
                                
                                <div className="grid md:grid-cols-5 gap-6">
                                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                        <Wheat className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Farmers</div>
                                    </div>
                                    <div className LucideIcon="text-center p-4 bg-blue-50 rounded-xl">
                                        <Store className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Buyers</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Transport</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <Warehouse className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Warehouses</div>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-xl">
                                        <Recycle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Waste Agents</div>
                                    </div>
                                </div>
                            </div>
                            <ArrowDown className="w-8 h-8 text-gray-400 mt-8" />
                        </div>

                        {/* Step 2: Listing/Searching */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                2
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <Search className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">List Products & Search Services</h3>
                                    <p className="text-gray-600">Farmers list crops, others search for products/services</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-emerald-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Farmers List:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />Crop details & quantities</li>
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />Pricing & availability</li>
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />Location & harvest dates</li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Others Search:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-600 mr-2" />Browse products by category</li>
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-600 mr-2" />Filter by location & price</li>
                                            <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-600 mr-2" />Find transport & storage</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <ArrowDown className="w-8 h-8 text-gray-400 mt-8" />
                        </div>

                        {/* Step 3: Ordering */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                3
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <ShoppingCart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Place Orders & Connect</h3>
                                    <p className="text-gray-600">Buyers place orders and get matched with transport/storage</p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl max-w-2xl">
                                        <div className="text-center">
                                            <MessageCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                                            <h4 className="font-bold text-gray-900 mb-4">Automatic Matching System</h4>
                                            <p className="text-gray-700">Platform automatically suggests transport providers and warehouse options based on location and requirements</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ArrowDown className="w-8 h-8 text-gray-400 mt-8" />
                        </div>

                        {/* Step 4: Payment */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                4
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Escrow Payment</h3>
                                    <p className="text-gray-600">PayHere integrated secure payment system</p>
                                </div>
                                
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Payment Made</div>
                                        <div className="text-xs text-gray-600">Buyer pays via PayHere</div>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                        <Shield className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Held in Escrow</div>
                                        <div className="text-xs text-gray-600">Money held securely</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-sm font-semibold text-gray-800">Released on Delivery</div>
                                        <div className="text-xs text-gray-600">Payment to farmer</div>
                                    </div>
                                </div>
                            </div>
                            <ArrowDown className="w-8 h-8 text-gray-400 mt-8" />
                        </div>

                        {/* Step 5: Transport & Storage */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                5
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <Truck className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Transport & Storage Coordination</h3>
                                    <p className="text-gray-600">Real-time tracking and coordination of deliveries</p>
                                </div>
                                
                                <div className="flex justify-center mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                                <Wheat className="w-6 h-6 text-emerald- rethink-600" />
                                            </div>
                                            <div className="text-sm text-gray-700">Farm</div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-gray-400" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                                <Warehouse className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div className="text-sm text-gray-700">Storage</div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-gray-400" />
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                                <Store className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="text-sm text-gray-700">Buyer</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ArrowDown className="w-8 h-8 text-gray-400 mt-8" />
                        </div>

                        {/* Step 6: Rating & Waste Management */}
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                                6
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl border border-gray-100">
                                <div className="text-center mb-8">
                                    <Star className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate & Manage Waste</h3>
                                    <p className="text-gray-600">Complete the cycle with feedback and waste management</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-yellow-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Rating System:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" />Rate farmers & buyers</li>
                                            <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" />Review transport service</li>
                                            <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" />Build trust & reputation</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-xl">
                                        <h4 className="font-bold text-gray-900 mb-4">Waste Management:</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center"><Recycle className="w-4 h-4 text-green-600 mr-2" />List agricultural waste</li>
                                            <li className="flex items-center"><Recycle className="w-4 h-4 text-green-600 mr-2" />Connect with waste agents</li>
                                            <li className="flex items-center"><Recycle className="w-4 h-4 text-green-600 mr-2" />Convert to compost/feed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="relative py-24 bg-gradient-to-br from-emerald-800 to-green-900">
                <div className="absolute inset-0 opacity-20">
                    <img 
                        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Agricultural field background"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join the digital agricultural revolution in Sri Lanka and be part of transforming agriculture through technology.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link 
                            to="/register" 
                            className="px-10 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Register Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link 
                            to="/" 
                            className="px-10 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 font-bold text-lg flex items-center justify-center"
                        >
                            Back to Home
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HowItWorks;