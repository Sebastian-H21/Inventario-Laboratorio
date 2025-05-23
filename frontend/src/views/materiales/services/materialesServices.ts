import { Material } from "../../../types";
import api from "../../../utils/api";

export const deleteMaterial = async (id: number): Promise<void> => {
    try {
        await api.delete(`/materials/${id}`);
    } catch (error) {
        console.error("Error al eliminar el material:", error);
        throw new Error("Error al eliminar el material");
    }
    };

    export const saveOrUpdateMaterial = async (
    material: Material,
    isEdit: boolean
    ): Promise<Material> => {
    try {
        if (isEdit) {
        const response = await api.put(`/materials/${material.id}`, material);
        return response.data;
        } else {
        const response = await api.post(`/materials`, material);
        return response.data;
        }
    } catch (error: any) {
        if (error.response?.status === 422) {
        console.error("Errores de validación:", error.response.data.errors);
        throw new Error(error.response.data.message || "Error de validación");
        }
        console.error("Error al registrar el material:", error);
        throw error;
    }
    };

    export const restoreMaterial = async (id: number): Promise<void> => {
    try {
        await api.post(`/materials/${id}/restaurar`);
    } catch (error) {
        console.error("Error al restaurar el material:", error);
        throw new Error("Error al restaurar el material");
    }
};
