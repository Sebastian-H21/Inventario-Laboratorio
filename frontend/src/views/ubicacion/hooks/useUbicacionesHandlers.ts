import { deleteUbicacion, saveOrUpdateUbicacion } from "../services/ubicacionServices";
import { Ubicacion } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Ubicacion[];
    setData: Dispatch<SetStateAction<Ubicacion[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingUbicacion: (ubicacion: Ubicacion | null) => void;
    editingUbicacion: Ubicacion | null;
    }

    export const useUbicacionHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingUbicacion,
    editingUbicacion,
    }: Params) => {
    const handleEdit = (ubicacion: Ubicacion) => {
        setEditingUbicacion(ubicacion);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar esta ubicación?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteUbicacion(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivada!", "La ubicación fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la ubicación.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/ubicacions/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "La ubicación ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la ubicación", "error");
        }
    };

    const handleSubmit = async (ubicacion: Ubicacion) => {
        try {
            const isEdit = !!editingUbicacion;
            const ubicacionArchivado = data.find(
                (item) =>
                    item.nombre === ubicacion.nombre &&
                    item.deleted_at !== null &&
                    (!isEdit || item.id !== ubicacion.id)
                );
                    
                if (ubicacionArchivado) {
                    toast.error(`Ya existe un ubicación archivada con el nombre "${ubicacion.nombre}". Por favor, restaúralo.`);
                    return;
                }



            const nombreDuplicado = data.some((item) =>
            item.nombre === ubicacion.nombre &&
            (!isEdit || item.id !== ubicacion.id));

            if (nombreDuplicado) {
                toast.error(`Error: Ya existe una ubicación con ese nombre "${ubicacion.nombre}"`);
                return;
            }       
            const response = await saveOrUpdateUbicacion(ubicacion, isEdit);
            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === ubicacion.id ? response.data : m)) : [...prev, response.data]
            );

            toast.success(isEdit ? "Ubicación actualizada exitosamente" : "Ubicación registrada exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");

        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};