import { createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const orderContext = createContext([]);

const OrderContextProvider = ({ children }) => {

	const [orders, setOrders] = useState([]);

	console.log("orders context : ", orders)

	const updateQty = (id, delta) => {
		setOrders(orders.map(i => i.id === id ? {
			...i, quantity: Math.max(1, i.quantity + delta)
		} : i));
	}

	const addOrder = (item) => {
		setOrders([...orders, item])
	}

	const removeOrder = id => setOrders(orders.filter(i => i.id !== id));

	const checkOrder = id => setOrders(orders.map(i => i.id === id ? { ...i, checked: true } : i))
	const uncheckOrder = id => setOrders(orders.map(i => i.id === id ? { ...i, checked: false } : i))
	const changeTransport = id => setOrders(orders.map(i => i.id === id ? { ...i, transpotationRequired: !i.transpotationRequired } : i))

	return (
		<orderContext.Provider value={{ orders, updateQty, addOrder, removeOrder, checkOrder, uncheckOrder, changeTransport }}>
			{children}
		</orderContext.Provider>
	);
}

export function useOrderContext() {
	return useContext(orderContext);
}

export default OrderContextProvider;