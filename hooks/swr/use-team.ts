import { fetcher } from "@/lib/utils/fetcher";
import useSWR from "swr";

type UseTeamResponse = {
  id: string;
  name: string;
  usage: number;
};

export const useTeam = () => {
  const { data, isLoading, error, mutate } = useSWR<UseTeamResponse>("/api/team", fetcher);
  return { team: data, isLoading, error, mutate };
};
