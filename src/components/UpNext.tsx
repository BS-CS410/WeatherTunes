import { useState, useRef } from "react";

interface Song {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
}

const placeholderSongs: Song[] = [
  {
    id: "1",
    name: "I beg you",
    artist: "Aimer",
    albumCover:
      "https://m.media-amazon.com/images/I/61Nwxib42TL._UF1000,1000_QL80_.jpg",
  },
  {
    id: "2",
    name: "Galaxy",
    artist: "LADIES' CODE",
    albumCover:
      "https://coverartarchive.org/release-group/cf67d786-96a3-4705-a4da-c273ba7bd511/front",
  },
  {
    id: "3",
    name: "CYM",
    artist: "Billyrom",
    albumCover:
      "https://i.scdn.co/image/ab67616d0000b273a30e39ed9dc33a1fa3533269",
  },
  {
    id: "4",
    name: "俺の彼女",
    artist: "Hikaru Utada",
    albumCover:
      "https://i.scdn.co/image/ab67616d0000b2737321208918877ea522ceb6ac",
  },
  {
    id: "5",
    name: "Darkshines",
    artist: "Muse",
    albumCover:
      "https://media.pitchfork.com/photos/60e71df9331c9bf60f4b0db6/1:1/w_1425,h_1425,c_limit/F01A01D5-5AFB-47E3-BEF3-EFABB3134DBC.jpeg",
  },
  {
    id: "6",
    name: "DIORAMA",
    artist: "Yves",
    albumCover:
      "https://lastfm.freetls.fastly.net/i/u/ar0/137fcdf412d3a9e065f55f4173402178.jpg",
  },
  {
    id: "7",
    name: "Heart-Shaped Box",
    artist: "Nirvana",
    albumCover:
      "https://i.discogs.com/KitJKt2LSSOdjXOmOcIeKUgcnaYNhL6hF4FVHF_d2Tg/rs:fit/g:sm/q:90/h:592/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM3NDEz/MjMtMTM0MjUwOTI0/Ny0xODI1LmpwZWc.jpeg",
  },
  {
    id: "8",
    name: "Electioneering",
    artist: "Radiohead",
    albumCover:
      "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856",
  },
];

export function UpNext() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredId(id);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      setHoveredId(null);
    }, 80); // 80ms delay for smoothness
  };

  return (
    <div className="relative">
      {/* Up Next header inside the scroll area card, not inside the scroll area */}
      <div className="px-4 pb-4 pl-6">
        <h2 className="text-5xl font-extralight tracking-wider text-gray-900 lowercase dark:text-slate-200">
          Up Next:
        </h2>
      </div>
      {/* Using simple div with overflow instead of Radix ScrollArea for MUI compatibility */}
      <div className="scrollbar-thin scrollbar-track-black/10 scrollbar-thumb-slate-600/60 hover:scrollbar-thumb-slate-600/80 relative z-0 overflow-x-auto px-6">
        <div className="flex min-w-max flex-row gap-2 px-2 py-4">
          {placeholderSongs.map((song, idx) => {
            const isHovered = hoveredId === song.id;
            const isNextUp = hoveredId === null && idx === 0;
            const isNextUpOrHovered =
              (hoveredId === null && idx === 0) ||
              (hoveredId === song.id && idx === 0);
            return (
              <div
                key={song.id}
                className="group flex min-w-[120px] flex-col items-center transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(song.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative">
                  {/* Subtle shadow for Up Next or hovered song */}
                  <img
                    src={song.albumCover}
                    alt={song.name}
                    className={`relative z-10 h-28 w-28 cursor-pointer rounded-lg object-cover transition-transform duration-300 ${
                      isHovered || isNextUp
                        ? "-translate-y-2 scale-110 shadow-2xl hover:brightness-105 dark:hover:brightness-110"
                        : ""
                    }`}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`w-28 truncate text-sm font-semibold transition-all duration-300 ${isNextUpOrHovered ? "text-gray-900 drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)] dark:text-slate-100 dark:drop-shadow-[0_1px_6px_rgba(255,255,255,0.13)]" : "text-gray-900 dark:text-slate-200"}`}
                  >
                    {song.name}
                  </div>
                  <div
                    className={`w-28 truncate text-xs transition-all duration-300 ${isNextUpOrHovered ? "text-gray-700 drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:text-slate-300 dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.10)]" : "text-gray-700 dark:text-slate-400"}`}
                  >
                    {song.artist}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UpNext;
