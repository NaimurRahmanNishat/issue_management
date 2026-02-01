import { Calendar } from "lucide-react";

interface IssueDateProps {
  issue: { date: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IssueDate = ({ issue, handleChange }: IssueDateProps) => {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
        Date
      </label>
      <input
        type="date"
        name="date"
        value={issue.date}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
};

export default IssueDate;
