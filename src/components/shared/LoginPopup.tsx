import { useAuth } from "@/hooks";
import { BaseCard } from "@/components/shared/BaseCard";
import { Button } from "@/components/ui/button";
import { COLORS } from "@/lib/design-system";
import { cn } from "@/lib/dom-helpers";

interface LoginPopupProps {
  isOpen: boolean;
}

export function LoginPopup({ isOpen }: LoginPopupProps) {
  const { login } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Popup Content */}
      <div className="relative w-full max-w-sm">
        <BaseCard
          variant="modal"
          enableLiquidGlass
          className="text-center"
          contentClassName="space-y-6"
        >
          <div className="space-y-2">
            <h1 className={cn("text-2xl font-bold", COLORS.text.primary)}>
              Login with Spotify
            </h1>
            <p className={cn(COLORS.text.secondary)}>
              Connect to Spotify for personalized music recommendations
            </p>
          </div>

          <Button
            onClick={login}
            size="lg"
            variant="ghost"
            className="w-full border border-white/30 bg-[#1DB954]/80 font-medium text-white shadow-lg backdrop-blur-md hover:bg-[#1ED760]/90"
          >
            Login via Spotify
          </Button>
        </BaseCard>
      </div>
    </div>
  );
}
