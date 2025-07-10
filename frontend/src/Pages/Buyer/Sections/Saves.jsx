import { useState, useEffect, use } from "react";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Buyer/Crops/wheat.webp";
import { Link } from "react-router-dom";
import { useSavesContext } from "../../../Contexts/Buyer/SavesContext";

const FREE_SHIPPING_THRESHOLD = 85;

export default function Saves() {
    const {items, updateQty, removeItem, checkItem, uncheckItem, changeTransport} = useSavesContext();
    const [subtotal, setSubtotal] = useState(0);

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

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Breadcrumb & urgency banner */}
            {/* <nav className="text-gray-500 text-sm flex justify-between">
                <ul className="flex space-x-2">
                    <li><Link to="/" className="hover:underline">Home</Link> /</li>
                    <li><Link to="/products" className="hover:underline">Products</Link> /</li>
                    <li><span>Saves</span></li>
                </ul>
                <div className="text-red-500 flex items-center space-x-1">
                    <span>🔥 Hurry up!</span><span>Your items are reserved for 10 minutes</span>
                </div>
                <div>Help line: (02) 123 123 23</div>
            </nav> */}

            {/* Title and free shipping bar */}
            <div>
                <h1 className="text-3xl font-bold">Saved items</h1>
                <div className="mt-2 text-gray-600">
                    Only the checked items will be included in the order
                </div>
                {/* <div className="mt-2 text-gray-700">
                    Great! You have FREE SHIPPING. Only Rs. {remaining.toFixed(2)} away from getting 3% EXTRA CASHBACK
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                    <div className="bg-green-600 h-2.5 rounded-full transition-all"
                        style={{ width: `Rs. {progress}%` }} />
                </div> */}
            </div>

            {/* Saves items table */}
            <div className="overflow-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4">
                    <thead className="text-left text-gray-600">
                        <tr>
                            <th></th><th>Product</th><th>Price</th><th>Quantity (Kg)</th><th>Total</th><th>Transpotation Required</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-lg">
                                <td><input type="checkbox" checked={item.checked} onChange={(e)=>handleItemCheck(e, item)} /></td>
                                <td className="flex items-center space-x-4 p-4">
                                    <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded" />
                                    <div>
                                        <p className="font-medium">{item.type}</p>
                                        <p className="text-sm text-gray-500">Farm: {item.farm}</p>
                                        <p className="text-sm text-gray-500">Location: {item.location}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-600">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                                <td className="p-4">Rs. {item.pricePerUnit.toFixed(2)}</td>
                                <td className="p-4">
                                    <div className="flex justify-around items-center space-x-2 border rounded">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-1">
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, +1)} className="p-1">
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 font-semibold">Rs. {(item.pricePerUnit * item.quantity).toFixed(2)}</td>
                                <td><input type="checkbox" checked={item.transpotationRequired} onChange={()=>changeTransport(item.id)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <Link to="../crops" className="underline text-gray-600 hover:text-gray-800">
                    CONTINUE SEARCHING
                </Link>
                <div className="mt-4 lg:mt-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full lg:w-auto">
                    <p className="text-lg text-gray-600 dark:text-gray-300">Sub Total: <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Excl. Delivery charges</p>
                    <Link to="../order-confirmation" className="block text-center mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition">
                        GO TO CHECKOUT
                    </Link>
                </div>
            </div>
        </div>
    );
}
