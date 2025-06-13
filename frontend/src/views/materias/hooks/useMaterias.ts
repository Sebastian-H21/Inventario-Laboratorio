import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Materia } from "../../../types/index";
export const useMaterias = (verArchivados = false) => {
    return useQuery<Materia[]>({
        queryKey: ["materias", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/materias", {
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
