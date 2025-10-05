import { createContext, useContext, useEffect, useState } from "react";
import api from "../API/client";
import { jwtDecode } from "jwt-decode";

const userContext = createContext();

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decoded = jwtDecode(token);
            api.post("/api/user/get", {
                username: decoded.sub
            })
            .then(res=>{
                const user = res.data;
                setUser(user);
            })
            .catch(error => {
                console.error("Failed to fetch user data:", error);
            });
        }
    }, [])

    return (
        <userContext.Provider value={{user, setUser}}>
            {children}
        </userContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(userContext);
}

export default UserContextProvider;