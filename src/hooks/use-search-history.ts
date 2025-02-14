import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";
interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useLocalStorage<
    SearchHistoryItem[]
  >("search-history", []);

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => searchHistory,
    initialData: searchHistory,
  });

  const addToSearchHistory = useMutation({
    mutationFn: async (
      search: Omit<SearchHistoryItem, "id" | "searchedAt">
    ) => {
      const newSearch = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };
      const filteredHistory = searchHistory.filter(
        (item) => !(item.lat === newSearch.lat && item.lon === newSearch.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      setSearchHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["search-history"], newHistory);
    },
  });

  const clearSearchHistory = useMutation({
    mutationFn: async () => {
      setSearchHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  return {
    history: historyQuery.data ?? [],
    addToSearchHistory,
    clearSearchHistory,
  };
}
