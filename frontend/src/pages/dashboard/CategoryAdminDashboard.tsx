import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import RightSection from "@/components/pages/dashboard/header/RightSection";

interface INavItem {
  path: string;
  label: string;
}

const navItems: INavItem[] = [
  { path: "/dashboard/category-admin", label: "Dashboard" },
  { path: "/dashboard/status-management", label: "Status Management" },
  { path: "/dashboard/user-management", label: "User Management" },
  { path: "/dashboard/profile-settings", label: "Profile & Settings" },
  { path: "/dashboard/receive-message", label: "Receive Massage" },
];

const CategoryAdminDashboard = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
        <div  className="bg-white md:h-screen flex flex-col shadow-md">
      {/* Header Section */}
      <div className="flex justify-between md:justify-center items-center p-5 border-b">
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="w-12 h-12" />
          </Link>
          <p className="text-xs italic text-pink-500 mt-1">Category Admin</p>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center space-x-4">
          <div className="md:hidden flex">
            <RightSection />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 cursor-pointer focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <ul className="hidden md:flex flex-col space-y-4 p-6">
        {navItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "text-[#f95937] font-semibold bg-gray-100"
                    : "text-[#0f172a] hover:text-[#f95937]"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="logo" className="w-12 h-12" />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 focus:outline-none"
          >
            <X size={28} />
          </button>
        </div>

        <ul className="flex flex-col space-y-4 p-6">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md transition ${
                    isActive
                      ? "text-[#f95937] font-semibold bg-gray-100"
                      : "text-[#0f172a] hover:text-[#f95937]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CategoryAdminDashboard;