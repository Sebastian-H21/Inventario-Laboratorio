import { useEffect, useState } from "react";
import { Material } from "../../../types";
import api from "../../../utils/api";

const useFetchMateriales = (verArchivados = false) => {
    const [data, setData] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/materials', { params: { verArchivados }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener materiales", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchMateriales;