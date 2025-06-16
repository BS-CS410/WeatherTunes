import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

function NavBar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Backend login URL that starts the Spotify OAuth flow
  const spotifyLoginUrl = "http://localhost:8000/login";

  return (
    <>
      <NavigationMenu className="-mb-6 py-6 pl-10">
        <NavigationMenuList>
          {/* LOGIN */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-900/90 dark:text-slate-100 dark:hover:bg-gray-800"
                onClick={() => setShowLoginPopup(true)}
                type="button"
              >
                Login to spotify
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="flex w-80 flex-col items-center rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-900/90">
            <div className="mb-6 text-center text-lg text-gray-900 dark:text-slate-200">
              {/* Spotify Login Button */}
              <a
                href={spotifyLoginUrl}
                className="inline-block rounded-md bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 transition-colors"
                onClick={() => setShowLoginPopup(false)} // Close popup on click (optional)
              >
                Log in with Spotify
              </a>
            </div>
            <button
              className="mt-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-900 shadow transition-colors hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              onClick={() => setShowLoginPopup(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
