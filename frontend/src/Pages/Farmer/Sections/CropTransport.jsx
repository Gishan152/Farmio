import { StarIcon } from "@heroicons/react/24/solid";
import wheat from "../../../Assets/Farmer/Crops/wheat.webp";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

const providers = [
    {
        id: 1,
        name: "FastMove Logistics",
        rating: 4.8,
        verified: true,
        badges: ["24/7 Service", "Insurance Included"],
        pricePerKm: 1.5,
        available: true,
        imageUrl: wheat,
        contact: "John Smith",
        contactRating: 4.6,
        orderItems: [{id: 1, quantity: 10}, {id: 2, quantity: 5}]
    },
    {
        id: 2,
        name: "Trusty Transport",
        rating: 4.4,
        verified: false,
        badges: ["Temperature-Controlled"],
        pricePerKm: 2.0,
        available: false,
        imageUrl: wheat,
        contact: "Sarah Johnson",
        contactRating: 4.3,
        orderItems: [{id: 3, quantity: 15}, {id: 4, quantity: 20}]
    }
];

const items = [
    {
        id: 1,
        type: 'Corn',
        pricePerUnit: 120,
        farm: 'Sunny Farm',
        location: 'Iowa, USA',
        rating: 4.5,
        verified: true,
        imageUrl: wheat,
        badges: ['Organic', 'On Sale'],
    },
    {
        id: 2,
        type: 'Wheat',
        pricePerUnit: 175,
        farm: 'Golden Fields',
        location: 'Kansas, USA',
        rating: 4.2,
        verified: false,
        imageUrl: wheat,
        badges: [],
    },
    {
        id: 3,
        type: 'Rice',
        pricePerUnit: 110,
        farm: 'Green Valley',
        location: 'Kandy, Sri Lanka',
        rating: 4.7,
        verified: true,
        imageUrl: wheat,
        badges: ['Organic'],
    },
    {
        id: 4,
        type: 'Tomato',
        pricePerUnit: 95,
        farm: 'Highland Farms',
        location: 'Nuwara Eliya, Sri Lanka',
        rating: 4.0,
        verified: false,
        imageUrl: wheat,
        badges: ['On Sale'],
    },
    {
        id: 5,
        type: 'Potato',
        pricePerUnit: 80,
        farm: 'Riverbend Farm',
        location: 'Badulla, Sri Lanka',
        rating: 4.3,
        verified: true,
        imageUrl: wheat,
        badges: [],
    },
    {
        id: 6,
        type: 'Green Gram',
        pricePerUnit: 210,
        farm: 'AgroCare Co-op',
        location: 'Kurunegala, Sri Lanka',
        rating: 4.8,
        verified: true,
        imageUrl: wheat,
        badges: ['Organic', 'Certified'],
    }
];

const FarmerCropTransport = () => {

    const list = providers.map(provider => {
        provider.items = provider.orderItems.map(v => {
            const item = items.find(i => i.id == v.id)
            item.quantity = v.quantity
            return item
        })
        console.log("provider items : ", provider.items)
        return provider
    })
    console.log("list : ", list)


    return (
        <section className="p-6">
            <div>
                <h1 className="text-3xl font-bold">Transport confirmation</h1>
                <div className="mt-2 text-gray-600">
                    Following transport jobs were created for the order
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
                {list.map(provider => {
                    return (
                        <div key={provider.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img src={provider.imageUrl} alt="" className="h-20 w-20 object-cover rounded" />
                                    {provider.verified &&
                                        <div className="absolute top-0 left-0 bg-white p-1 border-none rounded-[50%]">
                                            <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                                        </div>
                                    }
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-gray-100">{provider.name}</h2>
                                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                                        <StarIcon className="h-5 w-5 text-yellow-500" />
                                        <span>{provider.rating}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {provider.badges.map(badge => (
                                            <span
                                                key={badge}
                                                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-800 dark:text-green-100"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Reserved on: {provider.reservationDate}
                                    </p> */}
                                </div>
                            </div>

                            <div className="border-t dark:border-gray-700 pt-4 space-y-3">
                                <h3 className="text-lg font-medium dark:text-gray-100">Assigned items</h3>
                                <table className="w-full table-auto border-separate border-spacing-y-4">
                                    <thead className="text-left text-gray-600">
                                        <tr>
                                            <th>Product</th><th>Quantity (Kg)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {provider.items.map(item => (
                                            <tr key={item.id} className="bg-white dark:bg-gray-800 rounded-lg">
                                                <td className="flex items-center space-x-4 p-4">
                                                    <img src={item.imageUrl} alt="" className="w-20 h-20 object-cover rounded" />
                                                    <div>
                                                        <p className="font-medium">{item.type}</p>
                                                        <p className="text-sm text-gray-500">Farm: {item.farm}</p>
                                                        <p className="text-sm text-gray-500">Location: {item.location}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2">{item.quantity}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default FarmerCropTransport;