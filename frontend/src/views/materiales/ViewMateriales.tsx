import React, { useState } from "react";
import Table from "../../components/Table";
import ModalForm from "../../components/Ventana";
import Sidebar from "../../components/Sidebar";
import { ColumnDef } from "@tanstack/react-table";
import { Material } from "../../types";
import { ModalExportar } from "../../components/Exportar";
import useFetchMateriales from "./hooks/useFetchMateriales";
import { useMaterialesHandlers } from "./hooks/useMaterialesHandlers";

const ViewMateriales: React.FC = () => {
    const [verArchivados, setVerArchivados] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const { data, setData, loading } = useFetchMateriales(verArchivados);

    const {
    handleEdit,
    handleDelete,
    handleRestore,
    handleSubmit,
    marcas,
    categorias,
    ubicaciones,
    laboratorios,
    handleExportMateriales
    } = useMaterialesHandlers({
        data,
        setData,
        setIsModalOpen,
        setEditingMaterial,
        editingMaterial,
    });

    const columns: ColumnDef<Material>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "codigo", header: "Código" },
        { accessorKey: "nombre", header: "Nombre" },
        { accessorKey: "cantidad", header: "Cantidad" },
        {
        header: "Marca",
        accessorFn: (row) => row.marca?.nombre || "Sin marca"
        },
        { accessorKey: "modelo", header: "Modelo" },
        {
        header: "Categoría",
        accessorFn: (row) => row.categoria?.nombre || "Sin categoría"
        },
        {
        header: "Ubicación",
        accessorFn: (row) => row.ubicacion?.nombre || "Sin ubicación"
        },
        { accessorKey: "observaciones", header: "Comentarios" },
        {
        header: "Laboratorio",
        accessorFn: (row) => row.laboratorio?.nombre || "Sin datos"
        },
        {
            header: "Acciones",
            cell: ({ row }) => {
                const material = row.original;
                return verArchivados ? (
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => handleRestore(material.id)}
                >
                    Restaurar
                </button>
                ):(
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                        onClick={() => handleEdit(material)}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                        onClick={() => handleDelete(material.id)}
                    >
                        Archivar
                    </button>
                </div>
                );
            }
        }
    ];

    const fields = [
        { name: "codigo", label: "Código", type: "text", placeholder: "Ingrese el codigo", minLength: 10, maxLength: 10,required: true, pattern: "^[0-9]{10}$",autoFocus: true},
        { name: "nombre", label: "Nombre", type: "text", placeholder: "Ingrese el nombre del material",maxLength: 30,required: true,pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ0-9.,\\s]*$"},
        { name: "cantidad", label: "Cantidad", type: "number", placeholder: "Ingrese la cantidad",required: true,min: 1, max: 200 },
        { name: "observaciones", label: "Comentarios", type: "text", placeholder: "Comentario (opcional)",maxLength: 50,pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ0-9.,\\s]*$"},
        {name: "id_marca",label: "Marca",type: "select",required: true,
            options: marcas.map(m => ({
                value: m.id,
                label: `${m.id} (${m.nombre})`
                })),
        },
        {name: "modelo", label: "Modelo", type: "text", placeholder: "Ingrese el modelo del material",maxLength: 50,required: true,pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ0-9.,\\s-_]*$"},

        {name: "id_categoria",label: "Categoría",type: "select",required: true,
            options: categorias.map(c => ({
                value: c.id,
                label: `${c.id} (${c.nombre})`
                }))
        },
        {name: "id_ubicacion",label: "Ubicacion",type: "select",required: true,
            options: ubicaciones.map(u => ({
                value: u.id,
                label: `${u.id} (${u.nombre})`
                }))
        },
        {name: "id_laboratorio",label: "Laboratorio",type: "select",required: true,
            options: laboratorios.map(l => ({
                value: l.id,
                label: `${l.id} (${l.nombre})`
                }))
        },
    ]


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
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-800">
        <Sidebar />
        <div className="p-4 flex-1 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <button
                            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 cursor-pointer"
                            onClick={() => setVerArchivados(!verArchivados)}
                        >
                            {verArchivados ? "Ver Materiales" : "Ver Archivados"}
                        </button>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                        >
                            Exportar
                        </button>
                    </div>
                    <div className="flex-1 text-center font-bold text-black dark:text-white text-3xl">
                        {verArchivados ? "Materiales Archivados" : "Materiales Activos"}
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
                setEditingMaterial(null);
                setIsModalOpen(true);
            }}
            />

            {verArchivados && data.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay materiales archivados.</p>
            )}

            <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingMaterial}
            fields={fields}
            />

            <ModalExportar
                key={isExportModalOpen ? "open" : "closed"} 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExportMateriales}
                mostrarFechas={false}
                recurso="materiales"
                laboratorios={laboratorios}
            />
        </div>
        </div>
    );
};
export default ViewMateriales;
