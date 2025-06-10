import { deleteMaestro, saveOrUpdateMaestro } from "../services/maestrosServices";
import { Maestro } from "../../../types";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { exportToExcel, formatMaestrosForXLS } from "../../../utils/exportToExcel";
import { validarRFCConFecha } from "../../../utils/validarRFC";

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

        // ⚠️ Validación del RFC antes de guardar
        if (!validarRFCConFecha(maestro.rfc)) {
            toast.error("El RFC no es válido: debe contener una fecha real y ser mayor de edad.");
            return;
        }

        const maestroArchivado = data.find(
            (item) =>
                item.rfc === maestro.rfc &&
                item.deleted_at !== null &&
                (!isEdit || item.id !== maestro.id)
        );

        if (maestroArchivado) {
            toast.error(`Ya existe un maestro archivado con el RFC "${maestro.rfc}". Por favor, restaúralo.`);
            return;
        }

        const rfcDuplicado = data.some(
            (item) =>
                item.rfc === maestro.rfc &&
                item.deleted_at === null &&
                (!isEdit || item.id !== maestro.id)
        );

        if (rfcDuplicado) {
            toast.error(`Ya existe un maestro activo con el RFC "${maestro.rfc}".`);
            return;
        }

        const response = await saveOrUpdateMaestro(maestro, isEdit);

        setData((prev) =>
            isEdit
                ? prev.map((m) => (m.id === maestro.id ? response.data : m))
                : [...prev, response.data]
        );

        toast.success(isEdit ? "Maestro actualizado exitosamente" : "Maestro registrado exitosamente");
        setIsModalOpen(false);
    } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
    }
};


    const handleExportMaestros = async ({ tipo }: { tipo: "activos" | "completados" }) => {
            try {
                const response = await api.get("/maestros", {
                    params: { verArchivados: tipo === "completados" },
                });

                const maestros = response.data;

                if (maestros.length === 0) {
                    toast.info("No se encontraron maestros para exportar.");
                    return;
                }

                const dataFormateada = formatMaestrosForXLS(maestros);

                const formatDate = (d: Date) => {
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${day}-${month}-${year}`;
                };
                const nombreArchivo = `maestros_${tipo === "completados" ? "archivados" : "activos"}_${formatDate(new Date())}.xlsx`;

                exportToExcel(dataFormateada, nombreArchivo);
                toast.success("Exportación realizada con éxito.");
            } catch (error) {
                console.error("Error al exportar maestros:", error);
                toast.error("Ocurrió un error al exportar.");
            }
        };


    return { handleEdit, 
            handleDelete, 
            handleRestore, 
            handleSubmit,
            handleExportMaestros
        };
};