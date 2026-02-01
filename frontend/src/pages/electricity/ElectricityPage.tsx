// src/pages/electricity/ElectricityPage.tsx

import CategoryIssuesPage from "@/pages/category/CategoryIssuesPage";
import { IssueCategory } from "@/constants/divisions";

const ElectricityPage = () => {
  return (
    <CategoryIssuesPage
      category={IssueCategory.ELECTRICITY}
      title="Electricity Issues"
      description="Report power outages and electrical problems"
    />
  );
};

export default ElectricityPage;