import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface INavItem {
  path: string;
  label: string;
}

const navItems: INavItem[] = [
  { path: "/", label: "Home" },
  { path: "/electricity", label: "Electricity" },
  { path: "/water", label: "Water" },
  { path: "/gas", label: "Gas" },
  { path: "/road", label: "Road" },
  { path: "/others", label: "Others" },
];

const NavItems = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex md:items-center flex-col md:space-x-6 md:flex-row space-y-3 md:space-y-0">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `relative group px-1 pb-1 font-medium transition-colors duration-300 ${
              isActive ? "text-[#239c47]" : "text-gray-700 hover:text-[#239c47]"
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative inline-block">
              {item.label}

              {/* Hover underline */}
              {!isActive && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#239c47] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              )}

              {/* Active underline animation */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key="active-underline"
                    className="absolute left-0 bottom-0 w-full h-0.5 bg-[#239c47] rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default NavItems;