import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Mail } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<any>([]);
  const { loading, verifyEmail } = useUserStore();
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
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
              src="https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-vector-illustration-of-unlocked-smartphone-with-password-notification-securing-mobile-phone-user-authentication-login-and-advanced-protection-technology-vector-png-image_47191140.jpg"
              alt="Restaurant Verification"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-restaurant-900/70 to-restaurant-900/40 flex items-center justify-center">
              <div className="text-white p-8 max-w-xl text-center lg:text-left relative z-10">
                <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Almost There!</h1>
                <p className="text-lg text-gray-200 drop-shadow">Verify your email to start your culinary journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-accent-charcoal/10">
          {/* Mobile Logo Section */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full shadow-md border-4 border-restaurant-500/20 bg-restaurant-50 flex items-center justify-center">
              <Mail className="w-10 h-10 text-restaurant-500" />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-restaurant-800">Verify Your Email</h2>
            <p className="text-accent-charcoal/60 max-w-sm mx-auto">
              We've sent a 6-digit verification code to your email address. Enter the code below to confirm your email.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit: string, idx: number) => (
                <Input
                  key={idx}
                  ref={(element) => (inputRef.current[idx] = element)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-2xl font-bold rounded-xl 
                    border-accent-charcoal/20 focus:ring-restaurant-500 focus:border-restaurant-500 
                    shadow-sm transition-all bg-white"
                />
              ))}
            </div>

            {loading ? (
              <Button disabled className="w-full h-12 bg-restaurant-500 hover:bg-restaurant-600 rounded-xl shadow-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 bg-restaurant-500 hover:bg-restaurant-600 text-white rounded-xl 
                  shadow-md transition-all hover:shadow-lg active:shadow-md"
              >
                Verify Email
              </Button>
            )}
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-accent-charcoal/60">
              Didn't receive the code?{" "}
              <button className="text-restaurant-600 hover:text-restaurant-700 font-medium transition-colors">
                Resend Code
              </button>
            </p>
            <p className="text-xs text-accent-charcoal/40">
              Please check your spam folder if you don't see the email in your inbox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;