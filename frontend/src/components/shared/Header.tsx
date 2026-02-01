// src/components/shared/Header.tsx
import { useState } from "react";
import { X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import NavItems from "./NavItems";
import SearchFilter from "./SearchFilter";
import UserAuth from "./UserAuth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8 xl:px-0 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          <NavItems onClose={() => setMenuOpen(false)} />
        </nav>

        {/* User + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <SearchFilter />
          <UserAuth />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-[#239c47] transition"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={28} className="cursor-pointer"/> : <Menu size={28} className="cursor-pointer"/>}
          </button>
        </div>
      </div>

      {/* Overlay (when mobile menu open) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Animated Right-side Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </Link>
          <button onClick={() => setMenuOpen(false)}>
            <X size={24} className="text-gray-600 cursor-pointer hover:text-pink-600" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
          <NavItems onClose={() => setMenuOpen(false)} />
        </nav>
      </div>
    </header>
  );
};

export default Header;
