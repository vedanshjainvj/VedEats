import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname: "",
    email: "",
    password: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Partial<SignupInputState>>({});
  const { signup, loading } = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }
    try {
      await signup(input);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-accent-cream">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 shadow-2xl">
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?fm=jpg&q=60&w=3000"
              alt="Restaurant Ambiance"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-restaurant-900/70 to-restaurant-900/40 flex items-center justify-center">
              <div className="text-white p-8 max-w-xl text-center lg:text-left relative z-10">
                <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Join VedEats Today</h1>
                <p className="text-lg text-gray-200 drop-shadow">Create your account and start exploring amazing dishes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-accent-charcoal/10">
          {/* Mobile Logo Section */}
          <div className="lg:hidden text-center mb-6">
            <img
              src="https://thumb.ac-illust.com/d2/d2ae492f05c760c940cf457f4759f30f_t.jpeg"
              alt="VedEats Logo"
              className="w-20 h-20 mx-auto rounded-full shadow-md border-4 border-restaurant-500/20"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-restaurant-800 mb-2">Create Account</h2>
            <p className="text-accent-charcoal/60">Fill in your details to get started</p>
          </div>

          <form onSubmit={loginSubmitHandler} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Full Name"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="pl-10 h-12 border-accent-charcoal/20 focus-visible:ring-restaurant-500 focus-visible:ring-1 focus-visible:border-restaurant-500 rounded-xl shadow-sm"
                />
                <User className="absolute top-3.5 left-3 text-accent-charcoal/50 h-5 w-5" />
                {errors.fullname && (
                  <span className="text-xs text-restaurant-600 mt-1 block pl-1">{errors.fullname}</span>
                )}
              </div>

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

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Contact"
                  name="contact"
                  value={input.contact}
                  onChange={changeEventHandler}
                  className="pl-10 h-12 border-accent-charcoal/20 focus-visible:ring-restaurant-500 focus-visible:ring-1 focus-visible:border-restaurant-500 rounded-xl shadow-sm"
                />
                <PhoneOutgoing className="absolute top-3.5 left-3 text-accent-charcoal/50 h-5 w-5" />
                {errors.contact && (
                  <span className="text-xs text-restaurant-600 mt-1 block pl-1">{errors.contact}</span>
                )}
              </div>
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
                Create Account
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
              Already have an account?{" "}
              <Link to="/login" className="text-restaurant-600 hover:text-restaurant-700 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;