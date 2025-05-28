import { Materia } from "../../../types";
import api from "../../../utils/api";

export const deleteMateria = async (id: number) => {
    try {
        const response = await api.delete(`/materias/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la materia");
    }
};
export const saveOrUpdateMateria = async (materia: Materia, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/materias/${materia.id}`, materia);
            return response.data;
        } else {
            const response = await api.post(`/materias`, materia);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} el materia`;
        throw new Error(message);
    }
};
export const restoreMateria = async (id: number) => {
    try {
        const response = await api.post(`/materias/${id}/restaurar`);
        return response.data;
    } catch (error) {
        throw new Error("Error al restaurar la materia");
    }
};
