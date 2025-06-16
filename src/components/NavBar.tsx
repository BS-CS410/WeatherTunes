import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

function NavBar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  return (
    <>
      <NavigationMenu className="-mb-6 py-6 pl-10">
        {/* 始 NavBar Items List */}
        <NavigationMenuList>
          {/* LOGIN */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-900/90 dark:text-slate-100 dark:hover:bg-gray-800"
                onClick={() => setShowLoginPopup(true)}
                type="button"
              >
                DEBUG: Show Login Popup
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* 終 NavBar Items List */}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="flex w-80 flex-col items-center rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-900/90">
            <div className="mb-6 text-center text-lg text-gray-900 dark:text-slate-200">
              Connect to Spotify for personalized music recommendations
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="rounded-lg bg-[#1DB954] px-6 py-2 text-white transition-colors hover:bg-[#1ED760]"
                onClick={() =>
                  (window.location.href = "http://127.0.0.1:8000/login")
                }
              >
                Login with Spotify
              </button>
              <button
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 shadow transition-colors hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
