// src/components/pages/home/RejectedIssues.tsx

import HomeCard from "@/components/shared/HomeCard";
import { AuroraText } from "@/components/ui/aurora-text";
import type { Issue } from "@/types/issueType";

interface Props {
  issues: Issue[];
}

const RejectedIssues = ({ issues }: Props) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
      <h2 className="flex items-center justify-center">
        <AuroraText className="text-3xl font-bold text-center mb-8">
          Rejected Issues
        </AuroraText>
      </h2>
        <p className="text-center text-gray-500">No rejected issues found</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <h2 className="flex items-center justify-center">
        <AuroraText className="text-3xl font-bold text-center mb-8">
          Rejected Issues
        </AuroraText>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {issues.slice(0, 3).map((issue: Issue) => (
          <div key={issue._id}>
            <HomeCard issue={issue} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RejectedIssues;
