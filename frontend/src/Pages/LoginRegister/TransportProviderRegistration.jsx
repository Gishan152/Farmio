import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";

export const TransportProviderRegistrationAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/transport-provider-registration", {
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

export const TransportProviderRegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const TransportProviderRegistration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    if(fetcher.data && fetcher.data.token){
        localStorage.setItem("token", fetcher.data.token)
        navigate("/TransportProvider-registration")
    }

    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
            <fetcher.Form>
                <input type="text" name="VRN" /> 
                {/* Vehicle registration number */}
                <input type="password" name="Capacity" />
                <select name="type">
                    <option value="ROLE_TransportProvider">Bike</option>
                    <option value="ROLE_BUYER">Three Wheeler</option>
                    <option value="ROLE_TRANSPORT">Lorry</option>
                    <option value="ROLE_WAREHOUSE">Tractor</option>
                    <option value="ROLE_WASTE">Refrigerated Truck</option>
                </select>
                <input type="password" name="availability" />
                <input type="file" name="driverLicenseImage" />
                <input type="checkbox" name="helperAvailable" />
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
 
export default TransportProviderRegistration;