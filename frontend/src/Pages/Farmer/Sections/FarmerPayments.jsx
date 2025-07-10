import React, { useState } from 'react';
import { WalletIcon, ClockIcon } from '@heroicons/react/24/solid';
import payhere from  '../../../Assets/Farmer/payhere.png'
import paypal from '../../../Assets/Farmer/paypal.png'
import bank from '../../../Assets/Farmer/bank.png'

export default function FarmerPayments() {
  const transactions = [
    { date: '2023-05-01', description: 'Sale of tomatoes', amount: 150.00 },
    { date: '2023-05-03', description: 'Sale of potatoes', amount: 200.00 },
    { date: '2023-05-05', description: 'Sale of corn', amount: 100.00 },
  ];

  const holds = [
    { amount: 50.00, startDate: '2024-01-01', releaseDate: '2024-02-01' },
    { amount: 75.00, startDate: '2024-01-05', releaseDate: '2025-10-05' },
  ];

  const currentBalance = 500.00;
  const currentDate = new Date();

  const userProfile = {
    payoutMethods: [
      { type: 'Bank Account',  logo: bank },
      { type: 'PayHere',  logo: payhere },
      { type: 'PayPal',  logo: paypal},
    ],
  };

  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(userProfile.payoutMethods[0]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPayoutConfirmationOpen, setIsPayoutConfirmationOpen] = useState(false);

  const calculateProgress = (startDate, releaseDate) => {
    const start = new Date(startDate);
    const release = new Date(releaseDate);
    const total = release - start;
    const elapsed = currentDate - start;
    if (total <= 0) return 100;
    const progress = (elapsed / total) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const calculateDaysLeft = (releaseDate) => {
    const release = new Date(releaseDate);
    const diffTime = release - currentDate;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handlePayoutRequest = () => {
    console.log(`Payout requested via ${selectedPayoutMethod.type} to ${selectedPayoutMethod.details}`);
  };

  const activeHolds = holds.filter(hold => calculateDaysLeft(hold.releaseDate) > 0);
  const totalHolds = activeHolds.reduce((sum, hold) => sum + hold.amount, 0);

  return (
    <div className="p-6 bg-gray-10 min-h-screen">
      <h1 className="text-2xl font-semibold dark:text-gray-100">Payments</h1> <br />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105 cursor-pointer">
          <WalletIcon className="h-10 w-10 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-green-800">Current Balance</h2>
            <p className="text-3xl font-bold text-green-700">${currentBalance.toFixed(2)}</p>
          </div>
        </div>

        <div
          className="bg-yellow-100 p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105 cursor-pointer"
          onClick={() => setIsPopupOpen(true)}
        >
          <ClockIcon className="h-10 w-10 text-yellow-600" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Active Holds</h2>
            <p className="text-3xl font-bold text-yellow-700">${totalHolds.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payout Method</h2>
          <select
            value={selectedPayoutMethod.type}
            onChange={(e) => {
              const selectedType = e.target.value;
              const method = userProfile.payoutMethods.find(m => m.type === selectedType);
              setSelectedPayoutMethod(method);
            }}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
          >
            {userProfile.payoutMethods.map((method) => (
              <option key={method.type} value={method.type}>
                {method.type} 
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsPayoutConfirmationOpen(true)}
            className="mt-4 w-full p-2 rounded text-white bg-green-600 hover:bg-green-700 transition"
          >
            Payout
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-700">{transaction.date}</td>
                  <td className="p-4 text-gray-700">{transaction.description}</td>
                  <td className="p-4 text-right text-green-600 font-medium">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup for Active Holds */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsPopupOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-gray-100">Release Dates</h3>
              <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-4">
              {activeHolds.map((hold, index) => {
                const progress = calculateProgress(hold.startDate, hold.releaseDate);
                const daysLeft = calculateDaysLeft(hold.releaseDate);
                return (
                  <li key={index} className="text-sm text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>${hold.amount.toFixed(2)}</span>
                      <span>Release in {daysLeft} days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <br />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Payout Confirmation Popup */}
      {isPayoutConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsPayoutConfirmationOpen(false)}></div>
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Payout</h3>
              <button onClick={() => setIsPayoutConfirmationOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-4">Payment will be sent to your account within 2-3 business days.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsPayoutConfirmationOpen(false)}
                className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePayoutRequest();
                  setIsPayoutConfirmationOpen(false);
                }}
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}