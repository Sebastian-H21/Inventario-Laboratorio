import React, { useState } from "react";
import Table from "../../components/Table";
import ModalForm from "../../components/Ventana";
import Sidebar from "../../components/Sidebar";
import { ColumnDef } from "@tanstack/react-table";
import { Maestro } from "../../types";
import useFetchMaestros from "./hooks/useFetchMaestros";
import { useMaestrosHandlers } from "./hooks/useMaestrosHandlers";
import { ModalExportar } from "../../components/Exportar";

const ViewMaestros: React.FC = () => {
    const [verArchivados, setVerArchivados] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaestro, setEditingMaestro] = useState<Maestro | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const { data, setData, loading } = useFetchMaestros(verArchivados);

    const {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        handleExportMaestros
    } = useMaestrosHandlers({
        data,
        setData,
        setIsModalOpen,
        setEditingMaestro,
        editingMaestro,
    });

    const columns: ColumnDef<Maestro>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "rfc", header: "Rfc" },
        { accessorKey: "nombre", header: "Nombre" },
        { accessorKey: "apellido", header: "Apellidos" },
        {
        header: "Acciones",
        cell: ({ row }) => {
            const maestro = row.original;
            return verArchivados ? (
            <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer"
                onClick={() => handleRestore(maestro.id)}
            >
                Restaurar
            </button>
            ) : (
            <div className="flex gap-2">
                <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                onClick={() => handleEdit(maestro)}
                >
                Editar
                </button>
                <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                onClick={() => handleDelete(maestro.id)}
                >
                Archivar
                </button>
            </div>
            );
        },
        },
    ];

    const fields = [
        { name: "rfc", label: "Rfc", type: "text", placeholder: "Ingrese el RFC", minLength: 13, maxLength: 13, required: true, pattern: "^[A-Z]{4}\\d{6}[A-Z0-9]{3}$" },
        { name: "nombre", label: "Nombre", type: "text", placeholder: "Ingrese el nombre del maestro", maxLength: 30, required: true, pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$" },
        { name: "apellido", label: "Apellido", type: "text", placeholder: "Ingrese los apellidos", maxLength: 50, required: true, pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$" },
    ];

    if (loading) {
        return (
        <div className="text-center">
            <div role="status">
            <svg className="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101">
                <path d="M100 50.6C100 78.2 77.6 100.6 50 100.6S0 78.2 0 50.6C0 23 22.4 0.6 50 0.6S100 23 100 50.6Z" fill="currentColor" />
                <path d="M94 39c2.4-.6 3.9-3.1 3-5.5a47 47 0 0 0-8.2-15.2A49.9 49.9 0 0 0 75.2 7.4a48.5 48.5 0 0 0-18.4-6.4c-5-.7-10.1-.6-15 
                        .2-2.5.4-4 2.9-3.4 5.3.6 2.4 3.1 4 5.5 3.7a41.3 41.3 0 0 1 21.6 4.6 41.2 41.2 0 0 1 17.1 18.4c.9 2.3 3.4 3.6 5.9 3Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Cargando...</span>
            </div>
        </div>
        );
    }

    return (
        <div className="flex bg-white dark:bg-gray-800">
        <Sidebar />
        <div className="p-4 flex-1">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 cursor-pointer"
                        onClick={() => setVerArchivados(!verArchivados)}
                    >
                        {verArchivados ? "Ver Estudiantes" : "Ver Archivados"}
                    </button>
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Exportar
                    </button>
                </div>
                <div className="flex-1 text-center font-bold text-black dark:text-white text-3xl">
                        Estudiantes
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
                setEditingMaestro(null);
                setIsModalOpen(true);
            }}
            />

            {verArchivados && data.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay maestros archivados.</p>
            )}

            <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingMaestro}
            fields={fields}
            />

            <ModalExportar
            key={isExportModalOpen ? "open" : "closed"} // Fuerza un rerender
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExportMaestros}
            mostrarFechas={false}
            recurso="Maestros"
            />                
        </div>
        </div>
    );
};
export default ViewMaestros;
