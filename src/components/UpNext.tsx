import * as ScrollArea from "@radix-ui/react-scroll-area";

interface Song {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
}

const placeholderSongs: Song[] = [
  {
    id: "1",
    name: "Placeholder Song 1",
    artist: "Artist 1",
    albumCover: "https://via.placeholder.com/120x120?text=Album+1",
  },
  {
    id: "2",
    name: "Placeholder Song 2",
    artist: "Artist 2",
    albumCover: "https://via.placeholder.com/120x120?text=Album+2",
  },
  {
    id: "3",
    name: "Placeholder Song 3",
    artist: "Artist 3",
    albumCover: "https://via.placeholder.com/120x120?text=Album+3",
  },
  {
    id: "4",
    name: "Placeholder Song 4",
    artist: "Artist 4",
    albumCover: "https://via.placeholder.com/120x120?text=Album+4",
  },
  {
    id: "5",
    name: "Placeholder Song 5",
    artist: "Artist 5",
    albumCover: "https://via.placeholder.com/120x120?text=Album+5",
  },
];

export function UpNext() {
  return (
    <div className="relative w-full">
      {/* Up Next header inside the scroll area card, not inside the scroll area */}
      <div className="px-4 pb-3 pl-5">
        <h2 className="text-6xl font-extralight tracking-wider text-slate-200 lowercase">
          Up Next:
        </h2>
      </div>
      <ScrollArea.Root className="relative z-0 w-full overflow-x-auto">
        <ScrollArea.Viewport className="w-full">
          <div className="flex min-w-max flex-row gap-6 px-2 py-4">
            {placeholderSongs.map((song) => (
              <div
                key={song.id}
                className="flex min-w-[120px] flex-col items-center transition-all duration-300"
              >
                <img
                  src={song.albumCover}
                  alt={song.name}
                  className="h-28 w-28 rounded-lg object-cover shadow-md"
                />
                <div className="mt-2 text-center">
                  <div className="w-28 truncate text-sm font-semibold text-slate-200">
                    {song.name}
                  </div>
                  <div className="w-28 truncate text-xs text-slate-400">
                    {song.artist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" className="h-2">
          <ScrollArea.Thumb className="rounded-full bg-slate-600" />
        </ScrollArea.Scrollbar>
        {/* Fading edges */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-8 bg-gradient-to-r from-slate-900/90 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-8 bg-gradient-to-l from-slate-900/90 to-transparent" />
      </ScrollArea.Root>
    </div>
  );
}
