import { FileText } from "lucide-react";

interface TittleProps {
  issue: { title: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Tittle = ({ issue, handleChange }: TittleProps) => {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
        Title
      </label>
      <input
        type="text"
        name="title"
        value={issue.title}
        onChange={handleChange}
        required
        placeholder="Issue Title..."
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
};

export default Tittle;
