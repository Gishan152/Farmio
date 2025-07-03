import { createContext, useContext, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";

const orderContext = createContext([]);

const initialOrders = [
	{
		id: "ORD-1001",
		paymentStatus: "Paid",
		total: 1250,
		items: [
			{
				id: "CROP-1",
				type: "Corn",
				farm: "Sunny Farm",
				location: "Iowa, USA",
				pricePerUnit: 12.5,
				quantity: 20,
				// imageUrl: "/images/corn.jpg",
				imageUrl: wheat,
				transportationRequired: true,
			},
			{
				id: "CROP-2",
				type: "Wheat",
				farm: "Golden Fields",
				location: "Kansas, USA",
				pricePerUnit: 9.0,
				quantity: 15,
				// imageUrl: "/images/wheat.jpg",
				imageUrl: wheat,
				transportationRequired: false,
			},
		],
	},
	{
		id: "ORD-1002",
		paymentStatus: "Paid",
		total: 1250,
		items: [
			{
				id: "CROP-3",
				type: "Rice",
				farm: "Riverbank Farm",
				location: "Arkansas, USA",
				pricePerUnit: 14.0,
				quantity: 25,
				// imageUrl: "/images/rice.jpg",
				imageUrl: wheat,
				transportationRequired: true,
			},
		],
	},
	{
		id: "ORD-1003",
		paymentStatus: "Paid",
		total: 1250,
		items: [
			{
				id: "CROP-4",
				type: "Barley",
				farm: "Mountain Grain",
				location: "Colorado, USA",
				pricePerUnit: 11.0,
				quantity: 30,
				// imageUrl: "/images/barley.jpg",
				imageUrl: wheat,
				transportationRequired: false,
			},
			{
				id: "CROP-5",
				type: "Soybean",
				farm: "Green Acre",
				location: "Illinois, USA",
				pricePerUnit: 13.5,
				quantity: 10,
				// imageUrl: "/images/soybean.jpg",
				imageUrl: wheat,
				transportationRequired: true,
			},
			{
				id: "CROP-6",
				type: "Oats",
				farm: "Valley Oats",
				location: "Washington, USA",
				pricePerUnit: 10.0,
				quantity: 40,
				// imageUrl: "/images/oats.jpg",
				imageUrl: wheat,
				transportationRequired: false,
			},
		],
	},
	{
		id: "ORD-1004",
		paymentStatus: "Paid",
		total: 1250,
		items: [
			{
				id: "CROP-7",
				type: "Millet",
				farm: "Prairie Farms",
				location: "Nebraska, USA",
				pricePerUnit: 8.5,
				quantity: 50,
				// imageUrl: "/images/millet.jpg",
				imageUrl: wheat,
				transportationRequired: true,
			},
		],
	},
	{
		id: "ORD-1005",
		paymentStatus: "Paid",
		total: 1250,
		items: [
			{
				id: "CROP-8",
				type: "Quinoa",
				farm: "Healthy Harvest",
				location: "Colorado, USA",
				pricePerUnit: 16.0,
				quantity: 12,
				// imageUrl: "/images/quinoa.jpg",
				imageUrl: wheat,
				transportationRequired: false,
			},
			{
				id: "CROP-9",
				type: "Buckwheat",
				farm: "Rustic Farms",
				location: "Montana, USA",
				pricePerUnit: 15.0,
				quantity: 18,
				// imageUrl: "/images/buckwheat.jpg",
				imageUrl: wheat,
				transportationRequired: true,
			},
		],
	},
]

const OrderContextProvider = ({ children }) => {

	const [orders, setOrders] = useState(initialOrders);

	console.log("orders context : ", orders)

	const addOrder = (item) => {
		setOrders([...orders, item])
	}

	const removeOrder = id => setOrders(orders.filter(i => i.id !== id));

	const changeTransport = (orderId, itemId) => {
		setOrders(orders.map(i => {
			if (i.id === orderId) {
				i.items = i.items.map(i => i.id === itemId ? { ...i, transpotationRequired: !i.transpotationRequired } : i)
			}
		}))
	}

	return (
		<orderContext.Provider value={{ orders, addOrder, removeOrder, changeTransport }}>
			{children}
		</orderContext.Provider>
	);
}

export function useOrderContext() {
	return useContext(orderContext);
}

export default OrderContextProvider;