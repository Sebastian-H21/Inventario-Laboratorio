import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Material } from "../../../types/index";
export const useMaterials = (verArchivados = false) => {
    return useQuery<Material[]>({
        queryKey: ["materials", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/materials", {
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
