import { useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type CardType =
  | "unified-display"
  | "spotify-player"
  | "up-next"
  | "forecast"
  | "favorites";

export function useCardOrder() {
  // Default order for cards
  const defaultOrder: CardType[] = useMemo(
    () => [
      "unified-display",
      "spotify-player",
      "up-next",
      "forecast",
      "favorites",
    ],
    [],
  );

  const [cardOrder, setCardOrder] = useLocalStorage<CardType[]>(
    "card-order",
    defaultOrder,
  );

  const resetOrder = useCallback(() => {
    setCardOrder(defaultOrder);
  }, [setCardOrder, defaultOrder]);

  return {
    cardOrder,
    resetOrder,
  };
}
