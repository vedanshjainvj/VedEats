import { ShoppingCart, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <div className="lg:px-20">
        <section className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between py-12 px-4 gap-8">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="space-y-6">
              {/* Tag line */}
              <div className="inline-block">
                <span className="bg-restaurant-100 text-restaurant-600 px-4 py-2 rounded-full text-sm font-medium">
                  #1 Food Delivery App
                </span>
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-accent-charcoal">
                  Craving Something
                  <span className="block text-restaurant-500 mt-2">
                    Delicious?
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Order from your favorite restaurants and track your delivery in real-time. 
                  Fresh food delivered to your doorstep.
                </p>
              </div>

              {/* Search Section */}
              <div className="relative max-w-xl">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search for restaurants or cuisines"
                      className="pl-10 pr-4 py-6 w-full border-2 border-gray-100 focus:border-restaurant-300 rounded-xl shadow-sm"
                    />
                  </div>
                  <Button 
                    onClick={() => navigate(`/search/${searchText}`)}
                    className="bg-restaurant-500 hover:bg-restaurant-600 text-white px-6 py-6 rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-restaurant-50 p-2 rounded-lg">
                    <ShoppingCart className="text-restaurant-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-charcoal">Free Delivery</h3>
                    <p className="text-sm text-gray-500">On orders above $30</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-restaurant-50 p-2 rounded-lg">
                    <ShieldCheck className="text-restaurant-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-charcoal">Secure Payment</h3>
                    <p className="text-sm text-gray-500">100% secure checkout</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Button 
                  className="bg-restaurant-500 hover:bg-restaurant-600 text-white px-8 py-6 rounded-xl flex items-center gap-2"
                >
                  Order Now
                  <ArrowRight size={20} />
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-restaurant-200 text-restaurant-600 hover:bg-restaurant-50 px-8 py-6 rounded-xl"
                >
                  View Menu
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-restaurant-500/10 rounded-full blur-3xl"></div>
              <img
                src="https://food-delivery-ecommerce-app.netlify.app/static/media/hero.e3ef74be.png"
                alt="Food Delivery"
                className="relative w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </section>
    </div>
  );
};

export default HeroSection;