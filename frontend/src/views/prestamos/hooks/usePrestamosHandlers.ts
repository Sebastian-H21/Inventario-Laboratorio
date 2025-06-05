import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Prestamo, Material } from "../../../types";
import { deletePrestamo, saveOrUpdatePrestamo } from "../services/prestamosServices";
import api from "../../../utils/api";
import { Dispatch, SetStateAction } from "react";
import { exportToExcel, formatPrestamosForXLS } from '../../../utils/exportToExcel'

interface Params {
    setData: Dispatch<SetStateAction<Prestamo[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingPrestamo: (prestamo: Prestamo | null) => void;
    editingPrestamo: Prestamo | null;
    prestamos: Prestamo[];
}

export const usePrestamosHandlers = ({
    setData,
    setIsModalOpen,
    setEditingPrestamo,
    editingPrestamo,
}: Params) => {
    const [maestros, setMaestros] = useState<{ rfc: string; nombre: string; apellido: string }[]>([]);
    const [materias, setMaterias] = useState<{ id: number; nombre: string }[]>([]);
    const [materiales, setMateriales] = useState<Material[]>([]);

    useEffect(() => {
        const fetchMaestros = async () => {
            try {
                const response = await api.get("/maestros");
                setMaestros(response.data);
            } catch (error) {
                console.error("Error al obtener maestros:", error);
            }
        };
        fetchMaestros();
    }, []);

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await api.get("/materias");
                setMaterias(response.data);
            } catch (error) {
                console.error("Error al obtener materias:", error);
            }
        };
        fetchMaterias();
    }, []);

    useEffect(() => {
        const fetchMateriales = async () => {
            try {
                const response = await api.get("/materials");
                setMateriales(response.data);
            } catch (error) {
                console.error("Error al cargar los materiales:", error);
            }
        };
        fetchMateriales();
    }, []);

    const handleEdit = (prestamo: Prestamo) => {
        setEditingPrestamo({
            id: prestamo.id,
            fecha_prestamo: prestamo.fecha_prestamo,
            fecha_devolucion: prestamo.fecha_devolucion,
            practica: prestamo.practica,
            id_estudiante: prestamo.id_estudiante,
            id_maestro: prestamo.id_maestro,
            id_materia: prestamo.id_materia,
            materiales: prestamo.materiales_detalle?.map((d) => d.material?.codigo) || [],
            numero_control: prestamo.estudiante?.numero_control ?? "",
            rfc: prestamo.maestro?.rfc ?? "",
            nombre: prestamo.materia?.nombre ?? "",
            estudiante: prestamo.estudiante,
            maestro: prestamo.maestro,
            materia: prestamo.materia,
        });
        console.log("Préstamo al editar:", prestamo);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas marcar como completado este préstamo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, completar!",
        });

        if (result.isConfirmed) {
            try {
                await deletePrestamo(id);
                setData((prev) => prev.filter((item) => item.id !== id));
                Swal.fire("Completo!", "El préstamo fue finalizado correctamente.", "success");
            } catch (error) {
                console.error(error);
                Swal.fire("Error!", "Hubo un problema al completar el préstamo.", "error");
            }
        }
    };

    const handleRestore = async (id: number) => {
        try {
            await api.post(`/prestamos/${id}/restaurar`);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Restaurado", "El préstamo ha sido restaurado.", "success");
        } catch (error) {
            console.error("Error al restaurar", error);
            Swal.fire("Error", "No se pudo restaurar el préstamo", "error");
        }
    };

const handleSubmit = async (prestamo: Prestamo) => {
    try {
        const formatDateToMySQL = (fecha: string) => {
            const date = new Date(fecha);
            const offset = date.getTimezoneOffset() * 60000;
            const localDate = new Date(date.getTime() - offset);
            return localDate.toISOString().slice(0, 19).replace("T", " ");
        };

        const isFechaDevolucionValida = (fechaDevStr: string): boolean => {
            const fechaDev = new Date(fechaDevStr);
            const ahora = new Date();
            return fechaDev.getTime() >= ahora.getTime();
        };

        if (!isFechaDevolucionValida(prestamo.fecha_devolucion)) {
            toast.error("La fecha y hora de devolución no puede ser anterior a la actual.");
            return;
        }

        prestamo.fecha_devolucion = formatDateToMySQL(prestamo.fecha_devolucion);

        // Validación de materiales
        const codigosDisponibles = materiales.map((m) => m.codigo);
        const codigosPrestamo = prestamo.materiales || [];

        const codigosInvalidos = codigosPrestamo.filter((c) => !codigosDisponibles.includes(c));
        if (codigosInvalidos.length > 0) {
            toast.error(`Los siguientes códigos no existen: ${codigosInvalidos.join(", ")}`);
            return;
        }

        const codigosDuplicados = codigosPrestamo.filter((c, i, arr) => arr.indexOf(c) !== i);
        if (codigosDuplicados.length > 0) {
            toast.error(`Los siguientes códigos están repetidos: ${[...new Set(codigosDuplicados)].join(", ")}`);
            return;
        }

        const isEdit = !!editingPrestamo;
        const response = await saveOrUpdatePrestamo(prestamo, isEdit);

        setData((prev) =>
            isEdit
                ? prev.map((item) => (item.id === prestamo.id ? response.data : item))
                : [...prev, response.data]
        );

        toast.success(isEdit ? "Préstamo actualizado exitosamente" : "Préstamo registrado exitosamente");
        setIsModalOpen(false);
        setEditingPrestamo(null);
    } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Ocurrió un error inesperado.");
    }
};


    const handleExportFiltrado = async ({
        tipo,
        fechaInicio,
        fechaFin,
    }: {
        tipo: "activos" | "completados";
        fechaInicio?: Date;
        fechaFin?: Date;
    }) => {
        try {
            const response = await api.get(`/prestamos`, {
                params: {
                    verArchivados: tipo === "completados",
                },
            });

            const prestamos = response.data;
            const ahora = new Date();

            // Validaciones para tipo "completados"
            if (tipo === "completados") {
                if (!fechaInicio || !fechaFin) {
                    toast.error("Debes seleccionar ambas fechas para exportar préstamos completados.");
                    return;
                }

                if (fechaInicio > fechaFin) {
                    toast.error("La fecha de inicio no puede ser mayor a la fecha de fin.");
                    return;
                }

                // Normalizar fechas para cubrir todo el día
                const fechaInicioNormalizada = new Date(fechaInicio);
                fechaInicioNormalizada.setHours(0, 0, 0, 0);

                const fechaFinNormalizada = new Date(fechaFin);
                fechaFinNormalizada.setHours(23, 59, 59, 999);

                const prestamosFiltrados = prestamos.filter((p: any) => {
                    if (tipo === "completados") {
                        const fechaDevolucionReal = new Date(p.deleted_at);
                        const enRango = fechaDevolucionReal >= fechaInicioNormalizada && fechaDevolucionReal <= fechaFinNormalizada;
                        return !!p.deleted_at && enRango;
                    } else {
                        const fechaDevolucion = new Date(p.fecha_devolucion);
                        return !p.deleted_at && fechaDevolucion >= ahora;
                    }
                });
                if (prestamosFiltrados.length === 0) {
                    toast.info("No se encontraron préstamos para exportar.");
                    return;
                }

                const dataFormateada = formatPrestamosForXLS(prestamosFiltrados, tipo);
                const formatDate = (d: Date) => d.toISOString().slice(0, 10);
                const nombreArchivo = `prestamos_${tipo}_${formatDate(fechaInicio)}_a_${formatDate(fechaFin)}`;

                exportToExcel(dataFormateada, nombreArchivo);
                toast.success("Exportación realizada con éxito.");
            } else {
                // Exportación de préstamos activos
                const prestamosFiltrados = prestamos.filter((p: any) => !p.deleted_at);

                if (prestamosFiltrados.length === 0) {
                    toast.info("No se encontraron préstamos para exportar.");
                    return;
                }

                const dataFormateada = formatPrestamosForXLS(prestamosFiltrados, tipo);
                const formatDate = (d: Date) => d.toISOString().slice(0, 10);
                const nombreArchivo = `prestamos_${tipo}_${formatDate(new Date())}`;

                exportToExcel(dataFormateada, nombreArchivo);
                toast.success("Exportación realizada con éxito.");
            }
        } catch (error) {
            console.error("Error al exportar los préstamos:", error);
            toast.error("Hubo un error al exportar los préstamos.");
        }
    };


    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        maestros,
        materiales,
        materias,
        handleExportFiltrado,
    };
};
