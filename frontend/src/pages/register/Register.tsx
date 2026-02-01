// src/pages/register/Register.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import { ArrowLeftToLine, Eye, EyeOff } from "lucide-react";

/* ======================== TYPES ======================== */

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  nid: string;
};

/* ======================== COMPONENT ======================== */

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>();

  /* ======================== SUBMIT HANDLER ======================== */

  const onSubmit = async (data: RegisterInput) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(data).unwrap();
      if (res.success) {
        toast.success(res.message || "Registration Successful!");
        navigate("/register-otp", { state: { email: data.email } });
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Link
        to="/"
        className="absolute top-4 right-6 text-gray-600 border p-2 rounded-sm hover:text-green-500 transition-all duration-500 flex items-center"
      >
        <span className="mr-1">
          <ArrowLeftToLine />
        </span>
        home
      </Link>

      {/* ================= LEFT SIDE IMAGE ================= */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg"
          alt="Register visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ================= RIGHT SIDE REGISTER FORM ================= */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* -------- Header -------- */}
          <h1 className="text-3xl font-bold mb-2 text-gray-900 pb-16">
            Get Started Now
          </h1>

          {/* -------- Register Form -------- */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ===== Name ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* ===== Email ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ===== Password ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ===== Confirm Password ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-4 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* ===== Phone ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register("phone", { required: "Phone number is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* ===== NID ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NID Number
              </label>
              <input
                {...register("nid", { required: "NID number is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                placeholder="Enter NID number"
              />
              {errors.nid && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nid.message}
                </p>
              )}
            </div>

            {/* ===== Submit Button ===== */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-white bg-green-700 hover:bg-green-800 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Create Account"}
            </button>
          </form>

          {/* -------- Footer -------- */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
