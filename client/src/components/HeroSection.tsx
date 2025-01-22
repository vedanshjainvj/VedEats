import { useState } from "react";
import { ShoppingCart, ShieldCheck, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import MaxWidthWrapper from './MaxWidthWrapper';

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();

  return (
    <MaxWidthWrapper>
    <section className=" px-6 lg:flex lg:items-center lg:justify-between">
      {/* Text Content */}
      <div className="lg:w-1/2">
        <h1 className="text-2xl text-gray-900 leading-snug">
          Easy way to make an order
        </h1>
        <h2 className="mt-4 text-5xl font-bold text-gray-900">
          <span className="text-red-600">HUNGRY?</span> Just wait
          <br />
          food at <span className="text-red-600">your door</span>
        </h2>
        <p className="mt-4 text-gray-600 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui magni
          delectus tenetur autem, sint veritatis!
        </p>

        {/* Search Bar */}
        <div className="relative flex items-center gap-2 mt-6">
          <Input
            type="text"
            value={searchText}
            placeholder="Search restaurant by name, city & country"
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 shadow-lg w-full md:w-[60%]"
          />
          <Search className="text-gray-500 absolute inset-y-2 left-2" />
          <Button
            onClick={() => navigate(`/search/${searchText}`)}
            className="bg-red-600 hover:bg-red-700"
          >
            Search
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition">
            Order now
          </button>
          <button className="border border-red-600 text-red-600 py-2 px-6 rounded-lg hover:bg-red-100 transition">
            See all foods
          </button>
        </div>

        {/* Feature Icons */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-red-600" size={24} />
            <span className="text-gray-700">No shipping charge</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-red-600" size={24} />
            <span className="text-gray-700">100% secure checkout</span>
          </div>
        </div>
      </div>

      {/* Image Content */}
      <div className="mt-10 lg:mt-0 lg:w-1/2">
        <img
          src="https://food-delivery-ecommerce-app.netlify.app/static/media/hero.e3ef74be.png"
          alt="Delivery Person"
          className="w-full"
        />
      </div>
    </section>
    </MaxWidthWrapper>
  );
};

export default HeroSection;
