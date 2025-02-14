import { Minus, Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cartType";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart } = useCartStore();

  let totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
          {/* Table Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Shopping Cart</h3>
            <Button onClick={clearCart} variant="destructive" className="text-sm flex items-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-300 dark:border-gray-700">
                <TableHead className="text-left">Item</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Remove</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cart.map((item: CartItem) => (
                <TableRow key={item._id} className="border-b border-gray-200 dark:border-gray-700">
                  {/* Item Image & Name */}
                  <TableCell className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.image || "/placeholder.png"} alt={item.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-800 dark:text-white">{item.name}</span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="text-center font-semibold text-gray-700 dark:text-gray-300">
                    ₹{item.price.toFixed(2)}
                  </TableCell>

                  {/* Quantity Control */}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        onClick={() => decrementQuantity(item._id)}
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-gray-200 dark:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium text-lg">{item.quantity}</span>
                      <Button
                        onClick={() => incrementQuantity(item._id)}
                        size="icon"
                        className="rounded-full bg-red-600 hover:bg-red-500 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>

                  {/* Total Price */}
                  <TableCell className="text-center font-semibold text-gray-800 dark:text-gray-300">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </TableCell>

                  {/* Remove Button */}
                  <TableCell className="text-center">
                    <Button
                      onClick={() => removeFromTheCart(item._id)}
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* Table Footer */}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-semibold text-lg">
                  Total:
                </TableCell>
                <TableCell className="text-center font-bold text-xl text-gray-900 dark:text-white">
                  ₹{totalAmount.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Checkout Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setOpen(true)}
              className="bg-red-600 hover:bg-red-500 px-6 py-3 text-lg font-semibold text-white rounded-lg transition"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
