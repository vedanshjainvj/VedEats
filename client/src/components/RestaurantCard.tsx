import { useEffect } from "react";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useNavigate } from "react-router-dom";

const RestaurantCard = () => {
  const { getAllRestaurants, allRestaurants, loading, getSingleRestaurant } =
    useRestaurantStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRestaurants(); // Fetch all restaurants on component mount
  }, [getAllRestaurants]);

  const handleViewDetails = async (restaurantId:any) => {
    try {
      await getSingleRestaurant(restaurantId); // Fetch single restaurant details
      navigate(`/restaurant/${restaurantId}`); // Navigate to the restaurant page
    } catch (error) {
      console.error("Error fetching restaurant details", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg font-medium text-gray-500">
        Loading restaurants...
      </p>
    );
  }

  if (allRestaurants.length === 0) {
    return (
      <p className="text-center text-lg font-medium text-gray-500">
        No restaurants found!
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Explore <span className="text-red-600">Restaurants</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {allRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transform hover:scale-105 transition duration-300"
          >
            {/* Restaurant Image */}
            <div className="relative">
              <img
                src={restaurant.imageUrl || "https://via.placeholder.com/150"}
                alt={restaurant.restaurantName}
                className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 hover:scale-110"
              />
              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                {restaurant.city}
              </span>
            </div>

            {/* Restaurant Details */}
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 truncate hover:text-red-600 transition duration-300">
                {restaurant.restaurantName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{restaurant.cuisines}</p>
            </div>

            {/* View Details Button */}
            <div className="p-4 flex justify-end items-center">
              <button
                className="flex items-center bg-red-600 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition duration-300"
                onClick={() => handleViewDetails(restaurant._id)}
              >
                Menu
                <span className="ml-2 material-icons">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantCard;
