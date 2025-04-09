import { fetcher } from "@/lib/utils/fetcher";
import useSWR from "swr";

type File = {
  id: string;
  path: string;
  originalName: string;
  size: number;
  contentType: string;
};

export const useStorage = ({ key }: { key: string }) => {
  const searchParams = new URLSearchParams({
    key,
  });

  const { data, isLoading, error } = useSWR<File[]>(
    `/api/storage?${searchParams.toString()}`,
    fetcher,
  );

  console.log(data);
  return { storage: data, isLoading, error };
};
