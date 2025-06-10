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
    const [laboratorios, setLaboratorios] = useState<Marca[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [resMarcas, resCategorias, resUbicaciones,resLaboratorios] = await Promise.all([
            api.get("/marcas"),
            api.get("/categorias"),
            api.get("/ubicacions"),
            api.get("/laboratorios"),

            ]);
            setMarcas(resMarcas.data);
            setCategorias(resCategorias.data);
            setUbicaciones(resUbicaciones.data);
            setLaboratorios(resLaboratorios.data);
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
        const materialArchivado = data.find(
                (item) =>
                    item.codigo === material.codigo &&
                    item.deleted_at !== null &&
                    (!isEdit || item.id !== material.id)
                );
                    
                if (materialArchivado) {
                    toast.error(`Ya existe un material archivado con el código "${material.codigo}". Por favor, restaúralo.`);
                    return;
                }
        
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

    const handleExportMateriales = async ({
        tipo,
        laboratorioId,
    }: {
        tipo: "activos" | "completados";
        laboratorioId?: number;
    }) => {
        try {
            const response = await api.get("/materials", {
                params: { verArchivados: tipo === "completados" },
            });

            let materiales = response.data;

            // Filtrar por laboratorio si se seleccionó uno
            if (laboratorioId) {
                materiales = materiales.filter(
                    (m: any) => m.laboratorio?.id === laboratorioId
                );
            }
          // Formatear nombre
            const laboratorioNombre = laboratorioId
                ? laboratorios.find(lab => lab.id === laboratorioId)?.nombre ?? `lab_${laboratorioId}`
                : "todos_labs";

            // QUitar acentos y dejar en minusculas 
            const limpiarNombre = (nombre: string) =>
                nombre.normalize("NFD") 
                    .replace(/[\u0300-\u036f]/g, "") 
                    .replace(/[^a-z0-9]/gi, "_") 
                        .toLowerCase();
            const labNombreLimpio = limpiarNombre(laboratorioNombre);
            
            if (materiales.length === 0) {
                toast.info("No se encontraron materiales para exportar.");
                return;
            }

            const dataFormateada = formatMaterialesForXLS(materiales);

            const formatDate = (d: Date) => {
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
            };
            const nombreArchivo = `materiales_${tipo === "completados" ? "archivados" : "activos"}_${labNombreLimpio}_${formatDate(new Date())}.xlsx`;

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
        laboratorios,
        handleExportMateriales
        
    };
};
