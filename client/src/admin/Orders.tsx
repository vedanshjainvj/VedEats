import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const Orders = () => {
  const {
    restaurantOrder,
    getRestaurantOrders,
    updateRestaurantOrder,
  } = useRestaurantStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query params for page and limit
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 2;

  // Fetch orders based on current page and limit
  useEffect(() => {
    getRestaurantOrders(page, limit);
  }, [page, limit]);

  // Handle page change
  const handlePageChange = (newPage:Number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
    getRestaurantOrders(newPage, limit);
  };

  // Handle limit change
  const handleLimitChange = (newLimit:Number) => {
    setSearchParams({ page: "1", limit: newLimit.toString() });
    getRestaurantOrders(1, newLimit);
  };

  // Handle status change
  const handleStatusChange = async (id:Number, status:any) => {
    try {
      await updateRestaurantOrder(id as any, status); // Update in MongoDB
      toast.success(`Order status updated to "${status}"`); // Show toast
      getRestaurantOrders(page, limit); // Refetch orders with current pagination
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
        Orders Overview
      </h1>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Items per Page
          </Label>
          <Select
            onValueChange={(value) => handleLimitChange(Number(value))}
            defaultValue={limit.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[1,2,3].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-l"
          >
            Previous
          </button>
          <span className="px-4">{page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded-r"
            disabled={restaurantOrder.length < limit}
          >
            Next
          </button>
        </div>
      </div>

      {/* Restaurant Orders Display */}
      <div className="space-y-8">
        {restaurantOrder.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
          >
            {/* Order Details */}
            <div className="flex-1 mb-6 sm:mb-0">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {order.deliveryDetails.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">Order ID: </span>
                {order._id}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">Address: </span>
                {order.deliveryDetails.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">Total Amount: </span>
                ₹{order.totalAmount / 100}
              </p>
            </div>

            {/* Order Status */}
            <div className="w-full sm:w-1/3">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </Label>
              <Select
                onValueChange={(newStatus) =>
                  handleStatusChange(order._id as any, newStatus)
                }
                defaultValue={order.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
                      "Pending",
                      "Confirmed",
                      "Preparing",
                      "Out For Delivery",
                      "Delivered",
                    ].map((status, index) => (
                      <SelectItem key={index} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
