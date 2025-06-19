import { useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";

export function SettingsButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMenuOpen(true)}
        className="apple-depth fixed top-4 right-4 z-40 rounded-xl border border-white/[0.15] bg-white/[0.07] backdrop-blur-xl backdrop-saturate-[1.6] hover:border-white/[0.2] hover:bg-white/[0.09] dark:border-white/[0.06] dark:bg-black/[0.15] dark:hover:border-white/[0.08] dark:hover:bg-black/[0.18]"
        aria-label="Open settings"
      >
        <SettingsIcon className="h-4 w-4" />
      </Button>

      <SettingsCard isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
