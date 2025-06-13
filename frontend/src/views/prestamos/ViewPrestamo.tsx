import React, { useState} from "react";
import Table from "../../components/Table";
import ModalForm from "../../components/Ventana";
import Sidebar from "../../components/Sidebar";
import {usePrestamos} from "./hooks/usePrestamos";
import { ColumnDef } from "@tanstack/react-table";
import { Prestamo } from "../../types";
import { usePrestamosHandlers } from "./hooks/usePrestamosHandlers";
import { ModalExportar } from "../../components/Exportar";
const ViewPrestamo: React.FC = () => {
    const [verArchivados, setVerArchivados] = useState(false);
    const { data= [], isLoading } = usePrestamos(verArchivados);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrestamo, setEditingPrestamo] = useState<Prestamo | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        materias,
        maestros,
        laboratorios,
        handleExportFiltrado,
    } = usePrestamosHandlers({
        setIsModalOpen,
        setEditingPrestamo,
        editingPrestamo,
    });
        const formatDateTime = (dateStr?: string | null) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
        };
        const getDefaultFechaDevolucion = () => {
            const now = new Date();
            now.setHours(15, 0, 0, 0); 
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        const esPrestamoConFechaPasada = (fechaDevolucion: string): boolean => {
            return new Date(fechaDevolucion) < new Date();
        };
    const columns: ColumnDef<Prestamo>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "fecha_prestamo", header: "Fecha Préstamo",cell: ({ row }) => formatDateTime(row.original.fecha_prestamo) },
        { accessorKey: "fecha_devolucion", header: "Fecha Devolución" ,cell: ({ row }) => formatDateTime(row.original.fecha_devolucion)},
        {
            header: "Estudiante",
            accessorFn: row =>
                row.estudiante
                    ? `${row.estudiante.nombre} ${row.estudiante.apellido} (${row.estudiante.numero_control})`
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        {
            header: "Maestro",
            accessorFn: row =>
                row.maestro
                    ? `${row.maestro.nombre} ${row.maestro.apellido} (${row.maestro.rfc})`
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        {
            header: "Materiales",
            accessorFn: row =>
                row.materiales_detalle && row.materiales_detalle.length > 0
                    ? row.materiales_detalle.map(e => `${e.material?.nombre} (${e.material?.codigo})`).join(", ")
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        {
            header: "Encargado",
            accessorFn: row =>
                row.encargado
                    ? `${row.encargado.id}: ${row.encargado.nombre} ${row.encargado.apellido}`
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        {
            header: "Materia",
            accessorFn: row =>
                row.materia
                    ? `${row.materia.nombre}`
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        { accessorKey: "practica", header: "Práctica" },
        {
            header: "Laboratorio",
            accessorFn: row =>
                row.laboratorio
                    ? `${row.laboratorio.nombre}`
                    : "Sin datos",
            cell: info => info.getValue(),
        },
        ...(verArchivados
            ? [{
                accessorKey: "deleted_at",
                header: "Devolución Real",
                cell: ({ row }: { row: { original: Prestamo } }) => {
                    const fecha = row.original.deleted_at;
                    return fecha ? new Date(fecha).toLocaleString() : "—";
                },
            }]
            : [{
                header: "Acciones",
                cell: ({ row }: { row: { original: Prestamo } }) => {
                    const prestamo = row.original;
                    return (
                        <div className="flex gap-2">
                            {esPrestamoConFechaPasada(prestamo.fecha_devolucion) ? (
                                <span className="text-gray-400 italic">No editable</span>
                                ) : (
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                                    onClick={() => handleEdit(prestamo)}
                                >
                                    Editar
                                </button>
                            )}
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer"
                                onClick={() => handleDelete(prestamo.id)}
                            >
                                Finalizar préstamo
                            </button>
                        </div>
                    );
                }
            }]
        ),
    ];
    const fields = [
        { name: "fecha_devolucion", label: "Fecha devolucion", type: "datetime-local", placeholder: "Ingrese la fecha de devolucion",required: true,defaultValue: getDefaultFechaDevolucion(),},
        { name: "numero_control", label: "Numero de control", type: "text", placeholder: "Ingrese el ID del alumno",required: true,minLength: 9, maxLength: 9,list: "lista-alumnos",
            title: "El numero de control debe ser de 9 numeros" },
        { name: "practica", label: "Práctica", type: "text", placeholder: "Ingrese el nombre de la práctica",maxLength: 50,required: true,pattern: "^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\\s]+$"},
        { name: "id_materia", label: "Materia", type: "select", required: true,
            options: materias.map((ma: { id: any; nombre: any; }) => ({
                value: ma.id,
                label: `${ma.id} (${ma.nombre})`
                }))
        },
        { name: "rfc", label: "Maestro", type: "select", required: true,
            options: maestros.map((m: { rfc: any; nombre: any; apellido: any; }) => ({
                value: m.rfc,
                label: `${m.rfc} (${m.nombre} ${m.apellido})`
                }))        
        },
        { name: "id_laboratorio", label: "Laboratorio", type: "select", required: true,
            options: laboratorios.map((l: { id: any; nombre: any; }) => ({
                value: l.id,
                label: `${l.id} (${l.nombre})`
                }))
        },
        { name: "materiales", label: "Código(s) de materiales", type: "custom", placeholder: "Ej. OSC-ELE-001", minLength: 0, maxLength: 0, required: true},
    ];
    if (isLoading) return (
        <div className="text-center">
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
    return (
        <div className="flex min-h-screen w-full  bg-white dark:bg-gray-800">
            <Sidebar />
            <div className="p-4 flex-1 bg-white dark:bg-gray-800 ">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                            <button
                                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 cursor-pointer"
                                onClick={() => setVerArchivados(!verArchivados)}
                            >
                                {verArchivados ? "Ver Activos" : "Ver Completados"}
                            </button>
                            <button
                                onClick={() => setIsExportModalOpen(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                            >
                                Exportar
                            </button>
                        </div>
                        <div className="flex-1 text-center font-bold text-black dark:text-white text-3xl">
                            {verArchivados ? "Préstamos Completados" : "Préstamos Activos"}
                        </div>
                    </div>
                <Table
                    data={data}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                        showArchived={verArchivados}
                        onAdd={() => {
                            setEditingPrestamo(null);
                            setIsModalOpen(true);
                        }}
                    />
                    {verArchivados && data.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No hay prestamos completados.</p>
                    )}
                    <ModalForm
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        initialData={editingPrestamo}
                        fields={fields}
                    />
                    <ModalExportar
                        isOpen={isExportModalOpen}
                        onClose={() => setIsExportModalOpen(false)}
                        onExport={handleExportFiltrado}
                        mostrarFechas={true}
                        recurso="prestamos"
                        laboratorios={laboratorios}
                    />
            </div>
        </div> 
    );
};
//.
export default ViewPrestamo;
