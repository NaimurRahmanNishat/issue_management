// src/pages/road/Road.tsx

import CategoryIssuesPage from "@/pages/category/CategoryIssuesPage";
import { IssueCategory } from "@/constants/divisions";

const Road = () => {
  return (
    <CategoryIssuesPage
      category={IssueCategory.BROKEN_ROAD}
      title="Road Issues"
      description="Report and view broken road issues"
    />
  );
};

export default Road;