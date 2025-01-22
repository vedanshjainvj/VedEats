import React, { useEffect, useState } from 'react';
import { useMenuStore } from '@/store/useMenuStore';
import { ShoppingCart } from 'lucide-react';

const MenuCard = () => {
  // Fetch menu items from the store
  const { allMenus, getAllMenus, loading } = useMenuStore(state => ({
    allMenus: state.allMenus,
    getAllMenus: state.getAllMenus,
    loading: state.loading,
  }));

  // Local state to control the fetching process
  const [menusFetched, setMenusFetched] = useState(false);

  // Fetch all menus only if they haven't been fetched yet
  useEffect(() => {
    if (!menusFetched && !loading) {
      getAllMenus();  // Trigger fetching if menus are not fetched
      setMenusFetched(true);  // Mark menus as fetched
    }
  }, [menusFetched, loading, getAllMenus]); // Dependency array ensures effect runs only once

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-8">
      {allMenus.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">No menus available at the moment.</p>
      ) : (
        allMenus.map((menu) => (
          <div key={menu.id} className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden">
            {/* Menu Image */}
            <img
              src={menu.imageUrl || 'https://via.placeholder.com/400x250'} // Add a default image URL
              alt={menu.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              {/* Menu Title */}
              <h3 className="text-xl font-semibold text-gray-800">{menu.name}</h3>

              {/* Menu Description */}
              <p className="mt-2 text-gray-600 text-sm">{menu.description}</p>

              {/* Menu Price */}
              <p className="mt-2 text-lg font-semibold text-gray-800">${menu.price}</p>

              {/* Add to Cart Button */}
              <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                <ShoppingCart className="inline-block mr-2" size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MenuCard;
