import { Categoria } from "../../../types";
import api from "../../../utils/api";

export const deleteCategoria = async (id: number) => {
    try {
        const response = await api.delete(`/categorias/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la categoria");
    }
};
export const saveOrUpdateCategoria = async (categoria: Categoria, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/categorias/${categoria.id}`, categoria);
            return response.data;
        } else {
            const response = await api.post(`/categorias`, categoria);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} la categoria`;
        throw new Error(message);
    }
};
export const restoreCategoria = async (id: number) => {
    try {
        const response = await api.post(`/categorias/${id}/restaurar`);
        return response.data;
    } catch (error) {
        throw new Error("Error al restaurar la categoria");
    }
};
