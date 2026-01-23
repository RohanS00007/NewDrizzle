"use client";

import { useContext, createContext } from "react";
import type { Session} from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";

interface AuthContextType {
  data: Session | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Session | null , Error>>;
}

interface ChildProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthInfo = (): AuthContextType | null => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthInfo must be used within AuthQueryProvider");
  }
  return context;
};

const fetchSession = async () => {
  const { data: session } = await authClient.getSession();
  return session;
};

export default function AuthQueryProvider({ children }: ChildProps) {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ["betterAuth"],
    queryFn: fetchSession,
    staleTime: 10 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  return (
    <AuthContext.Provider
      value={{
        data: data ?? null,
        isLoading,
        isError,
        error,
        isFetching,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
