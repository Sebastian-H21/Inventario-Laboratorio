import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel, // Agregar para el filtrado
    ColumnDef,
    flexRender,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
    onAdd?: () => void;
    showArchived?: boolean;
}

const Table = <T extends { id: number }>({
    data,
    columns,
    onAdd,
}: TableProps<T>) => {
    const [filtering, setFiltering] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
});

const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), 
    state: {
        globalFilter: filtering, 
        sorting,
        pagination,
    },
    onGlobalFilterChange: setFiltering, 
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString", 
});

return (
    <div>
        {/* Barra de búsqueda y botón de agregar */}
        <div className="flex justify-between items-center mb-4">
            <input
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar..."
                type="text"
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
            />
            {onAdd && (
            <button
                onClick={onAdd}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
            >
                Agregar Nuevo Registro
            </button>
            )}
        </div>
        {/* Tabla */}
        <div className="flex-1 p-4">
            <div className="w-full overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full table-auto bg-white dark:bg-gray-800">
                        <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-100 dark:bg-gray-700">
                            {headerGroup.headers.map((header) => (
                                <th
                                key={header.id}
                                className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer"
                                onClick={header.column.getToggleSortingHandler()}
                                >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" ? " 🔼" : ""}
                                {header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                                </th>
                            ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="border-b border-gray-200 dark:border-gray-600">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                key={cell.id}
                                className="px-4 py-2 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800"
                                >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {/* Controles de Paginación */}
                <div className="flex justify-between items-center mt-4">
                    {/* Selector de cantidad de registros por página */}
                    <div>
                        <label className="mr-2 text-sm font-medium text-gray-600 dark:text-white">
                            Registros por página:
                        </label>
                        <select
                            className="px-2 py-1 border rounded-md text-black dark:text-white "
                            value={pagination.pageSize}
                            onChange={(e) =>
                                setPagination((prev) => ({
                                    ...prev,
                                    pageSize: Number(e.target.value),
                                        pageIndex: 0,
                                    }))
                                }
                            >
                            {[10, 20, 30, 50].map((size) => (
                                <option key={size} value={size} className="text-black">
                                {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Botones de paginación */}
                    <div className="flex gap-2">
                        <button
                            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 cursor-pointer"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </button>
                        <span className="text-gray-600 dark:text-white">
                            Página {table.getState().pagination.pageIndex + 1} de{" "}
                            {table.getPageCount()}
                        </span>
                        <button
                            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 cursor-pointer"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Siguiente
                        </button>
                    </div>
            </div>
        </div>
    </div>
);
};
export default Table;
