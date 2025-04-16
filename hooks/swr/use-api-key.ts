import useSWR from "swr";
import { fetcher } from "@/lib/utils/fetcher";

type UseApiKeyResponse = {
  id: string;
  name: string;
  origins: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  publicKey: string;
  secretKey: string;
};

export const useApiKey = (id: string) => {
  const { data, isLoading, error, mutate } = useSWR<UseApiKeyResponse>(
    `/api/api-keys/${id}`,
    fetcher,
  );
  return { key: data, isLoading, error, mutate };
};
