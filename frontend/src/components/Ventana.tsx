import React, { useState, useEffect } from "react";
import api from "../utils/api";

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, any>) => void;
    initialData?: Record<string, any> | null;
    fields: {
        name: string;
        label: string;
        type: string;
        placeholder: string;
        minLength: number;
        maxLength: number;
        required?: boolean;
        pattern?: string;
        options?: { value: string; label: string }[];
        min?: number; 
        max?: number;
        title?: string;
        
    }[];
}

    const ModalForm: React.FC<ModalFormProps> = ({
        isOpen,
        onClose,
        onSubmit,
        initialData,
        fields
    }) => {

    const [formData, setFormData] = useState(initialData || {})


    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [materialCodigo, setMaterialCodigo] = useState("");
    const [materialesSeleccionados, setMaterialesSeleccionados] = useState<string[]>( []);
    const handleAgregarMaterial = () => {
        const codigo = materialCodigo.trim();
        if (!codigo) return;
        if (materialesSeleccionados.includes(codigo)) {
            alert("Este material ya fue agregado.");
            return;
        }
    if (!materialesDisponiblesData.some(m => m.codigo === codigo)) {
        alert("El código ingresado no es válido.");
        return;
    }
        setMaterialesSeleccionados(prev => [...prev, codigo]);
        setMaterialCodigo("");
    };
    const handleEliminarMaterial = (codigo: string) => {
        setMaterialesSeleccionados(prev => prev.filter(c => c !== codigo));
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (fields.some(field => field.name === "materiales" && field.required) && materialesSeleccionados.length === 0) {
            alert("Debe agregar al menos un material.");
            return;
        }
        e.preventDefault();
        const dataConMateriales = {
            ...formData,
            materiales: materialesSeleccionados
        };
        onSubmit(dataConMateriales);
        if (!initialData) {
            setFormData({});
            setMaterialesSeleccionados([]);
        }
        
        onClose();
    };

    const [estudiantes, setEstudiantes] = useState<{ numero_control: string; nombre: string; apellido: string }[]>([]);
    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const response = await api.get("/estudiantes");
                setEstudiantes(response.data); 
            } catch (error) {
                console.error("Error al obtener estudiantes:", error);
            }
        };
        fetchEstudiantes();
    }, []);

    const [materialesDisponiblesData, setMaterialesDisponiblesData] = useState<{ codigo: string, nombre: string }[]>([]);
    useEffect(() => {
        const fetchMateriales = async () => {
            try {
            const response = await api.get("/materials");
            const data = response.data;
            
            setMaterialesDisponiblesData(data); 
            } catch (error) {
            console.error("Error al obtener materiales:", error);
            }
        };
        fetchMateriales();
        }, []);

    useEffect(() => {
        setMaterialesSeleccionados(initialData?.materiales || []);
    }, [initialData]);
if (!isOpen) return null;

return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">
                {initialData ? "Editar" : "Nuevo"} Registro
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields
                .filter((field) => {
                    if (field.name === "fecha_devolucion" && initialData) return false;
                    return true;
                })
                .map((field) => (
                <div key={field.name} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                    {field.label}
                    </label>
                    {field.name === "materiales" ? (
                    <div className="mb-4">
                        <div className="flex gap-2">
                        <input
                            type="text"
                            value={materialCodigo}
                            onChange={(e) => setMaterialCodigo(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAgregarMaterial();
                                }
                            }}
                            placeholder={field.placeholder}
                            className="w-full p-2 border rounded-md"
                        />
                        <button
                            type="button"
                            onClick={handleAgregarMaterial}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            Agregar
                        </button>
                        <button
                            type="button"
                            onClick={() => setMaterialCodigo("")}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Limpiar
                        </button>
                        </div>
                            <ul className="mt-2 pl-4 list-disc max-h-32 overflow-y-auto border rounded p-2">
                            {materialesSeleccionados.map((codigo) => {
                                const material = materialesDisponiblesData.find(m => m.codigo === codigo);
                                return (
                                <li key={codigo} className="flex justify-between items-center">
                                    <span>{codigo}{material ? ` - ${material.nombre}` : ""}</span>
                                    <button
                                    type="button"
                                    onClick={() => handleEliminarMaterial(codigo)}
                                    className="text-red-500 text-sm ml-2"
                                    >
                                    Eliminar
                                    </button>
                                </li>
                                );
                            })}
                            </ul>
                        </div>
                    ) : field.type === "select" ? (
                    <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Seleccione una opción</option>
                        {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                        ))}
                    </select>
                    ) : field.name === "contrasena" ? (
                    <input
                        id={field.name}
                        type="password"
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        pattern={field.pattern}
                        className="w-full p-2 border rounded-md"
                        title={field.title}
                    />
                    ) : field.name === "numero_control" ? (
                    <div>
                        <input
                        id={field.name}
                        type="text"
                        name={field.name}
                        list="lista-estudiantes"
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full p-2 border rounded-md"
                        title={field.title}
                        />
                        <datalist id="lista-estudiantes">
                        {estudiantes.map((est) => (
                            <option
                            key={est.numero_control}
                            value={est.numero_control}
                            >
                            {`${est.numero_control} (${est.nombre} ${est.apellido})`}
                            </option>
                        ))}
                        </datalist>
                    </div>
                    ) : (
                    <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        pattern={field.pattern}
                        min={field.min}
                        max={field.max}
                        className="w-full p-2 border rounded-md"
                        title={field.title}
                    />
                    )}
                </div>
                ))}
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default ModalForm;
