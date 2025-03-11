import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

// --------------- IMPORTING UI COMPONENTS ---------------
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

// --------------- IMPORTING OTHER FILES ---------------
import { useCartStore } from "@/store/useCartStore";
import { MenuItem } from "@/types/restaurantType";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  return (
    <div className="mt-12 px-6 md:px-8 lg:px-12">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-gray-900">Available Menus</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu: MenuItem, index: number) => (
          <Card key={index} className="shadow-lg rounded-lg overflow-hidden">
            <img src={menu.image} alt="Menu Item" className="w-full h-40 object-cover" />
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">{menu.name}</h2>
              <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                onClick={() => {
                  addToCart(menu);
                  navigate("/cart");
                  window.scrollTo(0,0)
                }}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart/>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
