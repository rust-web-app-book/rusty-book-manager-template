import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "../_components/auth";
import { fetchWithToken } from "../_lib/client";
import { Checkout } from "../_types/book";

export const useMyCheckouts = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<{ items: Checkout[] }>(
    ["/api/v1/users/me/checkouts", accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    checkouts: data?.items,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCheckouts = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<{ items: Checkout[] }>(
    ["/api/v1/books/checkouts", accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    checkouts: data?.items,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useBookCheckouts = (bookId: string) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<{ items: Checkout[] }>(
    [`/api/v1/books/${bookId}/checkout-history`, accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    checkouts: data?.items,
    isLoading: !error && !data,
    isError: error,
  };
};


