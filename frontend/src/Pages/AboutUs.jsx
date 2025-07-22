import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    Users, 
    Target, 
    Globe, 
    Leaf, 
    Shield,
    Heart,
    CheckCircle,
    Wheat,
    TrendingUp,
    Award,
    Eye
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <div className="relative px-6 lg:px-8 pt-24 pb-16 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
                        <Heart className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-semibold text-emerald-700">About Farmio</span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                        Transforming Sri Lankan 
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Agriculture</span>
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                        We're building a comprehensive digital ecosystem that connects farmers, buyers, and logistics providers to create a more sustainable and profitable agricultural future for Sri Lanka.
                    </p>

                    
                </div>
            </div>

            {/* Overview Cards Section */}
            <div className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Understanding 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Farmio</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get to know our platform, mission, and how we're making a difference in Sri Lankan agriculture
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-200 transition-colors">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Who We Are</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                A digital platform connecting farmers, buyers, transport providers, and storage facilities across Sri Lanka
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">What We Do</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Enable direct crop trading, secure payments, efficient logistics, and waste management solutions
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                                <Heart className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">How to Help</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Join as a buyer, support fair trade, use our platform for agricultural transactions
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-200 transition-colors">
                                <Globe className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Where We Work</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Operating across all provinces of Sri Lanka, focusing on rural farming communities
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Mission & Vision */}
            <div className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Mission */}
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
                                <Target className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-sm font-semibold text-green-700">Our Mission</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Our 
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Mission</span>
                            </h2>
                            <div className="mb-8">
                                <img 
                                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    alt="Farmer working in field"
                                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                                />
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                To revolutionize Sri Lankan agriculture by creating a comprehensive digital marketplace that connects all stakeholders in the supply chain, ensuring fair prices for farmers, quality products for buyers, and efficient logistics solutions.
                            </p>
                        </div>

                        {/* Vision */}
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
                                <Target className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-sm font-semibold text-green-700">Our Vision</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Our 
                                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Vision</span>
                            </h2>
                            <div className="mb-8">
                                <img 
                                    src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    alt="Modern agriculture with technology"
                                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                                />
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                To become the leading agricultural technology platform in Sri Lanka, where every farmer has access to fair markets, every buyer finds quality produce, and agricultural waste is minimized through innovative circular economy solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Values Section */}
            <div className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
                            <Award className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Our Values</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Core 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Values</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The principles that drive our agricultural platform
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainability</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Promoting environmentally friendly farming practices and reducing agricultural waste through our circular economy features.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Building strong networks between farmers, buyers, transport providers, and storage facilities across Sri Lanka.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Security</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Ensuring secure transactions through PayHere integration and verified user profiles for all platform participants.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Fair Trade</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Enabling transparent pricing and direct farmer-to-buyer connections that eliminate middlemen and increase farmer profits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Impact Section */}
            <div className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
                            <TrendingUp className="w-4 h-4 text-emerald-600 mr-2" />
                            <span className="text-sm font-semibold text-emerald-700">Our Impact</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Platform 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Statistics</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real numbers showing our impact on Sri Lankan agriculture
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-emerald-50 rounded-xl border border-emerald-200">
                            <div className="text-5xl font-bold text-emerald-600 mb-4">500+</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Registered Farmers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Active farmers using our platform to list and sell their agricultural products
                            </p>
                        </div>
                        
                        <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
                            <div className="text-5xl font-bold text-green-600 mb-4">200+</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Buyers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Registered buyers including retailers, wholesalers, and processing companies
                            </p>
                        </div>
                        
                        <div className="text-center p-8 bg-teal-50 rounded-xl border border-teal-200">
                            <div className="text-5xl font-bold text-teal-600 mb-4">5+</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Districts Covered</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Geographic coverage across major agricultural districts in Sri Lanka
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="relative py-24 bg-gradient-to-br from-emerald-800 to-green-900">
                <div className="absolute inset-0 opacity-20">
                    <img 
                        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Rice field background"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                        Join the Digital Agricultural Revolution
                    </h2>
                    <p className="text-xl text-emerald-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Be part of transforming Sri Lankan agriculture through technology, connecting farmers with buyers, and building a sustainable future.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link 
                            to="/register" 
                            className="px-10 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link 
                            to="/how-it-works" 
                            className="px-10 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 font-bold text-lg flex items-center justify-center"
                        >
                            Learn More
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>



            <Footer />
        </div>
    );
};

export default AboutUs;