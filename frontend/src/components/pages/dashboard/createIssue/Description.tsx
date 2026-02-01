import { FileText } from "lucide-react";

interface DescriptionProps {
  issue: { description: string };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Description = ({ issue, handleChange }: DescriptionProps) => {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
        Description
      </label>
      <textarea
        name="description"
        value={issue.description}
        onChange={handleChange}
        required
        rows={5}
        placeholder="Issue Description..."
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
      />
    </div>
  );
};

export default Description;
