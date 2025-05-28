import * as XLSX from "xlsx";
import { Estudiante, Maestro, Material, Prestamo } from "../types";


export function exportToExcel(data: any[], fileName: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos");

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
    const formatDateTime = (dateStr?: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

export const formatPrestamosForXLS = (
    prestamos: Prestamo[],
    tipo: "activos" | "completados") => {
    return prestamos.map(p => {
        const base = {
            ID: p.id,
            "Fecha Préstamo": formatDateTime(p.fecha_prestamo),
            "Fecha Devolución (Programada)": formatDateTime(p.fecha_devolucion),
            Estudiante: p.estudiante
                ? `${p.estudiante.nombre} ${p.estudiante.apellido} (${p.estudiante.numero_control})`
                : '',
            Maestro: p.maestro
                ? `${p.maestro.nombre} ${p.maestro.apellido} (${p.maestro.rfc})`
                : '',
            Encargado: p.encargado
                ? `${p.encargado.nombre} ${p.encargado.apellido}`
                : '',
            Materia: p.materia?.nombre ?? '',
            Práctica: p.practica,
            Materiales: p.materiales_detalle?.map(m => m.material?.codigo).join(', ') ?? '',
        };

        if (tipo === "completados") {
            return {
                ...base,
                "Fecha Devolución Real": formatDateTime(p.deleted_at),
            };
        }

        return base;
    });
};


    export const formatMaterialesForXLS = (materiales: Material[]) => {
        return materiales.map(m => ({
            ID: m.id,
            Codigo: m.codigo,
            Nombre: m.nombre,
            Cantidad: m.cantidad,
            Observaciones: m.observaciones,
            Categoria: m.categoria
                ? `${m.categoria.nombre},`
                : '',
            Marca: m.marca
                ? `${m.marca.nombre},`
                : '',            
            Ubicación: m.ubicacion
                ? `${m.ubicacion.nombre},`
                : '', 
        }))
    }

    export const formatEstudiantesForXLS = (estudiantes: Estudiante[]) => {
        return estudiantes.map(e => ({
            ID: e.id,
            Número_Control: e.numero_control,
            Nombre: e.nombre,
            Apellidos: e.apellido,
            Carrera: e.carrera,
            Semestre: e.semestre,
            Modalidad: e.modalidad,
        }))
    }

        export const formatMaestrosForXLS = (maestros: Maestro[]) => {
        return maestros.map(ma => ({
            ID: ma.id,
            RFC: ma.rfc,
            Nombre: ma.nombre,
            Apellidos: ma.apellido,
        }))
    }
