import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant } = useRestaurantStore();

  useEffect(() => {
    getSingleRestaurant(params.id!);
  }, [params.id]);

  return (
    <div className="max-w-6xl mx-auto my-12 px-6 md:px-8 lg:px-12">
      <div className="w-full space-y-8">
        {/* Restaurant Image */}
        <div className="relative w-full h-40 md:h-64 lg:h-80">
          <img
            src={singleRestaurant?.imageUrl || "Loading..."}
            alt="Restaurant Image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        
        {/* Restaurant Details */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {singleRestaurant?.restaurantName || "Loading..."}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => (
                <Badge key={idx} className="px-3 py-1 text-sm font-medium">{cuisine}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Timer className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-medium text-gray-700">
                Delivery Time: <span className="text-[#D19254] font-semibold">{singleRestaurant?.deliveryTime || "NA"} mins</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Menus */}
      {singleRestaurant?.menus && <AvailableMenu menus={singleRestaurant?.menus!} />} 
    </div>
  );
};

export default RestaurantDetail;