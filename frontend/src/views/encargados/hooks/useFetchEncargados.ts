import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Encargado } from "../../../types";


const useFetchEncargados = (verArchivados = false) => {
    const [data, setData] = useState<Encargado[]>([]);
    const [loading, setLoading] = useState(true);
    
    const fetchData = async () => {
        try {
            const response = await api.get('/encargados', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener encargados", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchEncargados;