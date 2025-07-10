import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useState } from 'react';

export const FarmerRegistrationAction = async ({ request }) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/farmer-registration", {
        username: formData.get("username"),
        password: formData.get("password"),
        role: formData.get("role"),
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.data;
}

export const FarmerRegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return { token };
}

const FarmerRegistration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    // if(fetcher.data && fetcher.data.token){
    //     localStorage.setItem("token", fetcher.data.token)
    //     navigate("/farmer-registration")
    // }

    function onLocation(location) {
        console.log("location : ", location)
    }

    return (
        <div>
            <button onClick={() => navigate("/")}>Back to website</button>
            {/* <button onClick={() => navigate("/login")}>Already have an account? Log in</button> */}
            <fetcher.Form>
                <input type="longitude" name="longitude" />
                <input type="latitude" name="latitude" />
                <input type="number" name="farmSize" />
                <select name="farmType">
                    <option value="ROLE_FARMER">Vegetables</option>
                    <option value="ROLE_BUYER">Fruits</option>
                    <option value="ROLE_TRANSPORT">Grains</option>
                </select>
                <select name="harvestFequency">
                    <option value="ROLE_FARMER">Weekly</option>
                    <option value="ROLE_BUYER">Monthly</option>
                    <option value="ROLE_TRANSPORT">Seasonal</option>
                </select>
                {/* Self-delivery service area : input */}
                <button type="submit">
                    {busy ? "Saving..." : "Save"}
                </button>
                {fetcher.data?.error && (
                    <p style={{ color: "red" }}>{fetcher.data.error}</p>
                )}
                <LocationCapture onLocation={onLocation} />
            </fetcher.Form>
            {fetcher.error && (
                <div>
                    {fetcher.error}
                </div>
            )}
        </div>
    );
}

function LocationCapture({ onLocation }) {
    const [error, setError] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude } = pos.coords;
                onLocation({ latitude, longitude });
            },
            err => setError(err.message)
        );
    };

    return (
        <div>
            <button onClick={getLocation}>Share My Location</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}


export default FarmerRegistration;