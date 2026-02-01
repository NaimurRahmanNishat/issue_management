import { Tag } from "lucide-react";

interface CategoriesProps {
  issue: { category: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const categoryOptions = [
  { value: "electricity", label: "Electricity" },
  { value: "water", label: "Water" },
  { value: "gas", label: "Gas" },
  { value: "broken_road", label: "Broken Road" },
  { value: "other", label: "Other" }
];

const Categories = ({ issue, handleChange }: CategoriesProps) => {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <Tag className="w-4 h-4 mr-2 text-indigo-600" />
        Issue Category *
      </label>
      <select
        name="category"
        value={issue.category}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white appearance-none"
      >
        <option value="">Select Category</option>
        {categoryOptions.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Categories;