import { redirect } from "next/navigation";
import { FC } from "react";
import useLocalStorageState from "use-local-storage-state";

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken] = useLocalStorageState(ACCESS_TOKEN_KEY);

  if (accessToken === undefined) {
    redirect("/login");
  }

  return children;
};

export default AuthProvider;

export const ACCESS_TOKEN_KEY = "access-token";
