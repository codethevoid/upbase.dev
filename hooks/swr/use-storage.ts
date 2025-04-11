import { fetcher } from "@/lib/utils/fetcher";
import useSWR from "swr";

type StorageObject = {
  id: string;
  name: string;
  key: string;
  size?: number;
  contentType?: string;
  storageType: "folder" | "file";
  updatedAt: Date;
};

export const useStorage = ({ key }: { key: string }) => {
  const searchParams = new URLSearchParams({
    key,
  });

  const { data, isLoading, error } = useSWR<StorageObject[]>(
    `/api/storage?${searchParams.toString()}`,
    fetcher,
    { keepPreviousData: true },
  );

  console.log(data);
  return { objects: data, isLoading, error };
};
