export function BigSun() {
  return (
    // large sun element with a radial gradient background
    <div className="relative aspect-square h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_30%,_theme(colors.cyan.100)_0%,_theme(colors.cyan.200)_70%,_theme(colors.slate.100)_100%)] shadow-xl transition-all duration-500 ease-in-out">
      {/* subtle inner glow */}
      <div className="h-full w-full rounded-full bg-white/30 blur-lg transition-all duration-500 ease-in-out" />
    </div>
  );
}
