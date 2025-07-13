export const navigateToRoleRegistration = (role, navigate) => {
    switch(role){
        case "ROLE_FARMER":
            navigate("/register/farmer")
            break
        case "ROLE_BUYER":
            navigate("/register/buyer")
            break
        case "ROLE_WAREHOUSE":
            navigate("/register/warehouse-provider")
            break
        case "ROLE_TRANSPORT":
            navigate("/register/transport-provider")
            break
        case "ROLE_WASTE":
            navigate("/register/waste-agent")
            break
        default:
            navigate("/register/farmer")
            break
    }
}