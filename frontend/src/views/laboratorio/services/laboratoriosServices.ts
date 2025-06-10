import { Laboratorio } from "../../../types";
import api from "../../../utils/api";

export const deleteLaboratorio = async (id: number) => {
    try {
        const response = await api.delete(`/laboratorios/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar el laboratorio");
    }
};
export const saveOrUpdateLaboratorio = async (laboratorio: Laboratorio, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/laboratorios/${laboratorio.id}`, laboratorio);
            return response.data;
        } else {
            const response = await api.post(`/laboratorios`, laboratorio);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} el laboratorio`;
        throw new Error(message);
    }
};
export const restoreLaboratorio = async (id: number) => {
    try {
        const response = await api.post(`/laboratorios/${id}/restaurar`);
        return response.data;
    } catch (error) {
        throw new Error("Error al restaurar el laboratorio");
    }
};
