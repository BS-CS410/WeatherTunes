import { useAuth } from "@/hooks/useAuth";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const { login } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="flex w-80 flex-col items-center rounded-3xl border border-white/[0.18] bg-white/[0.08] p-8 shadow-2xl backdrop-blur-2xl backdrop-saturate-[1.7] dark:border-white/[0.1] dark:bg-white/[0.05]">
        <div className="mb-6 text-center text-lg text-gray-900 dark:text-slate-200">
          Connect to Spotify for personalized music recommendations
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="rounded-xl bg-[#1DB954] px-6 py-2 text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1ED760]"
            onClick={login}
          >
            Login with Spotify
          </button>
          <button
            className="rounded-xl bg-white/[0.7] px-4 py-2 text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.8] dark:bg-white/[0.15] dark:text-slate-100 dark:hover:bg-white/[0.2]"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
