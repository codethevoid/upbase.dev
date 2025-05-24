import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

type UseApiKeysResponse = {
  id: string;
  name: string;
  origins: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  publicKey: string;
  secretKey: string;
}[];

export const useApiKeys = () => {
  const { data, isLoading, error, mutate } = useSWR<UseApiKeysResponse>("/api/api-keys", fetcher);
  return { keys: data, isLoading, error, mutate };
};
