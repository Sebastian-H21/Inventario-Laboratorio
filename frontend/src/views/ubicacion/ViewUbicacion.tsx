import React, { useState } from "react";
import Table from "../../components/Table";
import ModalForm from "../../components/Ventana";
import Sidebar from "../../components/Sidebar";
import { ColumnDef } from "@tanstack/react-table";
import { Ubicacion} from "../../types";
import {useUbicaciones} from "./hooks/useUbicaciones";
import { useUbicacionsHandlers } from "./hooks/useUbicacionesHandlers";
const ViewUbicacion: React.FC = () => {
    const [verArchivados, setVerArchivados] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUbicacion, setEditingUbicacion] = useState<Ubicacion | null>(null);
    const { data =[] , isLoading } = useUbicaciones(verArchivados);
    const {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit
    } = useUbicacionsHandlers({
        data,
        
        setIsModalOpen,
        setEditingUbicacion,
        editingUbicacion,
    });
    const columns: ColumnDef<Ubicacion>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "nombre", header: "Nombre" },
        {
            header: "Acciones",
            cell: ({ row }) => {
                const ubicacion = row.original;
                return verArchivados ? (
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => handleRestore(ubicacion.id)}
                >
                    Restaurar
                </button>
                ) : (
                <div className="flex gap-2">
                    <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => handleEdit(ubicacion)}
                    >
                    Editar
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => handleDelete(ubicacion.id)}
                    >
                    Archivar
                    </button>
                </div>
                );
            },
        },
    ];
    const fields = [
        { name: "nombre", label: "Nombre", type: "text", placeholder: "Ingrese el nombre de la ubicación", maxLength: 30, required: true, pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\\s]+$",
            autoFocus: true
        }
    ];
    if (isLoading) {
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
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-800">
            <Sidebar />
            <div className="p-4 flex-1 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 cursor-pointer"
                        onClick={() => setVerArchivados(!verArchivados)}
                    >
                        {verArchivados ? "Ver Activos" : "Ver Archivados"}
                    </button>
                    <div className="flex-1 text-center font-bold text-black dark:text-white text-3xl">
                        {verArchivados ? "Ubicaciones Archivadas" : "Ubicaciones Activas" }
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
                        setEditingUbicacion(null);
                        setIsModalOpen(true);
                    }}
                />
                {verArchivados && data.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No hay ubicaciones archivadas.</p>
                )}
                <ModalForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit as unknown as (data: Record<string, any>) => void}
                    initialData={editingUbicacion}
                    fields={fields}
                />
            </div>
        </div>
    );
};
export default ViewUbicacion;
