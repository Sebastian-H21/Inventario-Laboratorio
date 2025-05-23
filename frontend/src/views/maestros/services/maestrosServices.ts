import { Maestro } from "../../../types";
import api from "../../../utils/api";

export const deleteMaestro = async (id: number) => {
    try {
        const response = await api.delete(`/maestros/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el maestro:", error);
        throw new Error("Error al eliminar el maestro");
    }
};
export const saveOrUpdateMaestro = async (maestro: Maestro, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/maestros/${maestro.id}`, maestro);
            return response.data;
        } else {
            const response = await api.post(`/maestros`, maestro);
            return response.data;
        }
    } catch (error: any) {
        console.error(`Error al ${isEdit ? "actualizar" : "registrar"} el maestro:`, error);
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} el maestro`;
        throw new Error(message);
    }
};
export const restoreMaestro = async (id: number) => {
    try {
        const response = await api.post(`/maestros/${id}/restaurar`);
        return response.data;
    } catch (error) {
        console.error("Error al restaurar el maestro:", error);
        throw new Error("Error al restaurar el maestro");
    }
};
