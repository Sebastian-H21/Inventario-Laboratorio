import { useEffect, useState } from "react";
import { Ubicacion} from "../../../types";
import api from "../../../utils/api";

const useFetchUbicacion = (verArchivados = false) => {
    const [data, setData] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await api.get('/ubicacions', { params: { verArchivados }                 
            });
            setData(response.data);
        } catch (error) {
            console.error("Error al obtener las ubicaciones", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [verArchivados]);

    return { data, setData, loading };
};

export default useFetchUbicacion;