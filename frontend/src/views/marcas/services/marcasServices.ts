import { Marca } from "../../../types";
import api from "../../../utils/api";

export const deleteMarca = async (id: number) => {
    try {
        const response = await api.delete(`/marcas/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la marca");
    }
};
export const saveOrUpdateMarca = async (marca: Marca, isEdit: boolean) => {
    try {
        if (isEdit) {
            const response = await api.put(`/marcas/${marca.id}`, marca);
            return response.data;
        } else {
            const response = await api.post(`/marcas`, marca);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || `Error al ${isEdit ? "actualizar" : "registrar"} el marca`;
        throw new Error(message);
    }
};
export const restoreMarca = async (id: number) => {
    try {
        const response = await api.post(`/marcas/${id}/restaurar`);
        return response.data;
    } catch (error) {
        throw new Error("Error al restaurar la marca");
    }
};
