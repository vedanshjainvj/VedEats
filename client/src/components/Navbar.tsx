import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  
  Loader2,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";

const Navbar = () => {
  const { user, loading, logout } = useUserStore();
  const { cart } = useCartStore();
  const { setTheme } = useThemeStore();

  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800">VedEats</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 font-medium">Profile</Link>
            <Link to="/order-details" className="text-gray-600 hover:text-gray-900 font-medium">Order</Link>

            {user?.admin && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</MenubarTrigger>
                  <MenubarContent>
                    <Link to="/admin/restaurant">
                      <MenubarItem>Restaurant</MenubarItem>
                    </Link>
                    <Link to="/admin/menu">
                      <MenubarItem>Menu</MenubarItem>
                    </Link>
                    <Link to="/admin/orders">
                      <MenubarItem>Orders</MenubarItem>
                    </Link>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link to="/cart" className="relative cursor-pointer">
              <ShoppingCart className="text-gray-600 hover:text-gray-900" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* Logout Button */}
            {loading ? (
              <Button className="bg-red-600 hover:bg-hoverred-600">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={logout} className="bg-red-600 hover:bg-hoverred-600">
                Logout
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden">
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user, logout, loading } = useUserStore();
  const { cart } = useCartStore();
  const { setTheme } = useThemeStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full bg-gray-200 text-black hover:bg-gray-300" variant="outline">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-gray-50">
        <SheetHeader className="flex flex-row items-center justify-between mt-2 px-4">
          <SheetTitle className="text-xl font-bold text-gray-800">VedEats</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>

        <Separator className="my-4" />

        <SheetDescription className="flex-1 px-4">
          <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
            Profile
          </Link>
          <Link to="/order-details" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
            Orders
          </Link>
          <Link to="/cart" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
            Cart ({cart.length})
          </Link>
          {user?.admin && (
            <>
              <Link to="/admin/menu" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                Menu
              </Link>
              <Link to="/admin/restaurant" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                Restaurant
              </Link>
              <Link to="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                Orders
              </Link>
            </>
          )}
        </SheetDescription>

        <SheetFooter className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="User Profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-800">{user?.fullname}</span>
          </div>

          {loading ? (
            <Button className="w-full bg-red-600 hover:bg-hoverred-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={logout} className="w-full bg-red-600 hover:bg-hoverred-600">
              Logout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
