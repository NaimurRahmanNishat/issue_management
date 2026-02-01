// src/pages/water/Water.tsx

import CategoryIssuesPage from "@/pages/category/CategoryIssuesPage";
import { IssueCategory } from "@/constants/divisions";

const Water = () => {
  return (
    <CategoryIssuesPage
      category={IssueCategory.WATER}
      title="Water Issues"
      description="Browse and track water-related issues in your area"
    />
  );
};

export default Water;