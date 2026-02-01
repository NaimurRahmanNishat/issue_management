/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import type { CategoryType, Division } from "@/types/authType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  nid: string;
  division: Division;
  category: CategoryType;
}

const CreateCategoryAdmin = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<AdminFormInputs>();
  const [registerAdmin, { isLoading }] = useRegisterMutation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | string>("");
  const [selectedDivision, setSelectedDivision] = useState<Division | string>("");

  const onSubmit: SubmitHandler<AdminFormInputs> = async (data) => {
    if (!selectedCategory) {
      toast.error("Please select a category!");
      return;
    }

    const payload: any = {
      ...data,
      role: "category-admin",
      division: selectedDivision,
      category: selectedCategory,
    };

    try {
      const result = await registerAdmin(payload).unwrap();
      if (result?.success) {
        toast.success("Category admin created successfully!");
        reset();
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category admin");
    }
  };

  return (
    <div className="pb-4">
      <button
        onClick={() => setIsOpen(true)}
        className="md:px-6 px-3 md:py-3 py-2 cursor-pointer bg-pink-600 text-white font-normal md:font-medium rounded-lg shadow hover:bg-pink-700 transition-all duration-200"
      >
        Create Category Admin
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg mx-4 p-6 sm:p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute cursor-pointer top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Create Category Admin
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Enter name"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="Enter email"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Password</label>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    type="password"
                    placeholder="Enter password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                  <input
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                    type="password"
                    placeholder="Confirm password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: { value: 11, message: "Phone must be at least 11 characters" },
                    })}
                    type="text"
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                {/* NID */}
                  <div>
                  <label className="block text-gray-700 font-medium mb-2">NID Number</label>
                  <input
                    {...register("nid", {
                      required: "NID number is required",
                      minLength: { value: 10, message: "Phone must be at least 10 characters" },
                    })}
                    type="text"
                    placeholder="Enter nid number"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none ${
                      errors.nid ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.nid && <p className="text-red-500 text-sm mt-1">{errors.nid.message}</p>}
                </div>

                {/* DIVISION */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Division</label>
                  <Select onValueChange={(val) => setSelectedDivision(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dhaka">Dhaka</SelectItem>
                      <SelectItem value="Chattogram">Chattogram</SelectItem>
                      <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                      <SelectItem value="Khulna">Khulna</SelectItem>
                      <SelectItem value="Barishal">Barishal</SelectItem>
                      <SelectItem value="Sylhet">Sylhet</SelectItem>
                      <SelectItem value="Rangpur">Rangpur</SelectItem>
                      <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Select Category</label>
                  <Select onValueChange={(val) => setSelectedCategory(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="broken_road">Broken Road</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Admin"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCategoryAdmin;