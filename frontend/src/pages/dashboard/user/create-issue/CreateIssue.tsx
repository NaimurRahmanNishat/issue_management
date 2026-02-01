/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCreateIssueMutation } from "@/redux/features/issues/issueApi";
import Categories from "@/components/pages/dashboard/createIssue/Categories";
import IssueDate from "@/components/pages/dashboard/createIssue/IssueDate";
import UploadImage from "@/components/pages/dashboard/createIssue/UploadImage";
import Tittle from "@/components/pages/dashboard/createIssue/Tittle";
import Devision from "@/components/pages/dashboard/createIssue/Devision";
import Description from "@/components/pages/dashboard/createIssue/Description";
import LocationInput from "@/components/pages/dashboard/createIssue/LocationInput";
import type { CategoryType, Division } from "@/types/authType";
import { toast } from "react-toastify";

interface IssueFormData {
  title: string;
  category: CategoryType | "";
  description: string;
  location: string;
  division: Division | "";
  date: string;
  images: File[]; 
}

const CreateIssue = () => {
  const navigate = useNavigate();
  const [uploadKey, setUploadKey] = useState(0);
  const [issue, setIssue] = useState<IssueFormData>({
    title: "",
    category: "",
    description: "",
    location: "",
    division: "",
    date: new Date().toISOString().split("T")[0],
    images: [],
  });

  const [createIssue, { isLoading, error }] = useCreateIssueMutation();
  const [successMessage, setSuccessMessage] = useState<string>("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (images: File[]) => {
    setIssue((prev) => ({ ...prev, images }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (
    !issue.title ||
    !issue.category ||
    !issue.description ||
    !issue.location ||
    !issue.division ||
    !issue.date
  ) {
    alert("Please fill in all fields.");
    return;
  }

  if (issue.images.length === 0) {
    alert("Please upload at least one image.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", issue.title);
    formData.append("category", issue.category as string);
    formData.append("description", issue.description);
    formData.append("location", issue.location);
    formData.append("division", issue.division as string);
    formData.append("date", issue.date);

    issue.images.forEach((file) => {
      formData.append("images", file);
    });

await createIssue(formData).unwrap();

setSuccessMessage("Issue created successfully!");

// Reset form
setIssue({
  title: "",
  category: "",
  description: "",
  location: "",
  division: "",
  date: new Date().toISOString().split("T")[0],
  images: [],
});

// 🔥 THIS LINE IS THE FIX
setUploadKey((prev) => prev + 1);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  } catch (err: any) {
    console.error("Error creating issue:", err);

    let errorMessage = "Issue creation failed. Try again.";

    if (err?.data?.message) {
      errorMessage = err.data.message;
    } else if (err?.status === 401) {
      errorMessage = "please login first";
      navigate("/login");
    }
    alert(errorMessage);
  }
};

  if(successMessage){
    toast.success(successMessage);
  }

  return (
<motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        New Issue Create
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-2 lg:p-6 rounded-lg shadow-md"
      >
        <Tittle issue={issue} handleChange={handleChange} />
        <Categories issue={issue} handleChange={handleChange} />
        <Devision issue={issue} handleChange={handleChange} />
        <LocationInput issue={issue} handleChange={handleChange} />
        <Description issue={issue} handleChange={handleChange} />
        <IssueDate issue={issue} handleChange={handleChange} />
        <UploadImage
          key={uploadKey}
          setIssue={handleImagesChange}
          currentImages={issue.images}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {"data" in error
              ? (error as any).data.message
              : "Something went wrong. Please try again."}
          </div>
        )}

        <div className="flex w-full items-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md cursor-pointer font-semibold ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white transition duration-200`}
          >
            {isLoading ? "Issues Creating..." : "Submit Issue"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateIssue;

