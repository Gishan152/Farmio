import { useState } from 'react';

const products = [
    {
        id: 1,
        name: "Xiaomi Monitor 27 Inch",
        category: "Monitor",
        price: 100,
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 2,
        name: "Xiaomi 14T",
        category: "Smartphone",
        price: 450,
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 3,
        name: "Xiaomi 14T Pro",
        category: "Smartphone",
        price: 520,
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 4,
        name: "Philips Monitor 24Inch",
        category: "Monitor",
        price: 140,
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 5,
        name: "Xiaomi Monitor 24 Inch",
        category: "Monitor",
        price: 362,
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 6,
        name: "Samsung Galaxy A35",
        category: "Smartphone",
        price: 274,
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 7,
        name: "Xiaomi 13T",
        category: "Smartphone",
        price: 410,
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    },
    {
        id: 8,
        name: "Samsung Galaxy A55",
        category: "Smartphone",
        price: 340,
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        rating: 4.6
    }
];

function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen">
            <div>
                <div className="flex items-center mb-8">
                    <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xl mr-3">S</div>
                    <span className="font-bold text-lg">SpendWise</span>
                </div>
                <div className="flex items-center mb-8">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <div className="font-semibold">Hanifa Maulina <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded ml-1">Pro</span></div>
                        <div className="text-xs text-gray-500">Hanifa@gmail.com</div>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    <NavItem icon="🏠" text="Dashboard" />
                    <NavItem icon="📊" text="Analytics" />
                    <NavItem icon="📦" text="Product" active />
                    <NavItem icon="💰" text="Sales" />
                    <NavItem icon="✉️" text="Email" />
                </nav>
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs">Product Plan</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-xs">Campaign</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                        <span className="text-xs">Stock Product</span>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Storage Product</span>
                        <button className="text-orange-600 font-semibold">Upgrade</button>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                        <div className="h-2 bg-orange-500 rounded" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">70% of products have been uploaded</div>
                </div>
                <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition text-sm">
                        <span>⚙️</span> Setting
                    </button>
                    <button className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition text-sm">
                        <span>👤</span> User
                    </button>
                    <button className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition text-sm">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ icon, text, active }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${active
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <span>{icon}</span>
            {text}
        </a>
    );
}

function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">
            <div className="text-lg font-semibold">Hello Hanifa</div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <button className="p-2 rounded hover:bg-gray-100 transition">
                    <span>⚙️</span>
                </button>
                <button className="p-2 rounded hover:bg-gray-100 transition">
                    <span>🔗</span>
                </button>
                <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                />
            </div>
        </header>
    );
}

function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-100 p-4 flex flex-col">
            <img
                src={product.img}
                alt={product.name}
                className="h-32 w-full object-cover rounded mb-3"
            />
            <div className="font-semibold">{product.name}</div>
            <div className="text-xs text-gray-500 mb-1">{product.category}</div>
            <div className="font-bold text-orange-500 mb-2">${product.price.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
                <span>⭐</span>
                <span>{product.rating}</span>
            </div>
        </div>
    );
}

function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product) => (
                <ProductCard product={product} key={product.id} />
            ))}
        </div>
    );
}

function ProductFilters() {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
                <button className="px-4 py-1 rounded bg-orange-500 text-white text-sm font-medium">All</button>
                <button className="px-4 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium">Active</button>
                <button className="px-4 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium">Non Active</button>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium">Table</button>
                <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium">Columns</button>
                <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium">Filter</button>
                <input
                    type="text"
                    placeholder="Search Product"
                    className="pl-3 pr-4 py-1 border border-gray-300 rounded bg-gray-50 text-sm"
                />
                <button className="bg-orange-500 text-white px-4 py-1 rounded font-medium text-sm">Add Product</button>
            </div>
        </div>
    );
}

function Pagination() {
    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-xs text-gray-500">
                Show
                <select className="mx-1 border border-gray-300 rounded px-2 py-0.5 text-xs">
                    <option>8</option>
                    <option>16</option>
                </select>
                per page
            </div>
            <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-gray-100 text-gray-400" disabled>{"<"}</button>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                        key={n}
                        className={`px-2 py-1 rounded ${n === 2
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {n}
                    </button>
                ))}
                <button className="px-2 py-1 rounded bg-gray-100 text-gray-700">{">"}</button>
            </div>
        </div>
    );
}

export default function ProductPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Management Product</h2>
                        <div className="text-sm text-gray-500">Add Product to your store</div>
                    </div>
                    <ProductFilters />
                    <ProductGrid products={products} />
                    <Pagination />
                </main>
            </div>
        </div>
    );
}
