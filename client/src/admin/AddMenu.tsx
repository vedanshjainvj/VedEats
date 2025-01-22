import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const { restaurant, getRestaurant } = useRestaurantStore();

  useEffect(() => {
    getRestaurant();
  }, [getRestaurant]);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }
      await createMenu(formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between items-center">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl dark:text-white">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-orange hover:bg-hoverOrange dark:bg-[#f77f00] dark:hover:bg-[#e06b00]">
              <Plus className="mr-2" />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Add A New Menu</DialogTitle>
              <DialogDescription className="dark:text-gray-300">
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label className="dark:text-gray-200">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter menu name"
                  className="dark:bg-gray-700 dark:text-white"
                />
                {error?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label className="dark:text-gray-200">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter menu description"
                  className="dark:bg-gray-700 dark:text-white"
                />
                {error?.description && (
                  <span className="text-xs font-medium text-red-600">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <Label className="dark:text-gray-200">Price in (Rupees)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu price"
                  className="dark:bg-gray-700 dark:text-white"
                />
                {error?.price && (
                  <span className="text-xs font-medium text-red-600">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label className="dark:text-gray-200">Upload Menu Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                  className="dark:bg-gray-700 dark:text-white"
                />
                {error?.image?.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.image.name}
                  </span>
                )}
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button
                    disabled
                    className="bg-orange hover:bg-hoverOrange dark:bg-[#f77f00] dark:hover:bg-[#e06b00]"
                  >
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-hoverOrange dark:bg-[#f77f00] dark:hover:bg-[#e06b00]">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {restaurant?.menus.map((menu: any, idx: number) => (
          <div
            key={idx}
            className="relative shadow-md rounded-lg overflow-hidden border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <img
              src={menu.image}
              alt="Menu"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {menu.description}
              </p>
              <h2 className="text-md font-semibold mt-2">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h2>
            </div>
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedMenu(menu);
                  setEditOpen(true);
                }}
                className="p-2 bg-orange hover:bg-hoverOrange dark:bg-[#f77f00] dark:hover:bg-[#e06b00] text-white rounded-full"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 text-white rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;
