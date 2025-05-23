import { useEffect, useState } from "react";
import { Categoria} from "../../../types";
import api from "../../../utils/api";

const useFetchCategorias = (verArchivados = false) => {
    const [data, setData] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/categorias', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las categorias", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchCategorias;