/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { CategoryType, Division } from "@/types/authType";
import { useUpdateCategoryAdminRoleMutation } from "@/redux/features/users/userApi";

interface UpdateCategoryAdminProps {
  admin: any;
  isOpen: boolean;
  onClose: () => void;
}

interface UpdateFormInputs {
  category: CategoryType;
  division: Division;
}

const UpdateCategoryAdmin = ({ admin, isOpen, onClose }: UpdateCategoryAdminProps) => {
  const { handleSubmit } = useForm<UpdateFormInputs>({
    defaultValues: {
      category: admin.category,
      division: admin.division,
    },
  });

  const [updateRole, { isLoading }] = useUpdateCategoryAdminRoleMutation();

  // Directly use admin props for initial state
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(admin.category);
  const [selectedDivision, setSelectedDivision] = useState<Division>(admin.division);

  // Only update state when admin changes
  useEffect(() => {
    if (admin.category !== selectedCategory) setSelectedCategory(admin.category);
    if (admin.division !== selectedDivision) setSelectedDivision(admin.division);
  }, [admin]);

  const onSubmit: SubmitHandler<UpdateFormInputs> = async () => {
    try {
      await updateRole({
        id: admin._id,
        category: selectedCategory,
        division: selectedDivision,
      }).unwrap();
      toast.success("Category admin updated successfully!");
      onClose();
    } catch (err: any) {
  let message = "Failed to update category admin";

  // API থেকে response আছে কিনা
  if ("data" in err) {
    if (typeof err.data === "string") message = err.data;
    else if (err.data?.message) message = err.data.message;
  } 
  // client/network error
  else if (err.message) {
    message = err.message;
  }

  toast.error(message);
}

  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-40 flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Update Category Admin
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Division */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Division</label>
                <Select value={selectedDivision} onValueChange={(val) => setSelectedDivision(val as Division)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select division" />
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
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val as CategoryType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="broken-road">Broken Road</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Admin"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateCategoryAdmin;
