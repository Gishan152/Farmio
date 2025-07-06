import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";

export const WarehouseProviderRegistrationAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/warehouse-provider-registration", {
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

export const WarehouseProviderRegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const WarehouseProviderRegistration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    if(fetcher.data && fetcher.data.token){
        localStorage.setItem("token", fetcher.data.token)
        navigate("/WarehouseProvider-registration")
    }

    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
            <fetcher.Form>
                <input type="text" name="Capacity" />
                <input type="number" name="longitude" />
                <input type="number" name="latitude" />
                <select name="type">
                    <option value="ROLE_WarehouseProvider">Cold</option>
                    <option value="ROLE_BUYER">Dry</option>
                    <option value="ROLE_TRANSPORT">Ambient</option>
                </select>
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
 
export default WarehouseProviderRegistration;