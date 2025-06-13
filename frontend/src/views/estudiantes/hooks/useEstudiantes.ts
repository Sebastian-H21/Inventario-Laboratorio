import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Estudiante } from "../../../types/index";
export const useEstudiantes = (verArchivados = false) => {
    return useQuery<Estudiante[]>({
        queryKey: ["estudiantes", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/estudiantes", {
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
