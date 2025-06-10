import { deleteEstudiante, saveOrUpdateEstudiante } from "../services/estudianteServices";
import { Estudiante } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { exportToExcel, formatEstudiantesForXLS } from "../../../utils/exportToExcel";

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

            let estudiantes = response.data as Estudiante[];

            // Filtrar por modalidad si se especifica
            if (modalidad) {
            estudiantes = estudiantes.filter((e) => e.modalidad === modalidad);
            }

            // Validar si hay resultados luego de filtrar (o si no hay nada desde el inicio)
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

            const nombreArchivo = `estudiantes_${
            tipo === "completados" ? "archivados" : "activos"
            }${modalidad ? "_" + modalidad.toLowerCase() : ""}_${formatDate(new Date())}`;

            exportToExcel(dataFormateada, nombreArchivo);
            toast.success("Exportación realizada con éxito.");
        } catch (error: any) {
            console.error("Error al exportar estudiantes:", error);
            toast.error(error.response?.data?.message || "Ocurrió un error al exportar.");
        }
    };

    return { handleEdit, 
            handleDelete, 
            handleRestore, 
            handleSubmit,
            handleExportEstudiantes
        };
};
