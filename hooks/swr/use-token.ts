import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

type UseTokenResponse = {
  user: { email: string };
  expires: string;
};

export const useToken = () => {
  const { data, isLoading, error } = useSWR<UseTokenResponse>("/api/token", fetcher);
  return { token: data, isLoading, error };
};
