import api from "../../../utils/api";
import { Prestamo } from "../../../types";

const formatDateToMySQL = (datetimeLocalValue: string) => {
    const date = new Date(datetimeLocalValue);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
export const deletePrestamo = async (id: number) => {
    try {
        await api.delete(`/prestamos/${id}`);
    } catch (error) {
        throw new Error("Error al eliminar el préstamo");
    }
};
    
export const saveOrUpdatePrestamo = async (prestamo: Prestamo, isEdit: boolean) => {
    const dataToSend = {
        fecha_devolucion: formatDateToMySQL(prestamo.fecha_devolucion),
        numero_control: prestamo.numero_control,
        rfc: prestamo.rfc,
        materiales: prestamo.materiales,
        practica: prestamo.practica,
        id_materia: prestamo.id_materia,
        id_laboratorio: prestamo.id_laboratorio,    
    };

    try {
        if (isEdit) {
            const response = await api.put(`/prestamos/${prestamo.id}`, dataToSend);
            return response.data;
        } else {
            const response = await api.post('/prestamos', dataToSend);
            return response.data;
        }
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al guardar el préstamo";
        throw new Error(message);
    }
};


    export const restorePrestamo = async (id: number) => {
        try {
            const response = await api.post(`/prestamos/${id}/restaurar`);
            return response.data
        } catch (error) {
            throw new Error("Error al restaurar el préstamo");
        }
};

