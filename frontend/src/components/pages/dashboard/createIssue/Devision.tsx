import { MapPin } from "lucide-react";

interface DevisionProps {
  issue: { division: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BangladeshDivision = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
];

const Devision = ({ issue, handleChange }: DevisionProps) => {
  return (
    <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
        Division
      </label>
      <select
        name="division"
        value={issue.division}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
      >
        <option value="">Select Division</option>
        {BangladeshDivision.map((division) => (
          <option key={division} value={division}>
            {division}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Devision;
