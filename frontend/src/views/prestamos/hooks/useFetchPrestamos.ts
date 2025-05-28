import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Prestamo } from "../../../types";



const useFetchPrestamos = (verArchivados = false) => {
    const [data, setData] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/prestamos', { params: { verArchivados }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener prestamos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);
    
    return { data, setData, loading };
};

export default useFetchPrestamos;