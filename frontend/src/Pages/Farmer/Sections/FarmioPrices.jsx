import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const samplePrices = [
  { product: 'Rice', unit: 'kg', price: 1.20, updated: '2025-07-01' },
  { product: 'Corn', unit: 'kg', price: 0.90, updated: '2025-07-03' },
  { product: 'Tomatoes', unit: 'kg', price: 1.50, updated: '2025-07-02' },
  { product: 'Potatoes', unit: 'kg', price: 0.80, updated: '2025-07-04' },
  { product: 'Wheat', unit: 'kg', price: 1.10, updated: '2025-07-05' },
];

export default function FarmioPrices() {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // simulate fetch from moderator input
    setPrices(samplePrices);
  }, []);

  const filtered = prices.filter(({ product }) =>
    product.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-6 dark:text-gray-100">Farmio Standard Prices</h1>

      <div className="flex items-center max-w-md">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute ml-3" />
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price per Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-green-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-800">{row.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-green-600">{row.price.toFixed(2)} / {row.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{row.updated}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No products match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
