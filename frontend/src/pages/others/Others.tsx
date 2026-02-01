// src/pages/others/Others.tsx

import CategoryIssuesPage from "@/pages/category/CategoryIssuesPage";
import { IssueCategory } from "@/constants/divisions";

const Others = () => {
  return (
    <CategoryIssuesPage
      category={IssueCategory.OTHER}
      title="Other Issues"
      description="Miscellaneous issues and reports"
    />
  );
};

export default Others;