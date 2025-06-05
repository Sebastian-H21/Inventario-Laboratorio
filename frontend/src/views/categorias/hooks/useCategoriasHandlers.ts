import { deleteCategoria, saveOrUpdateCategoria } from "../services/categoriasServices";
import { Categoria } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

interface Params {
    data: Categoria[];
    setData: Dispatch<SetStateAction<Categoria[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingCategoria: (categoria: Categoria | null) => void;
    editingCategoria: Categoria | null;
    }

    export const useCategoriasHandlers = ({
    data,    
    setData,
    setIsModalOpen,
    setEditingCategoria,
    editingCategoria,
    }: Params) => {
    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar esta categoria?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteCategoria(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivada!", "La categoria fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la categoria.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/categorias/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "La categoria ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la categoria", "error");
        }
    };

    const handleSubmit = async (categoria: Categoria) => {
        try {
            const isEdit = !!editingCategoria;

            const categoriaArchivado = data.find(
                (item) =>
                    item.nombre === categoria.nombre &&
                    item.deleted_at !== null &&
                    (!isEdit || item.id !== categoria.id)
                );
                    
                if (categoriaArchivado) {
                    toast.error(`Ya existe un categoría archivado con el número de control "${categoria.nombre}". Por favor, restaúralo.`);
                    return;
                }


            const nombreDuplicado = data.some((item) =>
            item.nombre === categoria.nombre &&
            (!isEdit || item.id !== categoria.id));


            if (nombreDuplicado) {
                toast.error(`Error: Ya existe una categoria con ese nombre "${categoria.nombre}"`);
                return;
            }       
            const response = await saveOrUpdateCategoria(categoria, isEdit);

            setData((prev) =>
                isEdit ? prev.map((m) => (m.id === categoria.id ? response.data : m)) : [...prev, response.data]
            );

            toast.success(isEdit ? "Categoria actualizado exitosamente" : "Categoria registrado exitosamente");
            setIsModalOpen(false);
            } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");

        }
    };

    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};