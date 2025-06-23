import React, { useState } from 'react';

const SeasonalPricing = () => {
    const [seasonalRates, setSeasonalRates] = useState([]);
    const [newRate, setNewRate] = useState({ season: '', price: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRate({ ...newRate, [name]: value });
    };

    const handleAddRate = () => {
        if (newRate.season && newRate.price) {
            setSeasonalRates([...seasonalRates, newRate]);
            setNewRate({ season: '', price: '' });
        }
    };

    return (
        <div>
            <h1>Seasonal Pricing Management</h1>
            <div>
                <h2>Add New Seasonal Rate</h2>
                <input
                    type="text"
                    name="season"
                    placeholder="Season"
                    value={newRate.season}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newRate.price}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddRate}>Add Rate</button>
            </div>
            <div>
                <h2>Current Seasonal Rates</h2>
                <ul>
                    {seasonalRates.map((rate, index) => (
                        <li key={index}>
                            {rate.season}: ${rate.price}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SeasonalPricing;