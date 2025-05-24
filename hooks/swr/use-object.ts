import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

type UseObjectResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  key: string;
  storageType: "file"; // we wont support folder view for now
  contentType: string;
  size: number;
  teamId: string;
};

export const useObject = (id: string) => {
  const { data, isLoading, error } = useSWR<UseObjectResponse>(
    `/api/storage/object/${id}`,
    fetcher,
  );
  return { storageObject: data, isLoading, error };
};
