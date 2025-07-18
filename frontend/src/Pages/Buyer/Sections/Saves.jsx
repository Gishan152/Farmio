import { useState, useEffect, use } from "react";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";

const FREE_SHIPPING_THRESHOLD = 85;

export default function Saves() {
    const {items, updateQty, removeItem, checkItem, uncheckItem, changeTransport} = useSavesContext();
    const [subtotal, setSubtotal] = useState(0);
    const navigate = useNavigate();

    // console.log("items : ", items)

    useEffect(() => {
        setSubtotal(items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0));
    }, [items]);

    const handleItemCheck = (e, item) => {
        console.log("e : ", e)
        if(e.target.checked){
            checkItem(item.id)
        }else{
            uncheckItem(item.id)
        }
    }

    const handleTransportCheck = (e, item) => {
        if(e.target.checked){

        }
    }

    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

    const handleCheckout = () => {
        navigate("../order-confirmation", {state: {items: items.filter(v=>!v.unchecked)}})   
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold dark:text-gray-100">Saved Items</h1>
                <Link to="../crops" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold">
                    Continue Searching
                </Link>
            </div>

            {/* Progress bar for free shipping */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                        {progress < 100 ? `Add Rs. ${remaining.toFixed(2)} more for free shipping!` : "You have qualified for free shipping!"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal: Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
            </div> */}

            {/* Saves items table */}
            <div className="overflow-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4">
                    <thead className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th></th><th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <td className="align-middle px-2"><input type="checkbox" checked={!item.unchecked} onChange={(e)=>handleItemCheck(e, item)} className="accent-green-600 w-5 h-5" /></td>
                                <td className="flex items-center space-x-4 p-4">
                                    <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-gray-700" />
                                    <div>
                                        <p className="font-medium text-lg text-green-900 dark:text-green-100">{item.type}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Farm: {item.farm}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Location: {item.location}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-600 ml-2">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                                <td className="p-4 text-green-700 dark:text-green-300 font-semibold">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                <td className="p-4">
                                    <div className="flex justify-around items-center space-x-2 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="px-2 font-semibold text-gray-800 dark:text-gray-100">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, +1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-green-800 dark:text-green-200">Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-full md:w-auto border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg text-gray-600 dark:text-gray-300">Sub Total:</span>
                        <span className="font-semibold text-green-700 dark:text-green-300 text-lg">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Excl. Delivery charges</div>
                    <button onClick={handleCheckout} className="block text-center mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                        Go to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
