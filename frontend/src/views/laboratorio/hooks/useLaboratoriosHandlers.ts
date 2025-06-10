import { deleteLaboratorio, saveOrUpdateLaboratorio } from "../services/laboratoriosServices";
import { Laboratorio } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Laboratorio[];
    setData: Dispatch<SetStateAction<Laboratorio[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingLaboratorio: (laboratorio: Laboratorio | null) => void;
    editingLaboratorio: Laboratorio | null;
    }
    export const useLaboratoriosHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingLaboratorio,
    editingLaboratorio,
    }: Params) => {
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
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivado!", "El laboratorio fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la laboratorio.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await api.post(`/laboratorios/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "El laboratorio ha sido restaurado.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar el laboratorio", "error");
        }
    };
    
    const handleSubmit = async (laboratorio: Laboratorio) => {
        try {
            const isEdit = !!editingLaboratorio;
            const laboratorioArchivado = data.find(
                (item) =>
                    item.nombre === laboratorio.nombre &&
                    item.deleted_at !== null &&
                    (!isEdit || item.id !== laboratorio.id)
                );
                    
                if (laboratorioArchivado) {
                    toast.error(`Ya existe un laboratorio archivado con el nombre "${laboratorio.nombre}". Por favor, restaúralo.`);
                    return;
                }
            const nombreDuplicado = data.some((item) =>
            item.nombre === laboratorio.nombre &&
            (!isEdit || item.id !== laboratorio.id));
            if (nombreDuplicado) {
                toast.error(`Error: Ya existe un laboratorio con ese nombre "${laboratorio.nombre}"`);
                return;
            }       
            const response = await saveOrUpdateLaboratorio(laboratorio, isEdit);
            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === laboratorio.id ? response.data : m)) : [...prev, response.data]
            );
            toast.success(isEdit ? "Laboratorio actualizado exitosamente" : "Laboratorio registrado exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};