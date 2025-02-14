import { WeatherData } from "@/api/types";
import { useFavorite } from "@/hooks/use-favorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
interface FavoriteButtonProps {
  data: WeatherData;
}
const FavoriteButton = ({ data }: FavoriteButtonProps) => {
  const { addToFavorite, isFavorite, removeFavorites } = useFavorite();

  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorites.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favorites`);
    } else {
      addToFavorite.mutate({
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
      toast.success(`Added ${data.name} to favorites`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      onClick={handleToggleFavorite}
    >
      <Star className={`size-4 ${isCurrentlyFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};

export default FavoriteButton;
