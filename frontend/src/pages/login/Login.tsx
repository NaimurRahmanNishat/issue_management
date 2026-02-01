// src/pages/login/Login.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setAccessToken, setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

import { toast } from "react-toastify";
import { AlertCircle, ArrowLeftToLine, Eye, EyeOff } from "lucide-react";

type LoginInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  /* ========================== API MUTATIONS ========================== */
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const redirectPath = location.state?.from?.pathname || "/";

  /* ======================== FORM SUBMIT HANDLER ======================== */

const onSubmit = async (data: LoginInputs) => {
  try {
    setErrorMessage("");
    const res = await login(data).unwrap();
    if (res.success && res.data) {
      dispatch(setUser(res.data.user));              
      dispatch(setAccessToken(res.data.accessToken)); 
      toast.success(res.message || "Login Successfully!");
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(res.message || "Login failed");
    }
  } catch (error: any) {
    setErrorMessage(
      error?.data?.message ||
      error?.message ||
      "Invalid credentials. Please try again."
    );
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Link
        to="/"
        className="absolute top-4 left-6 text-gray-600 border p-2 rounded-sm hover:text-green-500 transition-all duration-500 flex items-center"
      >
        <span className="mr-1">
          <ArrowLeftToLine />
        </span>
        home
      </Link>

      {/* ======================== LEFT SIDE : LOGIN FORM ======================== */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* ============= Header ============= */}
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your Credentials to access your account
          </p>

          {/* ========================= Login Form ========================= */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ===== Email Field ===== */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ===== Password Field ===== */}
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

            {/* ===== Remember Me ===== */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600"
              />
              <label className="ml-2 text-sm text-gray-700">Remember me</label>
            </div>

            {!rememberMe && (
              <p className="text-xs text-gray-500">
                Please agree to remember your session to continue
              </p>
            )}

            {/* ===== Error Message ===== */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* ===== Submit Button ===== */}
            <button
              type="submit"
              disabled={!rememberMe || isLoginLoading}
              className={`w-full py-3 rounded-lg font-medium
                ${
                  !rememberMe || isLoginLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800 text-white"
                }`}
            >
              {isLoginLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* ========= Footer ========= */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ===================== RIGHT SIDE IMAGE ===================== */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg"
          alt="Login visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
