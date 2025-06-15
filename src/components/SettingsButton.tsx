import { useState } from "react";
import { SettingsIcon } from "@/components/icons";
import { SettingsMenu } from "@/components/SettingsMenu";
import { Button } from "@/components/ui/button";

export function SettingsButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 right-4 z-40 border-white/30 bg-white/20 backdrop-blur-md hover:bg-white/30 dark:border-slate-700/30 dark:bg-slate-900/20 dark:hover:bg-slate-900/30"
        aria-label="Open settings"
      >
        <SettingsIcon className="h-4 w-4" />
      </Button>

      <SettingsMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
