import { deleteMarca, saveOrUpdateMarca } from "../services/marcasServices";
import { Marca } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Marca[];
    setData: Dispatch<SetStateAction<Marca[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingMarca: (marca: Marca | null) => void;
    editingMarca: Marca | null;
    }

    export const useMarcasHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingMarca,
    editingMarca,
    }: Params) => {
    const handleEdit = (marca: Marca) => {
        setEditingMarca(marca);
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
            await deleteMarca(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivada!", "La marca fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la marca.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/marcas/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "La marca ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la marca", "error");
        }
    };

    const handleSubmit = async (marca: Marca) => {
        try {
            const isEdit = !!editingMarca;
            const nombreDuplicado = data.some((item) =>
            item.nombre === marca.nombre &&
            (!isEdit || item.id !== marca.id));


            if (nombreDuplicado) {
                toast.error(`Error: Ya existe una marca con ese nombre "${marca.nombre}"`);
                return;
            }       
            const response = await saveOrUpdateMarca(marca, isEdit);
            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === marca.id ? response.data : m)) : [...prev, response.data]
            );

            toast.success(isEdit ? "Marca actualizada exitosamente" : "Marca registrada exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");

        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};