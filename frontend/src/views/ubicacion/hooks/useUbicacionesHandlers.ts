import { deleteUbicacion, saveOrUpdateUbicacion, restoreUbicacion } from "../services/ubicacionServices";
import { Ubicacion } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingUbicacion: (ubicacion: Ubicacion | null) => void;
    editingUbicacion: Ubicacion | null;
    data: Ubicacion[];
    }
    export const useUbicacionsHandlers = ({
        data,
        setIsModalOpen,
        setEditingUbicacion,
        editingUbicacion,
    }: Params) => {
    const queryClient = useQueryClient();
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
                await queryClient.invalidateQueries({ queryKey: ["ubicacions"] });
                Swal.fire("Archivada!", "La ubicación fue archivada correctamente.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Hubo un problema al archivar la ubicación.", "error");
            }
        }
    };
    const handleRestore = async (id: number) => {
        try {
            await restoreUbicacion(id);
            await queryClient.invalidateQueries({ queryKey: ["ubicacions"] });
            Swal.fire("Restaurada", "La ubicación ha sido restaurada.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "No se pudo restaurar la ubicación", "error");
            }
    };
    const handleSubmit = async (ubicacion: Ubicacion) => {
        try {
        const isEdit = !!editingUbicacion;
        const ubicacionArchivada = data.find(
            (item) =>
            item.nombre === ubicacion.nombre &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== ubicacion.id)
        );
        if (ubicacionArchivada) {
            toast.error(`Ya existe una ubicación archivada con el nombre "${ubicacion.nombre}". Por favor, restaúrala.`);
            return;
        }
        const nombreDuplicado = data.some(
            (item) =>
            item.nombre === ubicacion.nombre &&
            (!isEdit || item.id !== ubicacion.id)
        );
        if (nombreDuplicado) {
            toast.error(`Error: Ya existe un ubicación con el nombre "${ubicacion.nombre}"`);
            return;
        }
        await saveOrUpdateUbicacion(ubicacion, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["ubicacions"] });
        toast.success(isEdit ? "Ubicación actualizada exitosamente" : "Ubicación registrada exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
