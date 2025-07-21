export function navigateToRoleDashboard(role, navigate) {
    switch (role) {
        case "ROLE_ADMIN":
            navigate("/admin/dashboard");
            break;
        case "ROLE_BUYER":
            navigate("/buyer/dashboard");
            break;
        case "ROLE_FARMER":
            navigate("/farmer");
            break;
        case "ROLE_WAREHOUSE":
            navigate("/warehouse");
            break;
        case "ROLE_WASTE":
            navigate("/waste-agent");
            break;
        case "ROLE_MODERATOR":
            navigate("/moderator/dashboard");
            break;
        case "ROLE_TRANSPORT":
            navigate("/transporter/dashboard");
            break;
        default:
            navigate("/user");
    }
}