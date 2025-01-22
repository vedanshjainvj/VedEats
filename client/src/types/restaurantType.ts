import { Orders } from "./orderType";

export type MenuItem = {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}
export type Restaurant = {
    _id: string;
    user: string;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: number;
    cuisines: string[];
    menus: MenuItem[];
    imageUrl: string;
}

export type SearchedRestaurant = {
    data:Restaurant[]
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }

export type RestaurantState = {
    pagination: Pagination | null;
    loading: boolean;
    restaurant: Restaurant | null;
    searchedRestaurant: any
    appliedFilter:string[];
    singleRestaurant: Restaurant | null,
    restaurantOrder:Orders[],
    allRestaurants:Restaurant[],
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: any) => Promise<void>;
    addMenuToRestaurant: (menu: MenuItem) => void;
    updateMenuToRestaurant: (menu: MenuItem) => void;
    setAppliedFilter: (value:string) => void;
    resetAppliedFilter: () => void;
    getSingleRestaurant: (restaurantId:string) => Promise<void>;
    getRestaurantOrders: (page:any,limit:any) => Promise<void>;
    updateRestaurantOrder: (orderId:string, status:string) => Promise<void>;
    getAllRestaurants: () => Promise<void>;
}