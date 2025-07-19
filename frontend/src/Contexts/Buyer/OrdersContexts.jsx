import { createContext, useContext, useEffect, useState } from "react";
import wheat from "../../Assets/Buyer/Crops/wheat.webp";
import api from "@/API/client";

const orderContext = createContext([]);

const initialOrders = [
	{
		id: "ORD-1001",
		status: "AWAITING_PICKUP",
		total: 1250,
		transport: "BY_BUYER",
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
		status: "IN_TRANSPORT",
		total: 1250,
		transport: "BY_BUYER",
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
		status: "PROCESSING",
		total: 1250,
		transport: "BY_FARMER_SYSTEM",
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
		status: "PROCESSING",
		total: 1250,
		transport: "BY_BUYER_SYSTEM",
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
		status: "PROCESSING",
		total: 1250,
		transport: "BY_FARMER",
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

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	console.log("orders context : ", orders)

	const addOrders = (orders) => {
		const orderIds = orders.map(i => i.orderId);
		const os = orders.map(i => {
			i.id = String(i.orderId);
			i.new = true;
			return i;
		})
		setOrders(prev=>[...prev, ...os])
		setTimeout(() => {
			console.log("Marking orders as read: ", orderIds);
			setOrders(prev => prev.map(i => {
				// Ensure both are string for comparison
				if (orderIds.map(String).includes(String(i.id))) {
					return { ...i, new: false };
				}
				return i;
			}));
		}, 600000);
	}

	const removeOrder = id => setOrders(orders.filter(i => i.id !== id));

	const changeTransport = (orderId, itemId) => {
		setOrders(orders.map(i => {
			if (i.id === orderId) {
				i.items = i.items.map(i => i.id === itemId ? { ...i, transpotationRequired: !i.transpotationRequired } : i)
			}
		}))
	}

	const updateOrder = (orderId, updates) => {
		setOrders(prev=>prev.map(o=>{
			if(o.id === orderId){
				o = {...o, ...updates}
				return o
			}
			return o
		}))
	}

	const getOrders = () => {
		if(orders.length === 0) {
			setLoading(true);
			api.post('/api/order/get').then(res => {
				console.log("Orders loaded: ", res.data);
				setOrders(res.data.map(i => {
					i.id = String(i.orderId);
					return i;
				}));
				setLoading(false);
			}).catch(err => {
				console.error("Error loading orders: ", err);
				setLoading(false);
			});
		}
	}

	useEffect(() => {
		getOrders();
	}, []);

	return (
		<orderContext.Provider value={{ loading, orders, getOrders, addOrders, removeOrder, updateOrder, changeTransport }}>
			{children}
		</orderContext.Provider>
	);
}

export function useOrderContext() {
	return useContext(orderContext);
}

export default OrderContextProvider;