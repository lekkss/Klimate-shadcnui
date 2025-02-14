import { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, addToSearchHistory, clearSearchHistory } =
    useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split(" | ");

    // Add to search history
    addToSearchHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    setOpen(false);
  };

  const { favorites } = useFavorite();
  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for a city..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No cities found.</CommandEmpty>
          )}
          {favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((location) => (
                <CommandItem
                  key={location.id}
                  value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="size-4 mr-2 text-yellow-500" />
                  <span className=""> {location.name}</span>
                  {location.state && (
                    <span className="text-xs text-muted-foreground">
                      , {location.state}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    , {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 py-3">
                  <p className="text-sm text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearSearchHistory.mutate()}
                  >
                    <XCircle className="size-4" /> Clear
                  </Button>
                </div>
                {history.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="size-4 mr-2 text-muted-foreground" />
                    <span className=""> {location.name}</span>
                    {location.state && (
                      <span className="text-xs text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      , {location.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              ) : (
                locations.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="size-4 mr-2" />
                    <span className=""> {location.name}</span>
                    {location.state && (
                      <span className="text-xs text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
