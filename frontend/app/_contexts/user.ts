import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";
import { ACCESS_TOKEN_KEY } from "../_components/auth";
import { fetchWithToken } from "../_lib/client";
import { User, Users } from "../_types/user";

export const useCurrentUser = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<User>(
    ["/api/v1/users/me", accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    currentUser: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUsers = () => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);
  const { data, error } = useSWR<Users>(
    ["/api/v1/users", accessToken],
    ([destination, token]) => fetchWithToken(destination, token),
  );
  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
  };
};
