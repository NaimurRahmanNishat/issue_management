/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";

type ForgotInputs = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgetPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotInputs>();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async ({ email }: ForgotInputs) => {
    try {
      await forgotPassword({ email }).unwrap();
      setMessage("OTP sent to your email!");
      setError("");
      navigate("/reset-password");
      toast.success("OTP sent to your email!");
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/20 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="h-14 w-14 mx-auto bg-white/30 rounded-full flex items-center justify-center shadow">
              <Mail className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold mt-4">Forgot Password</h2>
            <p className="text-sm mt-1">
              Enter your email and we&apos;ll send you an OTP to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email Input */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-4 h-5 w-5" />
                
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Success Message */}
            {message && (
              <p className="text-green-200 text-sm text-center">{message}</p>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 cursor-pointer bg-sky-100 text-indigo-700 font-semibold rounded-lg shadow hover:bg-sky-200 transition disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
