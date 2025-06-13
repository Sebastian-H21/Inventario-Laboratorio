import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Prestamo } from "../../../types/index";
export const usePrestamos = (verArchivados = false) => {
    return useQuery<Prestamo[]>({
        queryKey: ["prestamos", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/prestamos", {
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
