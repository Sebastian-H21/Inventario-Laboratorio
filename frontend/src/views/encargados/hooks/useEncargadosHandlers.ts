import { deleteEncargado, saveOrUpdateEncargado } from "../services/encargadosServices";
import { Encargado } from "../../../types";
import { Dispatch, SetStateAction } from "react";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";

interface Params {
    data: Encargado[];
    setData: Dispatch<SetStateAction<Encargado[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingEncargado: (encargado: Encargado | null) => void;
    editingEncargado: Encargado | null;
    }

    export const useEncargadosHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingEncargado,
    editingEncargado,
    }: Params) => {
    const handleEdit = (encargado: Encargado) => {
        setEditingEncargado(encargado);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar a este encargado?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteEncargado(id);
            setData((prevData) => prevData.filter((item) => item.id !== id));
            Swal.fire("Archivado!", "El encargado fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar al encargado.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/encargados/${id}/restaurar`);
        setData((prevData) => prevData.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "El encargado ha sido restaurado.", "success");
        } catch (error) {
        console.error("Error al restaurar", error);
        Swal.fire("Error", "No se pudo restaurar el encargado", "error");
        }
    };

    const handleSubmit = async (encargado: Encargado) => {
        try {
            const isEdit = !!editingEncargado;

            const emailDuplicado = data.some(
                (item) =>
                    item.email === encargado.email &&
                    (!isEdit || item.id !== encargado.id)
            );
            if (emailDuplicado) {
                toast.error(`Error: Ya existe un encargado con ese correo "${encargado.email}"`);
                return;
            }
            const encargadoFinal = { ...encargado, is_admin: false };
            if (isEdit && !encargadoFinal.password) {
                delete encargadoFinal.password;
            }
            const response = await saveOrUpdateEncargado(encargadoFinal, isEdit);
            const encargadoGuardado = response.data.data;
            setData((prevData) =>
                isEdit
                ? prevData.map((item) => (item.id === encargado.id ? encargadoGuardado : item))
                : [...prevData, encargadoGuardado]
            );
            toast.success(
                isEdit ? "Encargado actualizado exitosamente" : "Encargado registrado exitosamente"
            );
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Error inesperado:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Ocurrió un error inesperado.");
            }
        }
    };

    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
    };
};
