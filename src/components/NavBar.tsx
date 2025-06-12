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
      className="rounded-md bg-gray-900/90 px-4 py-2 transition-colors hover:bg-gray-800"
    >
      <Link to={to}>{children}</Link>
    </NavigationMenuLink>
  );
}

function NavBar() {
  return (
    <NavigationMenu className="py-6">
      {/* 始 NavBar Items List */}
      <NavigationMenuList>
        {/* MAIN PAGE (everything should go here) */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLinkButton to="/">Main Page</NavLinkButton>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* LEGACY PAGES */}
        {/* HOME */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLinkButton to="/home">Home</NavLinkButton>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* LOGIN */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLinkButton to="/login">Login</NavLinkButton>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* MUSIC */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLinkButton to="/music">Music</NavLinkButton>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* FAVORITES */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLinkButton to="/favorites">Favorites</NavLinkButton>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* 終 NavBar Items List */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavBar;
