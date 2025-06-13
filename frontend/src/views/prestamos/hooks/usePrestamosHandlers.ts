import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Prestamo, Material } from "../../../types";
import { deletePrestamo, saveOrUpdatePrestamo } from "../services/prestamosServices";
import api from "../../../utils/api";
import { exportToExcel, formatPrestamosForXLS } from "../../../utils/exportToExcel";
import { queryKeysP } from "../../../utils/queryKeys";

interface Params {
    setIsModalOpen: (open: boolean) => void;
    setEditingPrestamo: (prestamo: Prestamo | null) => void;
    editingPrestamo: Prestamo | null;
    }

    export const usePrestamosHandlers = ({
    setIsModalOpen,
    setEditingPrestamo,
    editingPrestamo,
    }: Params) => {
    const queryClient = useQueryClient();

    const { data: maestros = [] } = useQuery({ queryKey: queryKeysP.maestros.all, queryFn: () => api.get("/maestros").then(res => res.data) });
    const { data: materias = [] } = useQuery({ queryKey: queryKeysP.materias.all, queryFn: () => api.get("/materias").then(res => res.data) });
    const { data: materiales = [] } = useQuery({ queryKey: queryKeysP.materiales.all, queryFn: () => api.get("/materials").then(res => res.data) });
    const { data: laboratorios = [] } = useQuery({ queryKey: queryKeysP.laboratorios.all, queryFn: () => api.get("/laboratorios").then(res => res.data) });

    const deleteMutation = useMutation({
        mutationFn: deletePrestamo,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeysP.prestamos.all });
        Swal.fire("Completado", "El préstamo fue marcado como completado.", "success");
        },
        onError: () => {
        Swal.fire("Error", "Hubo un error al completar el préstamo", "error");
        },
    });

    const restoreMutation = useMutation({
        mutationFn: (id: number) => api.post(`/prestamos/${id}/restaurar`),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeysP.prestamos.all });
        Swal.fire("Restaurado", "El préstamo ha sido restaurado.", "success");
        },
        onError: () => {
        Swal.fire("Error", "No se pudo restaurar el préstamo", "error");
        },
    });

    const saveMutation = useMutation({
        mutationFn: (prestamo: Prestamo) => {
        const isEdit = !!editingPrestamo;
        return saveOrUpdatePrestamo(prestamo, isEdit);
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeysP.prestamos.all });
        setIsModalOpen(false);
        setEditingPrestamo(null);
        toast.success(editingPrestamo ? "Préstamo actualizado" : "Préstamo registrado exitosamente");
        },
        onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Error al guardar el préstamo");
        },
    });

    const handleEdit = (prestamo: Prestamo) => {
        setEditingPrestamo({
        ...prestamo,
        materiales: prestamo.materiales_detalle?.map((d) => d.material?.codigo) || [],
        numero_control: prestamo.estudiante?.numero_control ?? "",
        rfc: prestamo.maestro?.rfc ?? "",
        nombre: prestamo.materia?.nombre ?? "",
        });
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
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    const handleRestore = (id: number) => {
        restoreMutation.mutate(id);
    };

    const handleSubmit = async (prestamo: Prestamo) => {
        const formatDateToMySQL = (fecha: string) => {
        const date = new Date(fecha);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 19).replace("T", " ");
        };

        const fechaDevValida = (f: string) => new Date(f).getTime() >= new Date().getTime();
        if (!fechaDevValida(prestamo.fecha_devolucion)) {
        toast.error("La fecha y hora de devolución no puede ser anterior a la actual.");
        return;
        }

        prestamo.fecha_devolucion = formatDateToMySQL(prestamo.fecha_devolucion);

        const codigosDisponibles = materiales.map((m: Material) => m.codigo);
        const codigosPrestamo = prestamo.materiales || [];
        const codigosInvalidos = codigosPrestamo.filter(c => !codigosDisponibles.includes(c));
        if (codigosInvalidos.length) {
        toast.error(`Códigos no válidos: ${codigosInvalidos.join(", ")}`);
        return;
        }

        const codigosDuplicados = codigosPrestamo.filter((c, i, arr) => arr.indexOf(c) !== i);
        if (codigosDuplicados.length > 0) {
        toast.error(`Códigos repetidos: ${[...new Set(codigosDuplicados)].join(", ")}`);
        return;
        }

        saveMutation.mutate(prestamo);
    };

    const handleExportFiltrado = async ({
        tipo,
        fechaInicio,
        fechaFin,
        laboratorioId,
    }: {
        tipo: "activos" | "completados";
        fechaInicio?: Date;
        fechaFin?: Date;
        laboratorioId?: number;
    }) => {
        try {
        const response = await api.get("/prestamos", {
            params: { verArchivados: tipo === "completados" },
        });
        const prestamos: any[] = response.data;

        const filtrarPorLaboratorio = (p: any) =>
            !laboratorioId || (p.laboratorio?.id ?? p.id_laboratorio) === laboratorioId;

        const laboratorioNombre = laboratorioId
            ? laboratorios.find((l: { id: number; }) => l.id === laboratorioId)?.nombre ?? `lab_${laboratorioId}`
            : "todos_labs";

        const limpiarNombre = (nombre: string) =>
            nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]/gi, "_").toLowerCase();

        const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

        if (tipo === "completados") {
            if (!fechaInicio || !fechaFin) return toast.error("Selecciona ambas fechas.");
            if (fechaInicio > fechaFin) return toast.error("Fecha de inicio no puede ser posterior a la de fin.");

            const inicio = new Date(fechaInicio);
            inicio.setHours(0, 0, 0, 0);
            const fin = new Date(fechaFin);
            fin.setHours(23, 59, 59, 999);

            const filtrados = prestamos.filter((p) => {
            if (!p.deleted_at) return false;
            const fechaDev = new Date(p.deleted_at);
            return fechaDev >= inicio && fechaDev <= fin && filtrarPorLaboratorio(p);
            });

            if (!filtrados.length) return toast.info("No hay préstamos para exportar.");

            exportToExcel(formatPrestamosForXLS(filtrados, tipo),
            `prestamos_completados_${limpiarNombre(laboratorioNombre)}_${formatDate(fechaInicio)}_a_${formatDate(fechaFin)}`);
            toast.success("Exportación completada");
        } else {
            const filtrados = prestamos.filter(p => !p.deleted_at && filtrarPorLaboratorio(p));
            if (!filtrados.length) return toast.info("No hay préstamos activos para exportar.");
            exportToExcel(formatPrestamosForXLS(filtrados, tipo),
            `prestamos_activos_${limpiarNombre(laboratorioNombre)}_${formatDate(new Date())}`);
            toast.success("Exportación completada");
        }
        } catch (error) {
        console.error("Error al exportar préstamos:", error);
        toast.error("Error al exportar los préstamos");
        }
    };

    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        handleExportFiltrado,
        maestros,
        materias,
        materiales,
        laboratorios,
    };
};
