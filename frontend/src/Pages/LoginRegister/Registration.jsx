import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { useEffect } from "react";
import { FormDataToObj } from "../../Utils/FormDataToObj";
import { jwtDecode } from "jwt-decode";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";

export const RegistrationAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/register",
        FormDataToObj(formData)
    ,{
        headers: {
        "Content-Type": "application/json"
        }
    });
    return res.data;
}

export const RegistrationLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const Registration = () => {

    const navigate = useNavigate();
    let data = useLoaderData();
    console.log("data : ", data)
    let fetcher = useFetcher();
    let busy = fetcher.state !== "idle";

    useEffect(()=>{
        if(fetcher.data && fetcher.data.token){
            const decoded = jwtDecode(fetcher.data.token);
            console.log(decoded);
            localStorage.setItem("token", fetcher.data.token)
            navigateToRoleRegistration(decoded.roles[0], navigate)
        }
    })
    

    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/login")}>Already have an account? Log in</button>
            <fetcher.Form method="post">
                <input type="text" name="username" placeholder="Username"/>
                <input type="text" name="nic" placeholder="NIC"/>
                <input type="email" name="email" placeholder="Email"/>
                <input type="phone" name="phoneNo" placeholder="Phone number"/>
                <input type="file" name="profile-pic" placeholder="Profile picture"/>
                <input type="password" name="password" placeholder="Password"/>
                <select name="role" placeholder="Register as">
                    <option value="ROLE_FARMER">Farmer</option>
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
 
export default Registration;