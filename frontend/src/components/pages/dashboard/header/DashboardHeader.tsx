// src/components/pages/dashboard/header/DashboardHeader.tsx

import RightSection from "./RightSection";

const DashboardHeader = () => {


  return (
    <header className="md:flex items-center justify-between p-8.5 bg-white hidden">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
      
      {/* right section */}
      <div>
        <RightSection/>
      </div>
    </header>
  );
};

export default DashboardHeader;
