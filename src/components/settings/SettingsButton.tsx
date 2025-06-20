import { useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { BUTTON_STYLES } from "@/lib/unifiedStyles";
import { cn } from "@/lib/lib-utils";

export function SettingsButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMenuOpen(true)}
          className={cn(
            BUTTON_STYLES.liquidGlass,
            "apple-depth rounded-xl border border-white/[0.15] bg-white/[0.07] backdrop-blur-xl backdrop-saturate-[1.6] hover:border-white/[0.25] hover:bg-white/[0.12] dark:border-white/[0.06] dark:bg-black/[0.15] dark:hover:border-white/[0.12] dark:hover:bg-black/[0.22]",
          )}
          aria-label="Open settings"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      <SettingsCard isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
