import { useServices } from "./useServices";
import { SpotifyService } from '@/services/SpotifyService';

export function useSpotifyService(): SpotifyService {
  const { spotify } = useServices();
  return spotify;
}
