import { useContext } from "react";
import { ServiceContext, type Services } from "@/contexts/ServiceContext";

export function useServices(): Services {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}
