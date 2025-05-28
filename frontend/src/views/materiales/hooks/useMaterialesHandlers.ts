import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Material,Marca, Categoria, Ubicacion  } from "../../../types";
import { deleteMaterial, saveOrUpdateMaterial } from "../services/materialesServices";
import api from "../../../utils/api";
import { Dispatch, SetStateAction } from "react";
import { exportToExcel, formatMaterialesForXLS } from '../../../utils/exportToExcel'

interface Params {
    data: Material[];
    setData: Dispatch<SetStateAction<Material[]>>;
    setIsModalOpen: (open: boolean) => void;
    setEditingMaterial: (material: Material | null) => void;
    editingMaterial: Material | null;
    }

    export const useMaterialesHandlers = ({
    data,
    setData,
    setIsModalOpen,
    setEditingMaterial,
    editingMaterial,
    }: Params) => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [resMarcas, resCategorias, resUbicaciones] = await Promise.all([
            api.get("/marcas"),
            api.get("/categorias"),
            api.get("/ubicacions"),
            ]);
            setMarcas(resMarcas.data);
            setCategorias(resCategorias.data);
            setUbicaciones(resUbicaciones.data);
        } catch (error) {
            console.error("Error al cargar datos auxiliares:", error);
        }
        };

        fetchData();
    }, []);

    const handleEdit = (material: Material) => {
        setEditingMaterial({
        ...material,
        observaciones: material.observaciones === "Sin observaciones" ? "" : material.observaciones,
        marca: marcas.find((m: any) => m.id === material.id_marca),
        categoria: categorias.find((c: any) => c.id === material.id_categoria),
        ubicacion: ubicaciones.find((u: any) => u.id === material.id_ubicacion),
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas archivar este material?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, archivar!",
        });

        if (result.isConfirmed) {
        try {
            await deleteMaterial(id);
            setData((prev) => prev.filter((item) => item.id !== id));
            Swal.fire("Archivado!", "El material fue archivado correctamente.", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Hubo un problema al archivar el material.", "error");
        }
        }
    };

    const handleRestore = async (id: number) => {
        try {
        await api.post(`/materials/${id}/restaurar`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Restaurado", "El material ha sido restaurado.", "success");
        } catch (error) {
        console.error("Error al restaurar:", error);
        Swal.fire("Error", "No se pudo restaurar el material", "error");
        }
    };

    const handleSubmit = async (material: Material) => {
        try {
    
        if (!material.observaciones || material.observaciones.trim() === "") {
            material.observaciones = "Sin observaciones";
        }
        const isEdit = !!editingMaterial;
        const codigoDuplicado = data.some(
            (item) =>
            item.codigo === material.codigo &&
            (!isEdit || item.id !== material.id)
        );

        if (codigoDuplicado) {
            toast.error(`Ya existe un material con el código "${material.codigo}"`);
            return;
        }
        const response = await saveOrUpdateMaterial(material, isEdit);
        setData((prev) =>
        isEdit ? prev.map((m) => (m.id === material.id ? response.data : m))
            : [...prev, response.data]
        );

        toast.success(isEdit ? "Material actualizado exitosamente" : "Material registrado exitosamente");
        setIsModalOpen(false);
        } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Ocurrió un error inesperado.");
        }
    };


    const handleExportMateriales = async ({ tipo }: { tipo: "activos" | "completados" }) => {
        try {
            const response = await api.get("/materials", {
                params: { verArchivados: tipo === "completados" },
            });

            const materiales = response.data;

            if (materiales.length === 0) {
                toast.info("No se encontraron materiales para exportar.");
                return;
            }

            const dataFormateada = formatMaterialesForXLS(materiales);

            const formatDate = (d: Date) => d.toISOString().slice(0, 10);
            const nombreArchivo = `materiales_${tipo === "completados" ? "archivados" : "activos"}_${formatDate(new Date())}.xlsx`;

            exportToExcel(dataFormateada, nombreArchivo);
            toast.success("Exportación realizada con éxito.");
        } catch (error) {
            console.error("Error al exportar materiales:", error);
            toast.error("Ocurrió un error al exportar.");
        }
    };

    return {
        handleEdit,
        handleDelete,
        handleRestore,
        handleSubmit,
        marcas,
        categorias,
        ubicaciones,
        handleExportMateriales
        
    };
};
