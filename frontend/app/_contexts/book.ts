import useSWR from "swr";
import {
  Book,
  PaginatedList,
} from "../_types/book";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "../_components/auth";
import { fetchWithToken } from "../_lib/client";

type BooksQuery = {
  limit: number;
  offset: number;
}

export const useBooks = (query: BooksQuery) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);

  const { data, error } = useSWR<PaginatedList<Book>>(
    [`/api/v1/books?limit=${query.limit}&offset=${query.offset}`, accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    books: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useBook = (id: string) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<Book>(
    [`/api/v1/books/${id}`, accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    book: data,
    isLoading: !error && !data,
    isError: error,
  };
};
