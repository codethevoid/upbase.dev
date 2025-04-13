import { fetcher } from "@/lib/utils/fetcher";
import useSWR from "swr";

type UseTeamResponse = {
  id: string;
};

export const useTeam = () => {
  const { data, isLoading, error } = useSWR<UseTeamResponse>("/api/team", fetcher);
  return { team: data, isLoading, error };
};
