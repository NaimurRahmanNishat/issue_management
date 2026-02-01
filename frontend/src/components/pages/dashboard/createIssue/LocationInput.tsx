import { MapPin } from "lucide-react";

interface LocationProps {
  issue: { location: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const LocationInput = ({ issue, handleChange }: LocationProps) => {
  return (
        <div>
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
        Location
      </label>
      <input
        type="text"
        name="location"
        value={issue.location}
        onChange={handleChange}
        required
        placeholder="Gulshan, Dhaka"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  )
}

export default LocationInput;