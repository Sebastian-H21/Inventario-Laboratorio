import { deleteMaestro, saveOrUpdateMaestro } from "../services/maestrosServices";
import { Maestro } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Maestro[];
    setData: Dispatch<SetStateAction<Maestro[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingMaestro: (maestro: Maestro | null) => void;
    editingMaestro: Maestro | null;
    }

    export const useMaestrosHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingMaestro,
    editingMaestro,
    }: Params) => {
    const handleEdit = (maestro: Maestro) => {
        setEditingMaestro(maestro);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar a este maestro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteMaestro(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivado!", "El maestro fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar al maestro.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/maestros/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "El maestro ha sido restaurado.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar el maestro", "error");
        }
    };

    const handleSubmit = async (maestro: Maestro) => {
        try {
            const isEdit = !!editingMaestro;
            const rfcDuplicado = data.some((item) =>
            item.rfc === maestro.rfc &&
            (!isEdit || item.id !== maestro.id));


            if (rfcDuplicado) {
                toast.error(`Error: Ya existe un material con ese codigo "${maestro.rfc}"`);
                return;
            }       
            const response = await saveOrUpdateMaestro(maestro, isEdit);
            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === maestro.id ? response.data : m)) : [...prev, response.data]
            );

            toast.success(isEdit ? "Maestro actualizado exitosamente" : "Maestro registrado exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");

        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};