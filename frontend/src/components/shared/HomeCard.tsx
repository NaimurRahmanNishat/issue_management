import type { Issue } from "@/types/issueType";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AuroraText } from "../ui/aurora-text";
import { Link } from "react-router-dom";
import { TypingAnimation } from "../ui/MotionComponent";

const HomeCard = ({ issue }: { issue: Issue }) => {
  const images = issue.images || [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Link to={`/${issue._id}`}>
        <div className="relative w-full border h-120 rounded-xs overflow-hidden">
          {/* Image section (fixed height – no layout shift) */}
          <div className="relative w-full h-84 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current]?.url}
                alt="issue-image"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>

            {/* Date badge (image overlay – fixed) */}
            <p className="text-xs text-green-500 font-extrabold border px-2 py-1 rounded-md absolute top-2 right-3 bg-white/80">
              {issue.createdAt
                ? new Date(issue.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {/* Content section (never moves) */}
          <div className="px-2 py-2 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-md font-semibold">
                <AuroraText>{issue.title}</AuroraText>
              </p>
              <p className="text-sm text-gray-700 bg-amber-300 px-2 py-1 rounded-xl">
                {issue.category}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              <TypingAnimation>
                {issue.description && issue.description.length > 200
                  ? issue.description.substring(0, 100) + "..."
                  : issue.description}
              </TypingAnimation>
            </p>

            {/* Location – centered & stable */}
            <p className="text-sm text-gray-500 absolute bottom-0 left-[40%] border-l border-r px-2 bg-amber-50 text-center">
              {issue.location}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HomeCard;
