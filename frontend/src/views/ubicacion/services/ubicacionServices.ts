import { Ubicacion } from "../../../types";
import api from "../../../utils/api";

export const deleteUbicacion = async (id: number) => {
    try {
        const response = await api.delete(`/ubicacions/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la ubicacion");
    }
};
export const saveOrUpdateUbicacion = async (ubicacion: Ubicacion, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/ubicacions/${ubicacion.id}`, ubicacion);
            return response.data;
        } else {
            const response = await api.post(`/ubicacions`, ubicacion);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} la ubicacion`;
        throw new Error(message);
    }
};
export const restoreUbicacion = async (id: number) => {
    try {
        const response = await api.post(`/ubicacions/${id}/restaurar`);
        return response.data;
    } catch (error) {
        throw new Error("Error al restaurar la ubicacion");
    }
};
