import api from "../../../utils/api";
import { Estudiante } from "../../../types";
export const deleteEstudiante = async (id: number) => {
    try {
        const response = await api.delete(`/estudiantes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
        throw new Error("Error al eliminar el estudiante");
    }
};
export const saveOrUpdateEstudiante = async (estudiante: Estudiante, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/estudiantes/${estudiante.id}`, estudiante);
            return response.data;
        } else {
            console.log("Datos enviados:", estudiante);
            const response = await api.post(`/estudiantes`, estudiante);
            return response.data;
        }
    } catch (error: any) {
        console.error(`Error al ${isEdit ? "actualizar" : "registrar"} el estudiante:`, error);
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} el estudiante`;
        throw new Error(message);
    }
};
export const restoreestudiante = async (id: number) => {
    try {
        const response = await api.post(`/estudiantes/${id}/restaurar`);
        return response.data;
    } catch (error) {
        console.error("Error al restaurar el estudiante:", error);
        throw new Error("Error al restaurar el estudiante");
    }
};
