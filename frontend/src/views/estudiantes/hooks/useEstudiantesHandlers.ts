import { deleteEstudiante, saveOrUpdateEstudiante } from "../services/estudianteServices";
import { Estudiante } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { exportToExcel, formatEstudiantesForXLS } from "../../../utils/exportToExcel";
interface Params {
    data: Estudiante[];
    setIsModalOpen: (open: boolean) => void;
    setEditingEstudiante: (estudiante: Estudiante | null) => void;
    editingEstudiante: Estudiante | null;
    }
    export const useEstudiantesHandlers = ({
        data,
        setIsModalOpen,
        setEditingEstudiante,
        editingEstudiante,
        }: Params) => {
    const queryClient = useQueryClient();
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
            await queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
            Swal.fire("Archivado", "El estudiante fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al archivar al estudiante.", "error");
        }
        }
    };
    const handleRestore = async (id: number) => {
        try {
        await api.post(`/estudiantes/${id}/restaurar`);
        await queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
        Swal.fire("Restaurado", "El estudiante ha sido restaurado.", "success");
        } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo restaurar el estudiante", "error");
        }
    };
    const handleSubmit = async (estudiante: Estudiante) => {
        try {
        const isEdit = !!editingEstudiante;
        const estudianteArchivado = data.find(
            (item) =>
            item.numero_control === estudiante.numero_control &&
            item.deleted_at !== null &&
            (!isEdit || item.id !== estudiante.id)
        );
        if (estudianteArchivado) {
            toast.error(`Ya existe un estudiante archivado con el número de control "${estudiante.numero_control}". Por favor, restaúralo.`);
            return;
        }
        const numeroControlDuplicado = data.some(
            (item) =>
            item.numero_control === estudiante.numero_control &&
            item.deleted_at === null &&
            (!isEdit || item.id !== estudiante.id)
        );
        if (numeroControlDuplicado) {
            toast.error(`Error: Ya existe un estudiante con el número de control "${estudiante.numero_control}"`);
            return;
        }
        await saveOrUpdateEstudiante(estudiante, isEdit);
        await queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
        toast.success(isEdit ? "Estudiante actualizado exitosamente" : "Estudiante registrado exitosamente");
        setIsModalOpen(false);
        setEditingEstudiante(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };
    const handleExportEstudiantes = async ({
        tipo,
        modalidad,
    }: {
        tipo: "activos" | "completados";
        modalidad?: "Escolarizada" | "Mixta" | "Otra";
    }) => {
        try {
        const response = await api.get("/estudiantes", {
            params: { verArchivados: tipo === "completados" },
        });
        let estudiantes: Estudiante[] = response.data;
        if (modalidad) {
            estudiantes = estudiantes.filter((e) => e.modalidad === modalidad);
        }
        if (estudiantes.length === 0) {
            const mensaje = modalidad
            ? `No se encontraron estudiantes archivados con modalidad ${modalidad}.`
            : "No se encontraron estudiantes para exportar.";
            toast.info(mensaje);
            return;
        }
        const dataFormateada = formatEstudiantesForXLS(estudiantes);
        const formatDate = (d: Date) => {
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        };
        const nombreArchivo = `estudiantes_${tipo === "completados" ? "archivados" : "activos"}${
            modalidad ? "_" + modalidad.toLowerCase() : ""
        }_${formatDate(new Date())}`;
        exportToExcel(dataFormateada, nombreArchivo);
        toast.success("Exportación realizada con éxito.");
        } catch (error: any) {
            console.error("Error al exportar estudiantes:", error);
            toast.error(error.response?.data?.message || "Ocurrió un error al exportar.");
        }
    };
    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        handleExportEstudiantes,
    };
};
