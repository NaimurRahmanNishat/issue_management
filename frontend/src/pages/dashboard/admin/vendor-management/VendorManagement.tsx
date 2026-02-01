/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Loading from "@/components/shared/Loading";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { AuroraText } from "@/components/ui/aurora-text";
import CreateCategoryAdmin from "@/components/pages/dashboard/admin/CreateCategoryAdmin";
import DeleteCategoryAdminModal from "@/components/pages/dashboard/admin/DeleteCategoryAdminModal";
import UpdateCategoryAdmin from "@/components/pages/dashboard/admin/UpdateCategoryAdmin";
import { useDeleteCategoryAdminByIdMutation, useGetAllCategoryAdminsQuery } from "@/redux/features/users/userApi";

const ITEMS_PER_PAGE = 10;

const CategoryAdminManagement = () => {
  const { data, isLoading, error } = useGetAllCategoryAdminsQuery();
  const [deleteCategoryAdmin, { isLoading: isDeleting }] = useDeleteCategoryAdminByIdMutation();

  const [page, setPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const admins = data?.data || [];

  // Pagination logic
  const totalPages = Math.ceil(admins.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedAdmins = admins.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryAdmin(id).unwrap();
      setIsDeleteOpen(false);
    } catch (error: any) {
      console.error(error?.data?.message || "Failed to delete admin");
    }
  };

  if (isLoading || isDeleting) return <Loading />;
  if (error) return <div>Failed to fetch data!</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-2xl font-semibold">
          <AuroraText>All Category Admin List</AuroraText>
        </h2>
        <CreateCategoryAdmin />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold">SL</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Division</th>
              <th className="p-3 text-left font-semibold">Category</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAdmins.map((admin: any, index: number) => (
              <tr key={admin._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{startIndex + index + 1}</td>
                <td className="p-3">{admin.name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.division || "N/A"}</td>
                <td className="p-3">{admin.category || "N/A"}</td>
                <td className="p-3 capitalize">{admin.role}</td>
                <td className="p-3 flex gap-3">
                  {/* Update Button */}
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsUpdateOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Pencil size={16} /> Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsDeleteOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-900"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {selectedAdmin && (
        <UpdateCategoryAdmin
          admin={selectedAdmin}
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
        />
      )}

      {selectedAdmin && (
        <DeleteCategoryAdminModal
          admin={selectedAdmin}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => handleDelete(selectedAdmin._id)}
        />
      )}
    </motion.div>
  );
};

export default CategoryAdminManagement;
