import { useContext } from 'react';
import { ServiceContext } from './ServiceContext';
import type { Services } from './ServiceContext';

export function useServices(): Services {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
