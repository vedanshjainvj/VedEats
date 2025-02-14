import { FormEvent, useRef, useState } from "react";
import {
  Loader2,
  Mail,
  MapPin,
  Camera,
  Phone,
  User,
  Settings,
  CreditCard,
  Heart,
  Clock,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    city: user?.city || "",
    country: user?.country || "",
    contact: user?.contact || "",
    profilePicture: user?.profilePicture || "",
  });

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    profileData.profilePicture || ""
  );

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-xl shadow-sm p-4">
            {/* User Quick Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedProfilePicture} />
                <AvatarFallback className="bg-restaurant-100 text-restaurant-500">
                  {profileData.fullname.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {profileData.fullname}
                </h2>
                <p className="text-xs text-gray-500 truncate">{profileData.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg
                              transition-colors duration-200 ${
                                activeTab === item.id
                                  ? 'bg-restaurant-50 text-restaurant-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                );
              })}
              
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mt-4">
                <LogOut className="h-4 w-4" />
                <span className="flex-1 text-left">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === 'profile' && (
                <form onSubmit={updateProfileHandler} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback className="bg-restaurant-100 text-restaurant-500 text-xl">
                          {profileData.fullname.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        ref={imageRef}
                        type="file"
                        accept="image/*"
                        onChange={fileChangeHandler}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => imageRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-restaurant-500 p-2 rounded-full hover:bg-restaurant-600"
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        name="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Contact</Label>
                      <Input
                        name="contact"
                        value={profileData.contact}
                        onChange={changeHandler}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={profileData.city}
                        onChange={changeHandler}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        name="country"
                        value={profileData.country}
                        onChange={changeHandler}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-restaurant-500 hover:bg-restaurant-600 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-12 text-gray-500">
                  Order history will be displayed here
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-12 text-gray-500">
                  Favorite restaurants will be displayed here
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="text-center py-12 text-gray-500">
                  Payment methods will be displayed here
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12 text-gray-500">
                  Account settings will be displayed here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;