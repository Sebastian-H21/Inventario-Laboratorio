import { deleteMarca, saveOrUpdateMarca, restoreMarca } from "../services/marcasServices";
import { Marca } from "../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingMarca: (marca: Marca | null) => void;
    editingMarca: Marca | null;
    data: Marca[];
    }
    export const useMarcasHandlers = ({
    data,
    setIsModalOpen,
    setEditingMarca,
    editingMarca,
    }: Params) => {
    const queryClient = useQueryClient();
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
            await queryClient.invalidateQueries({ queryKey: ["marcas"] });
            Swal.fire("Archivada!", "La marcaa fue archivada correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar la marca.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await restoreMarca(id);
        await queryClient.invalidateQueries({ queryKey: ["marcas"] });
        Swal.fire("Restaurada", "La marca ha sido restaurada.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar la marca", "error");
        }
    };
    const handleSubmit = async (marca: Marca) => {
        try {
        const isEdit = !!editingMarca;
        const marcaArchivada = data.find(
            (item) =>
            item.nombre === marca.nombre &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== marca.id)
        );
        if (marcaArchivada) {
            toast.error(`Ya existe una marca archivada con el nombre "${marca.nombre}". Por favor, restaúrala.`);
            return;
        }
        const nombreDuplicado = data.some(
            (item) =>
            item.nombre === marca.nombre &&
            (!isEdit || item.id !== marca.id)
        );
        if (nombreDuplicado) {
            toast.error(`Error: Ya existe un marca con el nombre "${marca.nombre}"`);
            return;
        }
        await saveOrUpdateMarca(marca, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["marcas"] });
        toast.success(isEdit ? "Marca actualizada exitosamente" : "Marca registrada exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    return { handleEdit, handleDelete, handleRestore, handleSubmit };
};
