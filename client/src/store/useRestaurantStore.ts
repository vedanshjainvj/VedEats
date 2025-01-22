
import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;



export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant: null,
    restaurantOrder: [],
    pagination: null,
    allRestaurants: [],
    createRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    getRestaurant: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/`);
            console.log(response)
           
                set({ loading: false, restaurant: response.data.data.restaurant });
           
        } catch (error: any) {
            if (error.response.status === 404) {
                set({ restaurant: null });
            }
            set({ loading: false });
        }
    },
    updateRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response)
            if (response.data.message) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
        try {
            set({ loading: true });

            const params = new URLSearchParams();
            // console.log(params)
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","));

            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            console.log(response)
            if (response.status === 200) {
                set({ loading: false, searchedRestaurant: response.data.data.restaurants });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
            restaurant: state.restaurant ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] } : null,
        }))
    },
    updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: any) => {
            
            if (state.restaurant) {
                const updatedMenuList = state.restaurant.menus.map((menu: any) => menu._id === updatedMenu._id ? updatedMenu : menu);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            // if state.restaruant is undefined then return state
            return state;
        })
    },
    setAppliedFilter: (value: string) => {
        set((state) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
            return { appliedFilter: updatedFilter }
        })
    },
    resetAppliedFilter: () => {
        set({ appliedFilter: [] })
    },
    getSingleRestaurant: async (restaurantId: string) => {
        try {
            const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
            console.log(response)
            if (response.status === 200) {
                set({ singleRestaurant: response.data.data.restaurant })
            }
        } catch (error) { }
    },
    getRestaurantOrders: async (page:any,limit:any) => {
        try {
            const response = await axios.get(`${API_END_POINT}/order`, {params: {page,limit}});
            if (response.status === 200) {
                set({ restaurantOrder: response.data.data.orders.reverse(), pagination: response.data.data.pagination });
            }
        } catch (error) {
            console.log(error);
        }
    },
    updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
            const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId ? { ...order, status: response.data.status } : order;
                })
                set({ restaurantOrder: updatedOrder });
                toast.success(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    getAllRestaurants: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/get-all`);
            console.log(response)
            if (response.status === 200) {
                set({ loading: false, allRestaurants: response.data.data.restaurants });
            }
        } catch (error) {
            set({ loading: false });
        }
    },

}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}))
