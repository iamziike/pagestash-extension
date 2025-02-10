import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useTypedSearchParams = <T extends object>() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<T>();

  useEffect(() => {
    setParams(Object.fromEntries(searchParams.entries()) as T);
  }, [searchParams]);

  return {
    setSearchParams,
    searchParams,
    params,
  };
};

export default useTypedSearchParams;
