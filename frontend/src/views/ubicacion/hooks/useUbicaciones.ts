import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Ubicacion } from "../../../types/index";
export const useUbicaciones = (verArchivados = false) => {
    return useQuery<Ubicacion[]>({
        queryKey: ["ubicacions", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/ubicacions", {
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
