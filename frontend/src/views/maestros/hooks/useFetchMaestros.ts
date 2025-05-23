import { useEffect, useState } from "react";
import { Maestro } from "../../../types";
import api from "../../../utils/api";

const useFetchMaestros = (verArchivados = false) => {
    const [data, setData] = useState<Maestro[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/maestros', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener maestros", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchMaestros;