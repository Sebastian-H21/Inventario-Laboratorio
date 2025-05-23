import axios from "axios";
import api from "../../../utils/api";
import { Encargado } from "../../../types";

export const deleteEncargado = async (id: number) => {
    try {
        const response = await api.delete(`/encargados/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el encargado:", error);
        throw new Error("Error al eliminar el encargado");
    }
};
export const saveOrUpdateEncargado = async (encargado: Encargado, isEdit: boolean) => {
        try {
        if (isEdit) {
            return await api.put(`/encargados/${encargado.id}`, encargado);
        } else {
            return await api.post("/encargados", encargado);
        }
        } catch (error: any) {
        console.error("Error al registrar el encargado:", error);
        console.log("Respuesta del servidor:", error.response?.data);

    
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Error desconocido";
            throw new Error(message);
        }
    
        throw new Error("Error inesperado");
        }
};

export const restoreEncargado = async (id: number) => {
    try {
        const response = await api.post(`/encargados/${id}/restaurar`);
        return response.data;
    } catch (error) {
        console.error("Error al restaurar el encargado:", error);
        throw new Error("Error al restaurar el encargado");
    }
};


