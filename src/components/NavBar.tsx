import {
  NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useState } from "react";

function NavLinkButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuLink
      asChild
      className="rounded-md bg-gray-100 px-4 py-2 text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-900/90 dark:text-slate-100 dark:hover:bg-gray-800"
    >
      <Link to={to}>{children}</Link>
    </NavigationMenuLink>
  );
}

function NavBar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  return (
    <>
      <NavigationMenu className="-mb-6 py-6 pl-10">
        {/* 始 NavBar Items List */}
        <NavigationMenuList>
          {/* MAIN PAGE (everything should go here) */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <NavLinkButton to="/">Main Page</NavLinkButton>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          {/* LEGACY PAGES */}
          {/* HOME */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <NavLinkButton to="/home">Home</NavLinkButton>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
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
          {/* MUSIC */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <NavLinkButton to="/music">Music</NavLinkButton>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          {/* FAVORITES */}
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <NavLinkButton to="/favorites">Favorites</NavLinkButton>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
          {/* 終 NavBar Items List */}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="flex w-80 flex-col items-center rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:bg-slate-900/90">
            <div className="mb-6 text-center text-lg text-gray-900 dark:text-slate-200">
              [TODO: put spotify login here]
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
