import { deleteLaboratorio, saveOrUpdateLaboratorio, restoreLaboratorio } from "../services/laboratoriosServices";
import { Laboratorio } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingLaboratorio: (laboratorio: Laboratorio | null) => void;
    editingLaboratorio: Laboratorio | null;
    data: Laboratorio[];
    }
    export const useLaboratoriosHandlers = ({
    data,
    setIsModalOpen,
    setEditingLaboratorio,
    editingLaboratorio,
    }: Params) => {
    const queryClient = useQueryClient();
    const handleEdit = (laboratorio: Laboratorio) => {
        setEditingLaboratorio(laboratorio);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas archivar este laboratorio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, archivar!",
            });
        if (result.isConfirmed) {
        try {
            await deleteLaboratorio(id);
            await queryClient.invalidateQueries({ queryKey: ["laboratorios"] });
            Swal.fire("Archivada!", "El laboratorio fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar el laboratorio.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await restoreLaboratorio(id);
        await queryClient.invalidateQueries({ queryKey: ["laboratorios"] });
        Swal.fire("Restaurada", "El laboratorio ha sido restaurado.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar el laboratorio", "error");
        }
    };
    const handleSubmit = async (laboratorio: Laboratorio) => {
        try {
        const isEdit = !!editingLaboratorio;
        const laboratorioArchivada = data.find(
            (item) =>
            item.nombre === laboratorio.nombre &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== laboratorio.id)
        );
        if (laboratorioArchivada) {
            toast.error(`Ya existe una laboratorio archivado con el nombre "${laboratorio.nombre}". Por favor, restaúralo.`);
            return;
        }
        const nombreDuplicado = data.some(
            (item) =>
            item.nombre === laboratorio.nombre &&
            (!isEdit || item.id !== laboratorio.id)
        );
        if (nombreDuplicado) {
            toast.error(`Error: Ya existe un laboratorio con el nombre "${laboratorio.nombre}"`);
            return;
        }
        await saveOrUpdateLaboratorio(laboratorio, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["laboratorios"] });
        toast.success(isEdit ? "Laboratorio actualizado exitosamente" : "Laboratorio registrado exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
