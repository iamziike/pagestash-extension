import { TypedURLSearchParam } from "@/models";
import { useSearchParams } from "react-router-dom";

const useTypedSearchParams = <T extends Record<string, string>>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    setSearchParams,
    searchParams: searchParams as TypedURLSearchParam<T>,
  };
};

export default useTypedSearchParams;
