import {useQuery} from "@tanstack/react-query";
import {pazaApi, tokenConfig} from "@/lib/axiosClients";
import { useEffect } from "react";


interface useCustomqueryProps {
    queryKey: string;
    queryUrl : string;
    enabled: boolean;
}

export default function useCustomquery({queryKey, queryUrl, enabled}: useCustomqueryProps) {
    
 const queryOptions = {
    queryKey: [queryKey],
    queryFn: () => pazaApi.get(queryUrl,tokenConfig()),
    enabled: enabled,
};

const query = useQuery(queryOptions);


useEffect(() => {
    return () => {
        query.refetch();
    };
}, [query]);

return query;
}
