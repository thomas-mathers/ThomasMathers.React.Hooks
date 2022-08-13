import { useCallback, useState } from "react";

interface Props {
    url: string;
    options?: RequestInit;
    executeAutomatically?: boolean;
}

function useFetch<T>(props: Props) {
    const { url, options, executeAutomatically } = props;
    const [fetching, setFetching] = useState<boolean>();
    const [response, setResponse] = useState<T>();
    const execute = useCallback(async () => {
        try {
            setFetching(true);
            setResponse(undefined);
            const response = await fetch(url, options);
            const json = await response.json();
            const responseBody: T = json;
            setResponse(responseBody);
            return responseBody;
        } finally {
            setFetching(false);
        }
    }, [url, options]);        
    if (executeAutomatically) {
        execute();
    }
    return { fetching, response, execute };
}

export default useFetch;