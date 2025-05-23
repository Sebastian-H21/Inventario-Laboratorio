import { NavigateFunction } from "react-router-dom";
import api, { setAuthToken } from "./api";


export const loginUsuario = async (email: string, password: string) => {
    try {
        const response = await api.post("/login", { email, password });
        const token = response.data.access_token || response.data.token;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userType", user.rol);
        setAuthToken(token);

        return { token, user }; 
    } catch (error: any) {
        console.error("Error de login:", error.response ? error.response.data : error);
        throw error; 
    }
};


// logout
export const logout = async (navigate: NavigateFunction) => {
    const userType = localStorage.getItem("userType");
    const endpoint = userType === "encargado" ? "/logout/encargado" : "/logout";
    
    try {
        await api.post(endpoint);
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
    localStorage.clear();

    navigate("/");
};
