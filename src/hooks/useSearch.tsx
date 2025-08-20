import { ChangeEvent, useEffect, useState } from "react";

import { useDebounce } from "use-debounce";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useUpdateQuery } from "./useUpdateQuery";

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get("searchText");
  const [query, setQuery] = useState(
    urlSearchTerm !== null ? urlSearchTerm : ""
  );

  const updateQueryParams = useUpdateQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText] = useDebounce(query, 1000);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  const handleClearQuery = () => {
    setQuery("");
  };
  useEffect(() => {
    if (searchText !== "" && searchText !== undefined) {
      updateQueryParams({ searchText });
    }

    if (searchText === "") {
      updateQueryParams({ searchText: "" });
    }
  }, [
    searchText,
    updateQueryParams,
    navigate,
    location.pathname,
    location.search,
  ]);

  return {
    handleChange,
    query,
    handleClearQuery,
  };
};
