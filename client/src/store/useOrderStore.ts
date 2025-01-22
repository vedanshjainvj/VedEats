import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT: string = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [], 
      updateOrderInStore: async (updatedOrder:any) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          ),
        })),
      createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          window.location.href = response.data.data.url; // Redirect to Stripe's URL
        } catch (error) {
          console.error("Error creating checkout session:", error);
        } finally {
          set({ loading: false });
        }
      },
      getOrderDetails: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          // console.log(response)
          const fetchedOrders = response.data.data.orders || []; // Ensure fallback to empty array
          set({ orders: fetchedOrders });
        } catch (error) {
          console.error("Error fetching order details:", error);
          set({ orders: [] }); // Reset orders to an empty array if an error occurs
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "order-store",
      storage: createJSONStorage(() => localStorage), // Persist store to localStorage
    }
  )
);
