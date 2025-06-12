export function BigSun() {
  return (
    <div className="absolute top-1/4 right-4 -translate-y-1/2 transform">
      <div className="relative h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,_theme(colors.yellow.200)_0%,_theme(colors.yellow.500)_70%,_theme(colors.yellow.700)_100%)] shadow-xl md:h-72 md:w-72 lg:h-48 lg:w-48">
        {/* subtle inner glow */}
        <div className="absolute top-4 left-4 h-12 w-12 rounded-full bg-white/20 blur-lg md:top-6 md:left-6 md:h-16 md:w-16" />
      </div>
    </div>
  );
}
