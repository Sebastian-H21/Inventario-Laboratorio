import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

    interface Laboratorio {
    id: number;
    nombre: string;
    }

    interface ModalExportarProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (opts: {
        tipo: "activos" | "completados";
        fechaInicio?: Date;
        fechaFin?: Date;
        laboratorioId?: number;
        modalidad?: "Escolarizada" | "Mixta" | "Otra";
    }) => void;
    mostrarFechas?: boolean;
    recurso: string;
    laboratorios: Laboratorio[];
    }

    export const ModalExportar: React.FC<ModalExportarProps> = ({
    isOpen,
    onClose,
    onExport,
    recurso,
    mostrarFechas = true,
    laboratorios,
    }) => {
    const [tipo, setTipo] = useState<"activos" | "completados">("activos");
    const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
    const [fechaFin, setFechaFin] = useState<Date | null>(null);
    const [laboratorioId, setLaboratorioId] = useState<number | null>(null);
    const [modalidad, setModalidad] = useState<string>("");

    const handleExport = () => {
        if (tipo === "completados" && mostrarFechas) {
        if (!fechaInicio || !fechaFin) {
            alert("Selecciona ambas fechas.");
            return;
        }
        }

        const opts: any = { tipo };

        if (mostrarFechas && tipo === "completados") {
        opts.fechaInicio = fechaInicio!;
        opts.fechaFin = fechaFin!;
        }

        if (["prestamos", "materiales"].includes(recurso)) {
        opts.laboratorioId = laboratorioId ?? undefined;
        }

        if (recurso === "estudiantes") {
        opts.modalidad = modalidad || undefined;
        }

        onExport(opts);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Exportar {recurso}</h2>

            <div className="mb-4">
            <label className="block font-medium mb-1">Tipo:</label>
            <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as "activos" | "completados")}
                className="w-full border rounded px-2 py-1"
            >
                <option value="activos">{recurso} activos</option>
                <option value="completados">
                {recurso} {recurso.toLowerCase() === "prestamos" ? "completados" : "archivados"}
                </option>
            </select>
            </div>

            {tipo === "completados" && mostrarFechas && (
            <>
                <p className="text-sm text-gray-600 mb-2">
                Selecciona el rango de fechas de <strong>devolución real</strong>.
                </p>
                <div className="mb-4">
                <label className="block font-medium mb-1">Desde:</label>
                <DatePicker
                    selected={fechaInicio}
                    onChange={(date) => setFechaInicio(date)}
                    className="w-full border rounded px-2 py-1"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date(2025, 4, 1)}
                />
                </div>
                <div className="mb-6">
                <label className="block font-medium mb-1">Hasta:</label>
                <DatePicker
                    selected={fechaFin}
                    onChange={(date) => setFechaFin(date)}
                    className="w-full border rounded px-2 py-1"
                    dateFormat="yyyy-MM-dd"
                />
                </div>
            </>
            )}

            {/* Laboratorio solo para prestamos y materiales */} 
            {["prestamos", "materiales"].includes(recurso) && (
            <div className="mb-4">
                <label className="block font-medium mb-1">Laboratorio:</label>
                <select
                value={laboratorioId ?? ""}
                onChange={(e) =>
                    setLaboratorioId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full border rounded px-2 py-1"
                >
                <option value="">Todos los laboratorios</option>
                {laboratorios.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                    {lab.id} ({lab.nombre})
                    </option>
                ))}
                </select>
            </div>
            )}

            {/*Modalidad solo para estudiantes */}
            {recurso === "estudiantes" && (
            <div className="mb-4">
            <label className="block font-medium mb-1">Modalidad:</label>
            <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value as "Escolarizada" | "Mixta" | "Otra" | "")}
                className="w-full border rounded px-2 py-1"
            >
                <option value="">Todas</option>
                <option value="Escolarizada">Escolarizada</option>
                <option value="Mixta">Mixta</option>
                <option value="Otra">Otra</option>
            </select>
            </div>
            )}

            <div className="flex justify-end space-x-2">
            <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
                Cancelar
            </button>
            <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                Exportar
            </button>
            </div>
        </div>
        </div>
    );
};
