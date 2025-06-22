import { ReactNode } from 'react';
import { ServiceContext, Services } from '@/contexts/ServiceContext';

interface ServiceProviderProps {
  children: ReactNode;
  services: Services;
}

export function ServiceProvider({ children, services }: ServiceProviderProps) {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}
