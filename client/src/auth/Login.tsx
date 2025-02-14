import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const { loading, login } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }
    try {
      await login(input);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-accent-cream">
      <div className="hidden lg:flex lg:w-1/2 relative shadow-2xl">
        <img
          src="https://c4.wallpaperflare.com/wallpaper/374/404/846/brown-bird-perching-during-daytime-wren-wren-wallpaper-preview.jpg"
          alt="Restaurant Ambiance"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-restaurant-900/70 to-restaurant-900/40 flex items-center justify-center">
          <div className="text-white p-8 max-w-xl text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Welcome to VedEats</h1>
            <p className="text-lg text-gray-200 drop-shadow">Experience the finest flavors delivered to your doorstep</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-accent-charcoal/10">
          <div className="lg:hidden text-center mb-6">
            <img
              src="https://thumb.ac-illust.com/d2/d2ae492f05c760c940cf457f4759f30f_t.jpeg"
              alt="VedEats Logo"
              className="w-20 h-20 mx-auto rounded-full shadow-md border-4 border-restaurant-500/20"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-restaurant-800 mb-2">Sign In</h2>
            <p className="text-accent-charcoal/60">Welcome back! Please enter your details</p>
          </div>

          <form onSubmit={loginSubmitHandler} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="pl-10 h-12 border-accent-charcoal/20 focus-visible:ring-restaurant-500 focus-visible:ring-1 focus-visible:border-restaurant-500 rounded-xl shadow-sm"
                />
                <Mail className="absolute top-3.5 left-3 text-accent-charcoal/50 h-5 w-5" />
                {errors.email && (
                  <span className="text-xs text-restaurant-600 mt-1 block pl-1">{errors.email}</span>
                )}
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  className="pl-10 h-12 border-accent-charcoal/20 focus-visible:ring-restaurant-500 focus-visible:ring-1 focus-visible:border-restaurant-500 rounded-xl shadow-sm"
                />
                <LockKeyhole className="absolute top-3.5 left-3 text-accent-charcoal/50 h-5 w-5" />
                {errors.password && (
                  <span className="text-xs text-restaurant-600 mt-1 block pl-1">{errors.password}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-restaurant-600 hover:text-restaurant-700 hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {loading ? (
              <Button disabled className="w-full h-12 bg-restaurant-500 hover:bg-restaurant-600 rounded-xl shadow-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 bg-restaurant-500 hover:bg-restaurant-600 text-white rounded-xl shadow-md transition-all hover:shadow-lg active:shadow-md"
              >
                Sign In
              </Button>
            )}
          </form>

          <div className="relative my-8">
            <Separator className="bg-accent-charcoal/10" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-accent-charcoal/60">
              or
            </span>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-12 border-accent-charcoal/20 hover:bg-accent-cream/50 rounded-xl shadow-sm transition-all"
            >
              Continue with Google
            </Button>

            <p className="text-center text-accent-charcoal/60 pt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-restaurant-600 hover:text-restaurant-700 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;