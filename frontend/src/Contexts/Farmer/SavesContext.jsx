import { Children, createContext, useContext, useState } from "react";
import wheat from "../../Assets/Farmer/Crops/wheat.webp";

const savesContext = createContext([]);

const initialItems = [
  {
    id: 1,
    name: "Keeri Samba Rice",
    type: "Paddy",
    unit: "Kg",
    pricePerUnit: 120.00,
    image: wheat,
    quantity: 50,
    seller: {
      id: 101,
      name: "Farmer Tharindu",
      district: "Anuradhapura",
      contact: "0771234567"
    }
  },
  {
    id: 2,
    name: "Red Onion",
    type: "Vegetable",
    unit: "Kg",
    pricePerUnit: 200.00,
    image: wheat,
    quantity: 30,
    seller: {
      id: 102,
      name: "Farmer Kumara",
      district: "Jaffna",
      contact: "0787654321"
    }
  },
  {
    id: 3,
    name: "Big Chili",
    type: "Vegetable",
    unit: "Kg",
    pricePerUnit: 350.00,
    image: wheat,
    quantity: 10,
    seller: {
      id: 103,
      name: "Farmer Ruwan",
      district: "Monaragala",
      contact: "0751112233"
    }
  }
];


const SavesContextProvider = ({ children }) => {

    const [items, setItems] = useState([]);

    console.log("items context : ", items)

    const updateQty = (id, delta) => {
        setItems(items.map(i => i.id === id ? {
            ...i, quantity: Math.max(1, i.quantity + delta)
        } : i));
    }

    const addItem = (item, qty) => {
        setItems([...items, {...item, quantity: qty}])
    }

    const removeItem = id => setItems(items.filter(i => i.id !== id));

    const checkItem = id => setItems(items.map(i => i.id === id ? {...i, checked: true} : i))
    const uncheckItem = id => setItems(items.map(i => i.id === id ? {...i, checked: false} : i))
    const changeTransport = id => setItems(items.map(i => i.id === id ? {...i, transpotationRequired: !i.transpotationRequired} : i))

    return (
        <savesContext.Provider value={{ items, updateQty, addItem, removeItem, checkItem, uncheckItem, changeTransport }}>
            {children}
        </savesContext.Provider>
    );
}

export function useSavesContext() {
    return useContext(savesContext);
}

export default SavesContextProvider;