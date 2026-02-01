// src/components/pages/home/DivisionIssues.tsx

import { AuroraText } from "@/components/ui/aurora-text";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DivisionIssuesProps {
  name: string;
  value: string;
  description?: string;
}

const Divisions: DivisionIssuesProps[] = [
  { 
    name: "Dhaka", 
    value: "Dhaka",
    description: "View issues from Dhaka Division"
  },
  { 
    name: "Chattogram", 
    value: "Chattogram",
    description: "View issues from Chattogram Division"
  },
  { 
    name: "Rajshahi", 
    value: "Rajshahi",
    description: "View issues from Rajshahi Division"
  },
  { 
    name: "Khulna", 
    value: "Khulna",
    description: "View issues from Khulna Division"
  },
  { 
    name: "Barishal", 
    value: "Barishal",
    description: "View issues from Barishal Division"
  },
  { 
    name: "Sylhet", 
    value: "Sylhet",
    description: "View issues from Sylhet Division"
  },
  { 
    name: "Rangpur", 
    value: "Rangpur",
    description: "View issues from Rangpur Division"
  },
  { 
    name: "Mymensingh", 
    value: "Mymensingh",
    description: "View issues from Mymensingh Division"
  },
];

const DivisionIssues = () => {
  const navigate = useNavigate();

const handleDivisionClick = (divisionValue: string) => {
  navigate(`/divisions/${divisionValue}`);
};

  return (
<section className="py-6 md:py-10 lg:py-16">
      <h1 className="font-bold text-3xl md:text-4xl text-center mb-10">
        <AuroraText>Division Issues</AuroraText>
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Divisions.map((division: DivisionIssuesProps, index) => (
          <div
            key={index}
            onClick={() => handleDivisionClick(division.value)}
            className="group bg-white hover:bg-linear-to-br hover:from-blue-50 hover:to-blue-100 shadow-md rounded-2xl p-6 text-center border border-gray-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            {/* ✅ Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* ✅ Division Name */}
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
              {division.name}
            </h2>
            
            {/* ✅ Description */}
            <p className="text-gray-500 text-sm mt-2 group-hover:text-gray-700">
              {division.description}
            </p>

            {/* ✅ Hover indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">View Issues</span>
              <svg 
                className="w-4 h-4 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DivisionIssues;
