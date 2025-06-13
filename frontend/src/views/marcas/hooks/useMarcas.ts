import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Marca } from "../../../types/index";
export const useMarcas = (verArchivados = false) => {
    return useQuery<Marca[]>({
        queryKey: ["marcas", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/marcas", {
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
