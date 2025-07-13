import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";

export const WasteAgentRegistrationAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/waste-agent-registration", {
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

export const WasteAgentRegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const WasteAgentRegistration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    if(fetcher.data && fetcher.data.token){
        localStorage.setItem("token", fetcher.data.token)
        navigate("/WasteAgent-registration")
    }

    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
            <fetcher.Form>
                <input type="text" name="username" />
                <input type="password" name="password" />
                <select name="role">
                    <option value="ROLE_WasteAgent">WasteAgent</option>
                    <option value="ROLE_BUYER">Buyer</option>
                    <option value="ROLE_TRANSPORT">Transport provider</option>
                    <option value="ROLE_WAREHOUSE">Warehouse provider</option>
                    <option value="ROLE_WASTE">Waste Agent</option>
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
 
export default WasteAgentRegistration;