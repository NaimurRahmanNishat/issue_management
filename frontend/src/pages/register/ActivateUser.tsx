/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useActivateUserMutation } from "@/redux/features/auth/authApi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Key, AlarmClock, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type ActivationInput = {
  otp: string;
};

const ActivateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [activateUser, { isLoading }] = useActivateUserMutation();
  const {setValue,handleSubmit,formState: { errors }} = useForm<ActivationInput>();

  // 10 Minutes
  const [seconds, setSeconds] = useState(600);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const onSubmit = async (data: ActivationInput) => {
    if (!email) {
      toast.error("Email not found! Please register again.");
      return;
    }

    const payload = { email, activationCode: data.otp};

    try {
      const res = await activateUser(payload).unwrap();
      if (res.success) {
        toast.success("User activated successfully!");
        navigate("/login");
      } else {
        toast.error(res.message || "Activation failed");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Activation failed");
    }
  };

  const handleResend = () => {
    toast.info("New OTP sent to your email!");
    setSeconds(600);
    setCanResend(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Key className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Activate Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit OTP sent to your email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center justify-center">
              <InputOTP
              maxLength={6}
              onChange={(value) => setValue("otp", value)}
              className="flex justify-center items-center gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {errors.otp && (
              <p className="text-red-500 text-sm text-center">
                {errors.otp.message}
              </p>
            )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer flex justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <AlarmClock size={16} />
              <span>
                {canResend
                  ? "OTP expired"
                  : `Time Remaining: ${formatTime(seconds)}`}
              </span>
            </div>

            {/* Resend Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!canResend}
              onClick={handleResend}
            >
              Resend OTP
            </Button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ActivateUser;
