/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";

interface DeleteCategoryAdminModalProps {
  admin: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCategoryAdminModal = ({ admin, isOpen, onClose, onConfirm }: DeleteCategoryAdminModalProps) => {
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 relative text-center"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Delete Category Admin
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{admin.name}</span>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteCategoryAdminModal;
