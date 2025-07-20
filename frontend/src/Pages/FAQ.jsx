import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Users,
    Shield,
    CreditCard,
    Truck,
    MessageCircle,
    Search
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const FAQ = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const faqCategories = [
        {
            title: "Getting Started",
            icon: Users,
            color: "emerald",
            faqs: [
                {
                    question: "How do I register on Farmio?",
                    answer: "To register on Farmio, visit our registration page and select your user type (Farmer, Buyer, Transport Provider, Warehouse, or Waste Agent). Fill in your details, upload required documents for verification, and submit your application. Our team will review and approve your account within 24-48 hours."
                },
                {
                    question: "What documents do I need for verification?",
                    answer: "For farmers: National ID, land ownership documents or lease agreements. For buyers: Business registration certificate, National ID. For transport providers: Vehicle registration, driver's license, insurance documents. For warehouses: Business license, facility documents. For waste agents: Environmental permits, business registration."
                },
                {
                    question: "Is Farmio free to use?",
                    answer: "Basic registration and browsing are free. We charge a small commission (2-5%) only on successful transactions. There are no monthly fees or hidden charges. Our goal is to make agricultural trading accessible to everyone."
                },
                {
                    question: "Which areas in Sri Lanka does Farmio cover?",
                    answer: "Farmio currently operates across all provinces of Sri Lanka, with strong coverage in major agricultural districts including Anuradhapura, Polonnaruwa, Kurunegala, Matale, and Kandy. We're continuously expanding to rural farming communities."
                }
            ]
        },
        {
            title: "For Farmers",
            icon: Users,
            color: "green",
            faqs: [
                {
                    question: "How do I list my crops for sale?",
                    answer: "After verification, go to your dashboard and click 'List Product'. Enter crop details including type, quantity, quality grade, harvest date, location, and expected price. Add clear photos and descriptions. Your listing will be visible to verified buyers immediately."
                },
                {
                    question: "How is pricing determined?",
                    answer: "You set your own prices based on market rates, quality, and demand. Our platform provides market price insights and trends to help you make informed decisions. You can also accept negotiable pricing for bulk orders."
                },
                {
                    question: "When do I receive payment?",
                    answer: "Payments are held in secure escrow and released to you once the buyer confirms delivery and quality. This typically happens within 24-48 hours after delivery. Funds are transferred directly to your bank account via PayHere."
                },
                {
                    question: "What if my crops are damaged during transport?",
                    answer: "All shipments can be insured. If damage occurs due to transport provider negligence, insurance will cover losses. We recommend photographing crops before handover and requiring transport providers to inspect and acknowledge condition."
                }
            ]
        },
        {
            title: "For Buyers",
            icon: Shield,
            color: "blue",
            faqs: [
                {
                    question: "How do I find specific crops?",
                    answer: "Use our advanced search filters to find crops by type, location, quantity, price range, harvest date, and quality grade. You can also set up alerts for specific products to be notified when they become available."
                },
                {
                    question: "Can I inspect crops before purchasing?",
                    answer: "Yes, you can request quality samples or arrange farm visits for large orders. We encourage direct communication between buyers and farmers to ensure product quality meets your requirements."
                },
                {
                    question: "What payment methods are accepted?",
                    answer: "We accept all major payment methods through PayHere including credit/debit cards, online banking, and mobile payments. All transactions are secure and processed through encrypted channels."
                },
                {
                    question: "How do I track my orders?",
                    answer: "Once your order is dispatched, you'll receive tracking information. You can monitor delivery status in real-time through your dashboard and receive SMS/email updates at key milestones."
                }
            ]
        },
        {
            title: "Payments & Security",
            icon: CreditCard,
            color: "purple",
            faqs: [
                {
                    question: "How secure are my payments?",
                    answer: "All payments are processed through PayHere, Sri Lanka's leading payment gateway with bank-level security. We use SSL encryption and escrow services to protect both buyers and sellers. Your financial information is never stored on our servers."
                },
                {
                    question: "What is escrow and how does it work?",
                    answer: "Escrow is a secure payment method where buyer's money is held by a trusted third party (us) until delivery is confirmed. This protects both parties - sellers are guaranteed payment, and buyers are assured of delivery before money is released."
                },
                {
                    question: "Can I get a refund if I'm not satisfied?",
                    answer: "Yes, if the delivered products don't match the description or quality standards agreed upon, you can raise a dispute within 24 hours of delivery. Our team will mediate and arrange refunds or replacements as appropriate."
                },
                {
                    question: "Are there any hidden fees?",
                    answer: "No hidden fees. Our commission structure is transparent: 3% for farmers, 2% for buyers on successful transactions. Payment processing fees (1-2%) are clearly displayed before checkout. No monthly or annual charges."
                }
            ]
        },
        {
            title: "Transport & Logistics",
            icon: Truck,
            color: "orange",
            faqs: [
                {
                    question: "How does transport matching work?",
                    answer: "Our system automatically suggests transport providers based on pickup/delivery locations, cargo type, vehicle requirements, and availability. You can view ratings, pricing, and book directly through the platform."
                },
                {
                    question: "What if transport is delayed?",
                    answer: "Transport providers are required to provide estimated delivery times. If delays occur, they must notify all parties immediately. Chronic delays affect provider ratings and may result in suspension from the platform."
                },
                {
                    question: "Can I use my own transport?",
                    answer: "Yes, you can arrange your own transport. However, using platform-verified transport providers offers additional insurance coverage and tracking capabilities."
                },
                {
                    question: "Are goods insured during transport?",
                    answer: "Basic insurance is included for all shipments. Additional coverage can be purchased for high-value orders. Insurance covers damage, loss, or spoilage due to transport provider negligence."
                }
            ]
        },
        {
            title: "Technical Support",
            icon: MessageCircle,
            color: "red",
            faqs: [
                {
                    question: "I'm having trouble logging in. What should I do?",
                    answer: "First, check if you're using the correct email and password. Try the 'Forgot Password' option to reset your password. If issues persist, contact our support team at support@farmio.lk or call +94 11 234 5678."
                },
                {
                    question: "How do I update my profile information?",
                    answer: "Go to your dashboard and click 'Profile Settings'. You can update contact information, bank details, and business information. Some changes may require re-verification."
                },
                {
                    question: "Can I use Farmio on my mobile phone?",
                    answer: "Yes, our platform is fully mobile-responsive and works on all smartphones and tablets. We're also developing dedicated mobile apps for Android and iOS, launching soon."
                },
                {
                    question: "What browsers are supported?",
                    answer: "Farmio works best on modern browsers including Chrome, Firefox, Safari, and Edge. For optimal experience, ensure your browser is updated to the latest version."
                }
            ]
        }
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            emerald: "bg-emerald-100 text-emerald-600",
            green: "bg-green-100 text-green-600",
            blue: "bg-blue-100 text-blue-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
            red: "bg-red-100 text-red-600"
        };
        return colorMap[color];
    };

    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />

            {/* Hero Section - Updated to match About Us */}
            <div className="relative px-6 lg:px-8 pt-24 pb-16 bg-gradient-to-br from-emerald-100 to-green-100">
                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full mb-6">
                        <HelpCircle className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-semibold text-emerald-700">Frequently Asked Questions</span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
                        How can we 
                        <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> help </span>
                        you?
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                        Find answers to common questions about using Farmio platform for agricultural trading in Sri Lanka
                    </p>
                </div>
            </div>

            {/* Overview Cards Section */}
            <div className="py-20 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Quick 
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Overview</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get instant answers and support for your Farmio journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-200 transition-colors">
                                <HelpCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">30+ FAQs</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Comprehensive answers to most common questions about using Farmio platform
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                                <MessageCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">24/7 Support</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Our dedicated support team is always ready to help you succeed
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                                <Search className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Easy Search</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Find specific answers quickly with organized categories and search
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="py-24 bg-white">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="space-y-12">
                        {faqCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 border border-green-100">
                                <div className="flex items-center mb-8">
                                    <div className={`w-12 h-12 ${getColorClasses(category.color)} rounded-lg flex items-center justify-center mr-4`}>
                                        <category.icon className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {category.faqs.map((faq, faqIndex) => {
                                        const globalIndex = `${categoryIndex}-${faqIndex}`;
                                        return (
                                            <div 
                                                key={faqIndex} 
                                                className="bg-white rounded-xl border border-green-200 overflow-hidden hover:border-green-300 transition-all duration-200"
                                            >
                                                <button
                                                    onClick={() => toggleFAQ(globalIndex)}
                                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-green-50 transition-colors duration-200"
                                                >
                                                    <span className="font-semibold text-gray-900 pr-4">
                                                        {faq.question}
                                                    </span>
                                                    {openFAQ === globalIndex ? (
                                                        <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    )}
                                                </button>
                                                
                                                {openFAQ === globalIndex && (
                                                    <div className="px-6 pb-6">
                                                        <div className="border-t border-green-100 pt-4">
                                                            <p className="text-gray-600 leading-relaxed">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Support Section */}
            <div className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Still have questions?
                    </h2>
                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        Can't find the answer you're looking for? Our support team is here to help you succeed.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-xl shadow-md border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Email Support</h3>
                            <p className="text-gray-600 mb-6">
                                Send us an email and we'll get back to you within 24 hours
                            </p>
                            <a 
                                href="mailto:support@farmio.lk" 
                                className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200"
                            >
                                support@farmio.lk
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </a>
                        </div>
                        
                        <div className="bg-white p-8 rounded-xl shadow-md border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Phone Support</h3>
                            <p className="text-gray-600 mb-6">
                                Call us directly for immediate assistance
                            </p>
                            <a 
                                href="tel:+94112345678" 
                                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                            >
                                +94 11 234 5678
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </a>
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
                        Ready to Start Trading?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Join thousands of farmers and buyers already using Farmio to transform Sri Lankan agriculture.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link 
                            to="/register" 
                            className="px-10 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Register Now
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

export default FAQ;