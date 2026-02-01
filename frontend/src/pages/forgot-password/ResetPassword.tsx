/* eslint-disable @typescript-eslint/no-explicit-any */
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { KeyRound, Lock } from "lucide-react";
import { toast } from "react-toastify";

type ResetInputs = {
  otp: string;
  newPassword: string;
};

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetInputs>();

  const [error, setError] = useState("");

  const onSubmit = async (data: ResetInputs) => {
    try {
      await resetPassword(data as any).unwrap();
      setError("");
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.data?.message || "Something went wrong");
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
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold mt-4">Reset Password</h2>
            <p className="text-sm mt-1">
              Enter the OTP and your new password to reset your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* OTP Input */}
            <div>
              <label className="text-sm font-medium">OTP</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-4 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  {...register("otp", { required: "OTP is required" })}
                />
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium">New Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-4 h-5 w-5" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-0.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 cursor-pointer bg-sky-100 text-indigo-700 font-semibold rounded-lg shadow hover:bg-sky-200 transition disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
