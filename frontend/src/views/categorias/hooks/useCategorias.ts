import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Categoria } from "../../../types/index";

export const useCategorias = (verArchivados = false) => {
    return useQuery<Categoria[]>({
        queryKey: ["categorias", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/categorias", {
            params: { verArchivados },
        });
        return data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,

        placeholderData: (previousData) => previousData ?? [],
    });
};
