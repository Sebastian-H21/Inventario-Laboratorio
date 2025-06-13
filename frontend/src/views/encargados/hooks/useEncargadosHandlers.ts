import { deleteEncargado, saveOrUpdateEncargado, restoreEncargado } from "../services/encargadosServices";
import { Encargado } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingEncargado: (encargado: Encargado | null) => void;
    editingEncargado: Encargado | null;
    data: Encargado[];
    }
    export const useEncargadosHandlers = ({
    data,
    setIsModalOpen,
    setEditingEncargado,
    editingEncargado,
    }: Params) => {
    const queryClient = useQueryClient();
    const handleEdit = (encargado: Encargado) => {
        setEditingEncargado(encargado);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas archivar este encargado?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, archivar!",
            });
        if (result.isConfirmed) {
        try {
            await deleteEncargado(id);
            await queryClient.invalidateQueries({ queryKey: ["encargados"] });
            Swal.fire("Archivado", "El encargado fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al archivar el encargado.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await restoreEncargado(id);
        await queryClient.invalidateQueries({ queryKey: ["encargados"] });
        Swal.fire("Restaurado", "El encargado ha sido restaurado.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar el encargado", "error");
        }
    };
    const handleSubmit = async (encargado: Encargado) => {
        try {
            const isEdit = !!editingEncargado;
            const encargadoArchivado = data.find(
                (item) =>
                item.nombre === encargado.nombre &&
                item.deleted_at !== null &&
                (!isEdit || item.id !== encargado.id)
            );
            if (encargadoArchivado) {
                toast.error(
                `Ya existe un encargado archivado con el nombre "${encargado.nombre}". Por favor, restaúralo.`
                );
                return;
            }
            const nombreDuplicado = data.some(
                (item) =>
                item.nombre === encargado.nombre &&
                (!isEdit || item.id !== encargado.id)
            );
            if (nombreDuplicado) {
                toast.error(`Error: Ya existe un encargado con el nombre "${encargado.nombre}"`);
                return;
            }
            await saveOrUpdateEncargado(encargado, isEdit);
            await queryClient.invalidateQueries({ queryKey: ["encargados"] });
            toast.success(isEdit ? "Encargado actualizado exitosamente" : "Encargado registrado exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
                console.error(error);
                toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
            }
    };
    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
    };
};
