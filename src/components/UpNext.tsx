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
  return (
    <div className="relative w-full">
      {/* Up Next header inside the scroll area card, not inside the scroll area */}
      <div className="px-4 pb-3 pl-6">
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
                className="group flex min-w-[120px] flex-col items-center transition-all duration-300"
              >
                <img
                  src={song.albumCover}
                  alt={song.name}
                  className="h-28 w-28 rounded-lg object-cover shadow-md transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110"
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
        {/* Fading edges - use a wider, more gradual fade and fade only if content overflows */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-16 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-16 bg-gradient-to-l from-slate-900/80 via-slate-900/40 to-transparent" />
      </ScrollArea.Root>
    </div>
  );
}
