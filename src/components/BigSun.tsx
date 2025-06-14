export function BigSun() {
  return (
    // large sun element with a radial gradient background
    <div className="relative aspect-square h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_theme(colors.yellow.200)_0%,_theme(colors.yellow.500)_70%,_theme(colors.yellow.700)_100%)] shadow-xl transition-all duration-300">
      {/* subtle inner glow */}
      <div className="h-full w-full rounded-full bg-white/20 blur-lg" />
    </div>
  );
}
