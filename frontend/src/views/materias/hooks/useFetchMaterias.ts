import { useEffect, useState } from "react";
import { Materia } from "../../../types";
import api from "../../../utils/api";

const useFetchMaterias = (verArchivados = false) => {
    const [data, setData] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/materias', { params: { verArchivados }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las materias", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchMaterias;