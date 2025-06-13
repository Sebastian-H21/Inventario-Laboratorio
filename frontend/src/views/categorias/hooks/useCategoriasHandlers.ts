import { deleteCategoria, saveOrUpdateCategoria, restoreCategoria } from "../services/categoriasServices";
import { Categoria } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingCategoria: (categoria: Categoria | null) => void;
    editingCategoria: Categoria | null;
    data: Categoria[];
    }
    export const useCategoriasHandlers = ({
    data,
    setIsModalOpen,
    setEditingCategoria,
    editingCategoria,
    }: Params) => {
    const queryClient = useQueryClient();
    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas archivar esta categoría?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, archivar!",
            });
        if (result.isConfirmed) {
        try {
            await deleteCategoria(id);
            await queryClient.invalidateQueries({ queryKey: ["categorias"] });
            Swal.fire("Archivada!", "La categoría fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la categoría.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await restoreCategoria(id);
        await queryClient.invalidateQueries({ queryKey: ["categorias"] });
        Swal.fire("Restaurada", "La categoría ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la categoría", "error");
        }
    };
    const handleSubmit = async (categoria: Categoria) => {
        try {
        const isEdit = !!editingCategoria;
        const categoriaArchivada = data.find(
            (item) =>
            item.nombre === categoria.nombre &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== categoria.id)
        );
        if (categoriaArchivada) {
            toast.error(`Ya existe una categoría archivada con el nombre "${categoria.nombre}". Por favor, restaúrala.`);
            return;
        }
        const nombreDuplicado = data.some(
            (item) =>
            item.nombre === categoria.nombre &&
            (!isEdit || item.id !== categoria.id)
        );
        if (nombreDuplicado) {
            toast.error(`Error: Ya existe una categoría con el nombre "${categoria.nombre}"`);
            return;
        }
        await saveOrUpdateCategoria(categoria, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["categorias"] });
        toast.success(isEdit ? "Categoría actualizada exitosamente" : "Categoría registrada exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
