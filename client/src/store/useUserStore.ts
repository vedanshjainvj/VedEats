import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:8000/api/v1/user";
axios.defaults.withCredentials = true;

type User = {
  fullname: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,

      // Signup
      signup: async (input: SignupInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const user = response.data.data.user;
          if (user) {
            toast.success(response.data.message);
            set({ loading: false, user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Login
      login: async (input: LoginInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const user = response.data.data.user;
          if (user) {
            toast.success(response.data.message);
            set({ loading: false, user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Verify Email
      verifyEmail: async (verificationCode: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response)
          const user = response.data.data;
          if (user) {
            toast.success(response.data.message);
            set({ loading: false, user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Check Authentication
      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const response = await axios.get(`${API_END_POINT}/check-auth`);
          const user = response.data.data.user;
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          }
        } catch (error) {
          set({ isAuthenticated: false, isCheckingAuth: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/logout`);
          toast.success(response.data.message);
          set({ loading: false, user: null, isAuthenticated: false });
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Forgot Password
      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/forgot-password`, {
            email,
          });
          toast.success(response.data.message);
          set({ loading: false });
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Reset Password
      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword }
          );
          console.log(response)
          toast.success(response.data.message);
          set({ loading: false });
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      // Update Profile
      updateProfile: async (input: any) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const user = response.data.data.user;
          if (user) {
            toast.success("Profile updated successfully");
            set({ user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
