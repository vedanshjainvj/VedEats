import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, X, Search, Star, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Restaurant } from "@/types/restaurantType";

const SearchPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    searchedRestaurant,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
    loading
  } = useRestaurantStore();

  useEffect(() => {
    if (params.text) {
      searchRestaurant(params.text, searchQuery, appliedFilter);
    }
  }, [params.text, appliedFilter, searchQuery]);

  const handleSearch = () => {
    searchRestaurant(params.text!, searchQuery, appliedFilter);
  };

  return (
    <div className="bg-accent-cream min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-accent-charcoal mb-4">
            Find Your Perfect Restaurant
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                placeholder="Search by restaurant name or cuisine"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 border-2 border-gray-100 focus:border-restaurant-300 rounded-xl"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="bg-restaurant-500 hover:bg-restaurant-600 text-white px-8 py-6 rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Section */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
              <FilterPage />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Applied Filters */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-lg font-semibold text-accent-charcoal">
                  {searchedRestaurant?.length || 0} Results Found
                </h2>
                <div className="flex flex-wrap gap-2">
                  {appliedFilter.map((filter: string, idx: number) => (
                    <Badge
                      key={idx}
                      className="bg-restaurant-50 text-restaurant-600 hover:bg-restaurant-100 rounded-lg px-3 py-1"
                    >
                      {filter}
                      <X
                        onClick={() => setAppliedFilter(filter)}
                        size={16}
                        className="ml-2 cursor-pointer"
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <SearchPageSkeleton />
              </div>
            ) : searchedRestaurant?.length === 0 ? (
              <NoResultFound searchText={params.text!} />
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {searchedRestaurant?.map((restaurant: Restaurant) => (
                  <Card
                    key={restaurant._id}
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-0"
                  >
                    <div className="relative">
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.restaurantName}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-restaurant-600 px-3 py-1">
                          <Clock size={14} className="mr-1" />
                          30-45 min
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-accent-charcoal">
                          {restaurant.restaurantName}
                        </h3>
                        <Badge className="bg-restaurant-50 text-restaurant-600">
                          <Star size={14} className="mr-1" /> 4.5
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span className="text-sm">{restaurant.city}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Globe size={16} className="mr-2" />
                          <span className="text-sm">{restaurant.country}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {restaurant.cuisines.map((cuisine: string, idx: number) => (
                          <Badge
                            key={idx}
                            className="bg-gray-100 text-gray-600 rounded-full px-3 py-1"
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 bg-gray-50">
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center text-restaurant-600">
                          <TrendingUp size={16} className="mr-1" />
                          <span className="text-sm font-medium">Popular Choice</span>
                        </div>
                        <Link to={`/restaurant/${restaurant._id}`}>
                          <Button className="bg-restaurant-500 hover:bg-restaurant-600 text-white rounded-xl px-6">
                            View Menu
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchPageSkeleton = () => (
  <>
    {[...Array(4)].map((_, index) => (
      <Card key={index} className="bg-white rounded-2xl overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

const NoResultFound = ({ searchText }: { searchText: string }) => (
  <div className="bg-white rounded-2xl p-8 text-center">
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-accent-charcoal mb-4">
        No Results Found
      </h2>
      <p className="text-gray-600 mb-6">
        We couldn't find any restaurants matching "{searchText}". 
        Try adjusting your search terms or filters.
      </p>
      <Link to="/">
        <Button className="bg-restaurant-500 hover:bg-restaurant-600 text-white px-6 py-2 rounded-xl">
          Back to Home
        </Button>
      </Link>
    </div>
  </div>
);

export default SearchPage;