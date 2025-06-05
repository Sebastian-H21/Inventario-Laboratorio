import { deleteMateria, saveOrUpdateMateria } from "../services/materiasServices";
import { Materia } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Materia[];
    setData: Dispatch<SetStateAction<Materia[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingMateria: (materia: Materia | null) => void;
    editingMateria: Materia | null;
    }

    export const useMateriasHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingMateria,
    editingMateria,
    }: Params) => {
    const handleEdit = (materia: Materia) => {
        setEditingMateria(materia);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar esta materia?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteMateria(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivada!", "La materia fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la materia.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/materias/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "La materia ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la materia", "error");
        }
    };

    const handleSubmit = async (materia: Materia) => {
        try {
            const isEdit = !!editingMateria;
            const materiaArchivado = data.find(
                (item) =>
                    item.nombre === materia.nombre &&
                    item.deleted_at !== null &&
                    (!isEdit || item.id !== materia.id)
                );
                    
                if (materiaArchivado) {
                    toast.error(`Ya existe un materia archivado con el nombre "${materia.nombre}". Por favor, restaúralo.`);
                    return;
                }




            const nombreDuplicado = data.some((item) =>
            item.nombre === materia.nombre &&
            (!isEdit || item.id !== materia.id));


            if (nombreDuplicado) {
                toast.error(`Error: Ya existe una materia con ese nombre "${materia.nombre}"`);
                return;
            }       
            const response = await saveOrUpdateMateria(materia, isEdit);
            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === materia.id ? response.data : m)) : [...prev, response.data]
            );

            toast.success(isEdit ? "Materia actualizada exitosamente" : "Materia registrada exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");

        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};