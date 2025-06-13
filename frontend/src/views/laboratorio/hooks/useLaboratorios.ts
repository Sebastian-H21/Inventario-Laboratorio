import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Laboratorio } from "../../../types/index";
export const useLaboratorios = (verArchivados = false) => {
    return useQuery<Laboratorio[]>({
        queryKey: ["laboratorios", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/laboratorios", {
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
