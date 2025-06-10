import { useEffect, useState } from "react";
import { Laboratorio } from "../../../types";
import api from "../../../utils/api";

const useFetchLaboratorios = (verArchivados = false) => {
    const [data, setData] = useState<Laboratorio[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/laboratorios', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las laboratorios", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchLaboratorios;