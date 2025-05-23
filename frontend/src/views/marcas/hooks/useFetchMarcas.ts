import { useEffect, useState } from "react";
import { Marca } from "../../../types";
import api from "../../../utils/api";

const useFetchMarcas = (verArchivados = false) => {
    const [data, setData] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/marcas', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las marcas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchMarcas;