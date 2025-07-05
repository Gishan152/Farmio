import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";

export const BuyerRegistrationAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/buyer-registration", {
        username: formData.get("username"),
        password: formData.get("password"),
        role: formData.get("role"),
    },{
    headers: {
      "Content-Type": "application/json"
    }
  });
    return res.data;
}

export const BuyerRegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const BuyerRegistration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    if(fetcher.data && fetcher.data.token){
        localStorage.setItem("token", fetcher.data.token)
        navigate("/Buyer-registration")
    }

    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
            <fetcher.Form>
                <input type="text" name="businessName" />
                <input type="password" name="BRN" />
                <select name="type">
                    <option value="ROLE_Buyer">Wholesale</option>
                    <option value="ROLE_BUYER">Hotel/Caterer</option>
                </select>
                <select name="preferedCropCategory">
                    <option value="ROLE_Buyer">Vegetables</option>
                    <option value="ROLE_BUYER">Fruits</option>
                    <option value="ROLE_BUYER">Grains</option>
                    <option value="ROLE_BUYER">All</option>
                </select>
                <input type="number" name="monthlyPurchaseVolume" />
                <input type="number" name="latitude" />
                <input type="number" name="longitude" />
                <button type="submit">
                    {busy ? "Saving..." : "Save"}
                </button>
                {fetcher.data?.error && (
                    <p style={{ color: "red" }}>{fetcher.data.error}</p>
                )}
            </fetcher.Form>
            {fetcher.error && (
                <div>
                    {fetcher.error}
                </div>
            )}
        </div>
     );
}
 
export default BuyerRegistration;