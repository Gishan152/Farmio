import { Link } from "react-router-dom";
import { 
    Wheat, 
    Mail, 
    Phone, 
    MapPin, 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin,
    ArrowRight,
    Leaf,
    Shield,
    Users,
    TrendingUp
} from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                                <Wheat className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">Farmio</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Connecting Sri Lankan agriculture through digital innovation. 
                            Building sustainable supply chains from farm to table.
                        </p>
                        
                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <a 
                                href="#" 
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors duration-200"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link 
                                    to="/" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/how-it-works" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/about" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/register" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    Get Started
                                </Link>
                            </li>
                            {/* <li>
                                <Link 
                                    to="/contact" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    Contact
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Services</h3>
                        <ul className="space-y-4">
                            <li className="text-gray-400 flex items-center">
                                <Leaf className="w-4 h-4 mr-3 text-emerald-500" />
                                Crop Trading
                            </li>
                            <li className="text-gray-400 flex items-center">
                                <Shield className="w-4 h-4 mr-3 text-emerald-500" />
                                Secure Payments
                            </li>
                            <li className="text-gray-400 flex items-center">
                                <Users className="w-4 h-4 mr-3 text-emerald-500" />
                                Transport Network
                            </li>
                            <li className="text-gray-400 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-3 text-emerald-500" />
                                Warehouse Solutions
                            </li>
                            <li className="text-gray-400 flex items-center">
                                <Leaf className="w-4 h-4 mr-3 text-emerald-500" />
                                Waste Management
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                                <div className="text-gray-400">
                                    <p>University of Colombo</p>
                                    <p>School of Computing</p>
                                    <p>Colombo 07, Sri Lanka</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 text-emerald-500 mr-3" />
                                <a 
                                    href="tel:+94112345678" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                                >
                                    +94 11 234 5678
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 text-emerald-500 mr-3" />
                                <a 
                                    href="mailto:info@farmio.lk" 
                                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                                >
                                    info@farmio.lk
                                </a>
                            </div>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="mt-8">
                            <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-emerald-500 text-white placeholder-gray-400"
                                />
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 transition-colors duration-200">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            &copy; {currentYear} Farmio. All rights reserved.
                        </div>
                        
                        <div className="flex flex-wrap items-center space-x-6 text-sm">
                            <Link 
                                to="/privacy-policy" 
                                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/terms-of-service" 
                                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                            <Link 
                                to="/cookie-policy" 
                                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                            >
                                Cookie Policy
                            </Link>
                        </div>

                        <div className="text-gray-400 text-sm">
                            Made with ❤️ in Sri Lanka
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;