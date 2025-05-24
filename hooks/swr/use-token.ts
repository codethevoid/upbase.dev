import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

type UseTokenResponse = {
  user: { email: string; id: string };
  expires: string;
};

export const useToken = () => {
  const { data, isLoading, error } = useSWR<UseTokenResponse>("/api/token", fetcher);
  return { token: data, isLoading, error };
};
