import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

type UseStorageResponse = {
  objects: {
    id: string;
    name: string;
    key: string;
    size?: number;
    contentType?: string;
    storageType: "folder" | "file";
    updatedAt: Date;
  }[];
  total: number;
};

export const useStorage = ({ key, page, limit }: { key: string; page: number; limit: number }) => {
  const searchParams = new URLSearchParams({
    key,
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data, isLoading, error, mutate } = useSWR<UseStorageResponse>(
    `/api/storage?${searchParams.toString()}`,
    fetcher,
    { keepPreviousData: true },
  );

  console.log(data);
  return { objects: data?.objects, total: data?.total, isLoading, error, mutate };
};
