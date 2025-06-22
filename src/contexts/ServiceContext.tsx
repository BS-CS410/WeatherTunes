import { createContext, useMemo, ReactNode, Context } from 'react';
import { AuthService } from '@/services/AuthService';
import { SpotifyService } from '@/services/SpotifyService';

// Define and export the Services interface
export interface Services {
  auth: AuthService;
  spotify: SpotifyService;
}

// Create and export the context
const ServiceContext: Context<Services | null> = createContext<Services | null>(null);

// Define and export the ServiceProvider component
export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  // Create services only once
  const services = useMemo(() => {
    const authService = new AuthService();
    const spotifyService = new SpotifyService(authService);
    
    return {
      auth: authService,
      spotify: spotifyService,
    };
  }, []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

// Export the context and types
export { ServiceContext };
// Services type is already exported at the interface level
