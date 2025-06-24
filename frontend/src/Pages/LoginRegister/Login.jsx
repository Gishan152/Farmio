import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import api from "../../API/client";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { navigateToRoleRegistration } from "../../Utils/navigateToRoleRegistration";

export const loginAction = async ({request}) => {
    let formData = await request.formData();
    console.log("form data : ", formData);
    console.log("process.env.VITE_API_GATEWAY_URL: ", import.meta.env.VITE_API_GATEWAY_URL)
    const res = await api.post("/api/auth/login", {
        username: formData.get("username"),
        password: formData.get("password")
    },{
    headers: {
      "Content-Type": "application/json"
    }
  });
    return res.data;
}

export const loginLoader = async () => {
    let token = localStorage.getItem("token");
    // await check if the token is valid
    return {token};
}

const Login = () => {

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
            if(decoded.isTemp){
                navigateToRoleRegistration(decoded.roles[0], navigate)
            }else{
                navigate("/user")
            }
        }
    })
    
    return ( 
        <div>
            <button onClick={()=>navigate("/")}>Back to website</button>
            <button onClick={()=>navigate("/registration")}>New here? Signup</button>
            <fetcher.Form method="post">
                <input type="text" name="username" />
                <input type="password" name="password" />
                <button type="submit">
                    {busy ? "Logging in..." : "Login"}
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
 
export default Login;