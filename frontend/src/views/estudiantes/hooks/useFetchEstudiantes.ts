import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Estudiante } from "../../../types";

const useFetchEstudiantes = (verArchivados = false) => {
    const [data, setData] = useState<Estudiante[]>([]);
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {
        try {
            const response = await api.get('/estudiantes', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener estudiantes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };



};

export default useFetchEstudiantes;