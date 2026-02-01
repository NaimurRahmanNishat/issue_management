// src/components/shared/IssueCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Issue } from "@/types/issueType";
import { TypingAnimation } from "../ui/MotionComponent";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const images = issue.images || [];
  const imageCount = images.length;

  // Description trim logic
  const maxLength = 160;
  const shortDescription =
    issue.description && issue.description.length > maxLength
      ? issue.description.substring(0, maxLength) + "..."
      : issue.description;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
      <Link to={`/${issue._id}`}>
        <div className="bg-white shadow-md rounded-sm border hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col">
          {/* Header: Date, Division, Status */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <p className="text-xs text-gray-500">
              {issue.createdAt
                ? new Date(issue.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-xs text-gray-700 font-medium">
              <span className="font-bold">Division:</span> {issue.division}
            </p>
            {issue.status === "pending" && (
              <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                {issue.status}
              </span>
            )}
            {issue.status === "approved" && (
              <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                {issue.status}
              </span>
            )}
            {issue.status === "in-progress" && (
              <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                {issue.status}
              </span>
            )}
            {issue.status === "resolved" && (
              <span className="px-2 py-1 text-xs font-semibold text-pink-800 bg-orange-200 rounded-full">
                {issue.status}
              </span>
            )}
            {issue.status === "rejected" && (
              <span className="px-2 py-1 text-xs font-semibold text-slate-800 bg-green-200 rounded-full">
                {issue.status}
              </span>
            )}
          </div>

          {/* Images Section */}
          {imageCount > 0 ? (
            <div className="relative">
              <div className="flex">
                {/* Left side - Main Image */}
                <div className="flex-2 flex flex-col">
                  <img
                    src={images[0].url}
                    alt={`${issue.title} - Image 1`}
                    className="w-full h-50 object-cover aspect-4/3"
                  />

                  {/* Content Section - directly under big image */}
                  <div className="p-4 mt-auto">
                    <h2 className="text-base font-bold bg-linear-to-r from-orange-500 to-pink-500 via-blue-500 bg-clip-text text-transparent mb-1.5 line-clamp-2">
                      {issue.title}
                    </h2>

                    <p className="text-gray-600 h-full lg:h-10 text-sm mb-3">
                      <TypingAnimation>{shortDescription}</TypingAnimation>
                    </p>
                  </div>
                </div>

                {/* Right side - Two small images */}
                {imageCount >= 2 && (
                  <div className="hidden md:flex flex-1">
                    {imageCount >= 3 ? (
                      <div className="flex flex-col h-75">
                        <div className="flex-1 h-50">
                          <img
                            src={images[1].url}
                            alt={`${issue.title} - Image 2`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <img
                            src={images[2].url}
                            alt={`${issue.title} - Image 3`}
                            className="w-full h-full object-cover"
                          />
                          {imageCount > 3 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-bold text-2xl">
                                +{imageCount - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <img
                        src={images[1].url}
                        alt={`${issue.title} - Image 2`}
                        className="w-full h-full object-cover aspect-4/3"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-60 bg-gray-200 flex items-center justify-center text-gray-500">
              No image available
            </div>
          )}
          <div className="text-center pt-4 pb-2 w-full">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Location:</span> {issue.location}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default IssueCard;