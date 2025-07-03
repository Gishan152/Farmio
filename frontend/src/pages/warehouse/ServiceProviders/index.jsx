import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/warehouse/Sidebar';

const ServiceProvidersIndex = () => {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockServiceProviders = [
        {
            id: 7,
            name: "Green Waste Solutions",
            email: "contact@greenwaste.lk",
            phone: "074-777-8888",
            company: "Green Waste Solutions",
            location: "Colombo",
            status: "active",
            image: "/Images/waste1.jpg",
            description: "Eco-friendly waste collection and recycling for urban warehouses."
        },
        {
            id: 8,
            name: "Bio Compost Lanka",
            email: "info@biocompost.lk",
            phone: "076-666-7777",
            company: "Bio Compost Lanka",
            location: "Gampaha",
            status: "active",
            image: "/Images/waste2.jpg",
            description: "Specialists in composting and organic waste management."
        },
        {
            id: 9,
            name: "Ware Waste Agency",
            email: "contact@warewaste.lk",
            phone: "077-123-4567",
            company: "Ware Waste Agency",
            location: "Kurunegala",
            status: "active",
            image: "/Images/waste3.jpg",
            description: "Comprehensive waste solutions for large-scale warehouse operations."
        }
    ];

    useEffect(() => {
        setServiceProviders(mockServiceProviders);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex">
                <div className="fixed top-0 left-0 h-screen w-64 z-30">
                    <Sidebar />
                </div>
                <div className="flex-1 ml-64 flex justify-center items-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">Loading service providers...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 z-30">
                <Sidebar />
            </div>
            {/* Main Content */}
            <main className="ml-64 p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2 mb-2">
                            <span className="text-4xl">🌿</span> Waste Management Partners
                        </h1>
                        <p className="text-green-700 text-sm">Contact and manage your warehouse waste management providers.</p>
                    </div>
                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {serviceProviders.map((sp) => (
                            <div
                                key={sp.id}
                                className="bg-white rounded-2xl border border-green-100 shadow hover:shadow-xl transition group flex flex-col md:flex-row items-stretch"
                            >
                                <div className="md:w-40 w-full flex-shrink-0 flex items-center justify-center p-6 bg-green-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                    <img
                                        src={sp.image}
                                        alt={sp.name}
                                        className="rounded-xl object-cover w-28 h-28 border border-gray-100 shadow-sm"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between p-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg font-semibold text-green-900">{sp.name}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${sp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {sp.status.charAt(0).toUpperCase() + sp.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="text-green-700 font-medium">{sp.company}</div>
                                        <div className="text-sm text-gray-500 mb-2">{sp.location}</div>
                                        <div className="text-sm text-gray-600 mb-3">{sp.description}</div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-800">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>{sp.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-800">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>{sp.email}</span>
                                        </div>
                                        <button
                                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow"
                                            onClick={() => window.open(`mailto:${sp.email}`)}
                                        >
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {serviceProviders.length === 0 && (
                            <div className="text-center text-gray-700 py-8 col-span-2">
                                No waste management partners found.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceProvidersIndex;