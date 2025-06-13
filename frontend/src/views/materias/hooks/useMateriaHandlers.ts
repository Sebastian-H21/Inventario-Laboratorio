import { deleteMateria, saveOrUpdateMateria, restoreMateria } from "../services/materiasServices";
import { Materia } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingMateria: (materia: Materia | null) => void;
    editingMateria: Materia | null;
    data: Materia[];
    }
    export const useMateriasHandlers = ({
    data,
    setIsModalOpen,
    setEditingMateria,
    editingMateria,
    }: Params) => {
    const queryClient = useQueryClient();
    const handleEdit = (materia: Materia) => {
        setEditingMateria(materia);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas archivar esta marca?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, archivar!",
            });
        if (result.isConfirmed) {
        try {
            await deleteMateria(id);
            await queryClient.invalidateQueries({ queryKey: ["materias"] });
            Swal.fire("Archivada!", "La marcaa fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la marca.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await restoreMateria(id);
        await queryClient.invalidateQueries({ queryKey: ["materias"] });
        Swal.fire("Restaurada", "La materia ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la materia", "error");
        }
    };
    const handleSubmit = async (materia: Materia) => {
        try {
        const isEdit = !!editingMateria;
        const materiaArchivada = data.find(
            (item) =>
            item.nombre === materia.nombre &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== materia.id)
        );
        if (materiaArchivada) {
            toast.error(`Ya existe una materia archivada con el nombre "${materia.nombre}". Por favor, restaúrala.`);
            return;
        }
        const nombreDuplicado = data.some(
            (item) =>
            item.nombre === materia.nombre &&
            (!isEdit || item.id !== materia.id)
        );
        if (nombreDuplicado) {
            toast.error(`Error: Ya existe un materia con el nombre "${materia.nombre}"`);
            return;
        }
        await saveOrUpdateMateria(materia, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["materias"] });
        toast.success(isEdit ? "Materia actualizada exitosamente" : "Materia registrada exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
