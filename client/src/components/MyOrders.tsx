import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import { CartItem } from "@/types/cartType";
import { io,Socket } from "socket.io-client";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

let socket: Socket;

const MyOrders = () => {
  const { orders, getOrderDetails, updateOrderInStore } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    socket = io("http://localhost:8000");
    getOrderDetails();

    return () => {
      socket.disconnect();
    };
  }, [getOrderDetails]);

  // Listen for order update events from the backend
  useEffect(() => {
    if (socket) {
      socket.on("order-updated", (updatedOrder) => {
        console.log("Updated Order:", updatedOrder);
        updateOrderInStore(updatedOrder);
      });

      return () => {
        socket.off("order-updated");
      };
    }
  }, [updateOrderInStore]);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-8">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-8">
        Your Orders
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {orders.map((order: any, orderIndex: number) => {
          const totalOrderAmount = order.cartItems.reduce(
            (acc: number, item: CartItem) => acc + item.price * item.quantity,
            0
          );

          return (
            <div
              key={orderIndex}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 transition-transform hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                {/* Order Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Order #{order._id}
                  </h2>
                  <span
                    className={`text-sm font-bold py-1 px-3 rounded-full ${
                      order.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <Separator className="my-3" />

                {/* Items in the Order */}
                <div className="space-y-4">
                  {order.cartItems.map((item: CartItem, itemIndex: number) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div className="ml-3">
                          <h3 className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800 dark:text-gray-200 flex items-center text-sm font-medium">
                          <IndianRupee className="w-4 h-4" />
                          <span>{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                {/* Total Order Amount */}
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Total:</span>
                  <div className="text-gray-800 dark:text-gray-200 flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    <span>{totalOrderAmount}</span>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>

                {selectedOrder && (
                  <DialogContent className="max-w-2xl bg-gray-100 dark:bg-gray-800">
                    <DialogTitle className="text-gray-800 dark:text-gray-200">
                      Order Details
                    </DialogTitle>
                    <div className="text-gray-800 dark:text-gray-200 text-sm space-y-4">
                      <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Restaurant Name:</strong> {selectedOrder.restaurant.restaurantName || "N/A"}</p>
                      <p><strong>Items:</strong></p>
                      <ul className="list-disc pl-5">
                        {selectedOrder.cartItems.map((item: CartItem, index: number) => (
                          <li key={index}>
                            {item.name} - Qty: {item.quantity}, Price: {item.price}
                          </li>
                        ))}
                      </ul>
                      <p><strong>Total:</strong> {totalOrderAmount}</p>
                      <p>Delivery Details</p>
                      <ul className="list-disc pl-5">
                        <li><strong>Name:</strong> {selectedOrder.deliveryDetails.name}</li>
                        <li><strong>Email:</strong> {selectedOrder.deliveryDetails.email}</li>
                        <li><strong>Address:</strong> {selectedOrder.deliveryDetails.address}</li>
                        <li><strong>City:</strong> {selectedOrder.deliveryDetails.city}</li>
                      </ul>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          );
        })}
      </div>

      {/* Continue Shopping Button */}
      <Link to="/cart" className="mt-8">
        <Button className="bg-orange-500 hover:bg-orange-600 py-3 px-8 rounded-full shadow-lg transition-all hover:scale-105">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default MyOrders;
