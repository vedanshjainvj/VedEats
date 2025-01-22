import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

// Define the API endpoint
const API_END_POINT = "http://localhost:8000/api/v1/menu";
axios.defaults.withCredentials = true;

// Define the types for the menu data (You can adjust the structure as needed)
type Menu = {
  id: string;
  name: string;
  price: number;
  description: string;
  // Add more properties as needed
};

type MenuState = {
  loading: boolean;
  menu: Menu | null;
  allMenus: Menu[];
  
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
  getAllMenus: () => Promise<void>;
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      loading: false,
      menu: null,
      menuFetched: false,
      allMenus: [],

      // Create Menu
      createMenu: async (formData: FormData) => {
        try {
          set({ loading: true });

          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const { statusCode, message, data } = response.data;

          if (statusCode === 200 && data?.menu) {
            toast.success(message || "Menu created successfully");
            set({ menu: data.menu, loading: false });

            // Update the restaurant store
            useRestaurantStore.getState().addMenuToRestaurant(data.menu);
          } else {
            toast.error(message || "Something went wrong");
            set({ loading: false });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Internal Server Error";
          toast.error(errorMessage);
          set({ loading: false });
        }
      },

      // Edit Menu
      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true });

          const response = await axios.put(`${API_END_POINT}/${menuId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const { statusCode, message, data } = response.data;

          if (statusCode === 200 && data?.menu) {
            toast.success(message || "Menu updated successfully");
            set({ menu: data.menu, loading: false });

            // Update the restaurant store
            useRestaurantStore.getState().updateMenuToRestaurant(data.menu);
          } else {
            toast.error(message || "Something went wrong");
            set({ loading: false });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Internal Server Error";
          toast.error(errorMessage);
          set({ loading: false });
        }
      },

      // Get All Menus
      getAllMenus: async () => {
        const { allMenus, menuFetched } = get(); // Access both allMenus and menuFetched flags

        // Prevent refetching if already fetched
        if (menuFetched || allMenus.length > 0) return;

        try {
          set({ loading: true });

          const response = await axios.get(`${API_END_POINT}/get-all`);
          const { statusCode, message, data } = response.data;

          if (statusCode === 200 && data?.menus) {
            set({ allMenus: data.menus, loading: false, menuFetched: true }); // Set menuFetched flag to true
          } else {
            toast.error(message || "Something went wrong");
            set({ loading: false });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "Internal Server Error";
          toast.error(errorMessage);
          set({ loading: false });
        }
      },
    }),
    {
      name: "menu-name", // Persisting the store's data to localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
