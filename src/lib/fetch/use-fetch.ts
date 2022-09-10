import { useCallback, useState } from "react";

type FetchFunction<T> = () => Promise<T>;

interface HttpRequest {
  url: string;
  options?: RequestInit;
}

function createFetchFunctionFromHttpRequest<T>(httpRequest: HttpRequest): FetchFunction<T> {
  const { url, options } = httpRequest;
  return async () => {
    const response = await fetch(url, options);
    return await response.json();
  }
}

interface Props<T> {
  func: FetchFunction<T>
  executeAutomatically?: boolean;
}

function useFetch<T>(props: Props<T>) {
  const { func, executeAutomatically } = props;
  const [fetching, setFetching] = useState<boolean>();
  const [response, setResponse] = useState<T>();
  const execute = useCallback(async () => {
    try {
      setFetching(true);
      setResponse(undefined);
      const responseBody: T = await func();
      setResponse(responseBody);
      return responseBody;
    } finally {
      setFetching(false);
    }
  }, [func]);
  if (executeAutomatically) {
    execute();
  }
  return { fetching, response, execute };
}

export default useFetch;
export { createFetchFunctionFromHttpRequest }