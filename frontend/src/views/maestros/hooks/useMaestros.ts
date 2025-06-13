import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Maestro } from "../../../types/index";
export const useMaestros = (verArchivados = false) => {
    return useQuery<Maestro[]>({
        queryKey: ["maestros", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/maestros", {
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
