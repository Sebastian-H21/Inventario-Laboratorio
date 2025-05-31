import React, { useState } from "react";
import Table from "../../components/Table";
import ModalForm from "../../components/Ventana";
import Sidebar from "../../components/Sidebar";
import { ColumnDef } from "@tanstack/react-table";
import { Estudiante } from "../../types";
import useFetchEstudiantes from "./hooks/useFetchEstudiantes";
import { useEstudiantesHandlers } from "./hooks/useEstudiantesHandlers";
import { ModalExportar } from "../../components/Exportar";

const ViewEstudiantes: React.FC = () => {
    const [verArchivados, setVerArchivados] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const { data, setData, loading } = useFetchEstudiantes(verArchivados);

        const {
            handleEdit,
            handleDelete,
            handleRestore,
            handleSubmit,
            handleExportEstudiantes
        } = useEstudiantesHandlers({
            data,
            setData,
            setIsModalOpen,
            setEditingEstudiante,
            editingEstudiante,
        });

        const columns: ColumnDef<Estudiante>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "numero_control", header: "Numero control" },
        { accessorKey: "nombre", header: "Nombre" },
        { accessorKey: "apellido", header: "Apellidos" },
        { accessorKey: "carrera", header: "Carrera" },
        { accessorKey: "semestre", header: "Semestre" },
        { accessorKey: "modalidad", header: "Modalidad" },
        {
            header: "Acciones",
            cell: ({ row }) => {
                const estudiante = row.original;
                return verArchivados ? (
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md cursor-pointer"
                    onClick={() => handleRestore(estudiante.id)}
                >
                    Restaurar
                </button>
                ):(
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
                        onClick={() => handleEdit(estudiante)}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md cursor-pointer"
                        onClick={() => handleDelete(estudiante.id)}
                    >
                        Archivar
                    </button>
                </div>
                );
            }
        }
    ];


    const fields = [
        { name: "numero_control", label: "Numero de control", type: "text", placeholder: "Ingrese el NC", minLength: 9, maxLength: 9,required: true, pattern: "^[0-9]{9}$",
            title: "El numero de control debe ser de 9 numeros" },
        { name: "nombre", label: "Nombre", type: "text", placeholder: "Ingrese el nombre del estudiante",maxLength: 30,required: true,pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$"},
        { name: "apellido", label: "Apellido", type: "text", placeholder: "Ingrese los apellidos",maxLength: 50,required: true,pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$" },
        { name: "carrera", label: "Carrera", type: "select", placeholder: "Ingrese la carrera",options: [
            { value: "Mecatronica", label: "Ingeniería en Mecatronica" },
            { value: "Industrial", label: "Ingeniería Industrial" },
            { value: "Maestria", label: "Maestria" },
            { value: "TIC's", label: "Ingeniería en TIC´s" },
            { value: "Ingeniería Ia", label: "Ingeniería en Inteligencia Artificial" },
            { value: "Logistica", label: "Ingeniería Logística" },
            { value: "Gestion", label: "Ingeniería en Gestión Empresarial" },
            { value: "Indefinido", label: "otro" },
        ],required: true},
        { name: "semestre", label: "Semestre", type: "select",options: [
            { value: "1", label: "1er Semestre" },
            { value: "2", label: "2do Semestre" },
            { value: "3", label: "3er Semestre" },
            { value: "4", label: "4to Semestre" },
            { value: "5", label: "5to Semestre" },
            { value: "6", label: "6to Semestre" },
            { value: "7", label: "7mo Semestre" },
            { value: "8", label: "8vo Semestre" },
            { value: "9", label: "9vo Semestre" },
            { value: "10", label: "10mo Semestre" },
            { value: "11", label: "11vo Semestre" },
            { value: "12", label: "12vo Semestre" },
        ],required: true },
        { name: "modalidad", label: "Modalidad", type: "select",options: [
            { value: "Escolarizada", label: "Escolarizada" },
            { value: "Mixta", label: "Mixta" },
            { value: "Otra", label: "Otra" },
        ],required: true },
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
                setEditingEstudiante(null);
                setIsModalOpen(true);
            }}
            />

            {verArchivados && data.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay estudiantes archivados.</p>
            )}

            <ModalForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingEstudiante}
            fields={fields}
            />

            <ModalExportar
            key={isExportModalOpen ? "open" : "closed"} // Fuerza un rerender
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExportEstudiantes}
            mostrarFechas={false}
            recurso="Estudiantes"
            />            
        </div>
        </div>
    );
};
export default ViewEstudiantes;
