import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { Encargado } from "../../../types/index";
export const useEncargados = (verArchivados = false) => {
    return useQuery<Encargado[]>({
        queryKey: ["encargados", verArchivados],
        queryFn: async () => {
        const { data } = await api.get("/encargados", {
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
export default useEncargados;