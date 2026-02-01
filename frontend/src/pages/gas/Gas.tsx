// src/pages/gas/Gas.tsx

import CategoryIssuesPage from "@/pages/category/CategoryIssuesPage";
import { IssueCategory } from "@/constants/divisions";

const Gas = () => {
  return (
    <CategoryIssuesPage
      category={IssueCategory.GAS}
      title="Gas Issues"
      description="Track gas supply and related issues"
    />
  );
};

export default Gas;