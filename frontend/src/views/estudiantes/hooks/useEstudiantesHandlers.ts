import { deleteEstudiante, saveOrUpdateEstudiante } from "../services/estudianteServices";
import { Estudiante } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Estudiante[];
    setData: Dispatch<SetStateAction<Estudiante[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingEstudiante: (estudiante: Estudiante | null) => void;
    editingEstudiante: Estudiante | null;
}

export const useEstudiantesHandlers = ({
    data,
    setData,
    setIsModalOpen,
    setEditingEstudiante,
    editingEstudiante,
}: Params) => {
    const handleEdit = (estudiante: Estudiante) => {
        setEditingEstudiante(estudiante);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas archivar a este estudiante?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
            try {
                await deleteEstudiante(id);
                setData((prev) => prev.filter((item) => item.id !== id));
                Swal.fire("Archivado!", "El estudiante fue archivado correctamente.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Hubo un problema al archivar al estudiante.", "error");
            }
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await api.post(`/estudiantes/${id}/restaurar`);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Restaurado", "El estudiante ha sido restaurado.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo restaurar el estudiante", "error");
        }
    };

    const handleSubmit = async (estudiante: Estudiante) => {
        try {
            const isEdit = !!editingEstudiante;

            const numeroControlDuplicado = data.some(
                (item) =>
                    item.numero_control === estudiante.numero_control &&
                    (!isEdit || item.id !== estudiante.id)
            );

            if (numeroControlDuplicado) {
                toast.error(`Error: Ya existe un estudiante con el número de control "${estudiante.numero_control}"`);
                return;
            }

            const response = await saveOrUpdateEstudiante(estudiante, isEdit);

            setData((prevData) =>
                isEdit
                    ? prevData.map((item) => (item.id === estudiante.id ? response.data : item))
                    : [...prevData, response.data]
            );

            toast.success(isEdit ? "Estudiante actualizado exitosamente" : "Estudiante registrado exitosamente");
            setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
