import ApprovedIssues from "@/components/pages/home/ApprovedIssues";
import DivisionIssues from "@/components/pages/home/DivisionIssues";
import HeroImageSlider from "@/components/pages/home/HeroImageSlider";
import InProcessIssues from "@/components/pages/home/InProcessIssues";
import PendingIssues from "@/components/pages/home/PendingIssues";
import RejectedIssues from "@/components/pages/home/RejectedIssues";
import SolvedIssues from "@/components/pages/home/SolvedIssues";
import Loading from "@/components/shared/Loading";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";


const Home = () => {

  // Separate queries for each status for better caching
  const { data: pendingData, isLoading: pendingLoading } = useGetAllIssuesQuery({
    limit: 3,
    sortOrder: 'desc',
    status: 'pending',
  });

  const { data: approvedData, isLoading: approvedLoading } = useGetAllIssuesQuery({
    limit: 3,
    sortOrder: 'desc',
    status: 'approved',
  });

  const { data: inProgressData, isLoading: inProgressLoading } = useGetAllIssuesQuery({
    limit: 3,
    sortOrder: 'desc',
    status: 'in-progress',
  });

  const { data: solvedData, isLoading: solvedLoading } = useGetAllIssuesQuery({
    limit: 3,
    sortOrder: 'desc',
    status: 'resolved',
  });

  const { data: rejectedData, isLoading: rejectedLoading } = useGetAllIssuesQuery({
    limit: 3,
    sortOrder: 'desc',
    status: 'rejected',
  });

  // Show loading if any query is loading
  if (pendingLoading || approvedLoading || inProgressLoading || solvedLoading || rejectedLoading) {
    return <Loading />;
  }

  // Extract issues from responses - backend returns data inside 'data' field
  const pendingIssues = pendingData?.data || [];
  const approvedIssues = approvedData?.data || [];
  const inProcessIssues = inProgressData?.data || [];
  const solvedIssues = solvedData?.data || [];
  const rejectedIssues = rejectedData?.data || [];

  return (
    <div className="min-h-screen">
      <HeroImageSlider />
      <div className="pt-140">
        <DivisionIssues />

        {/* 🔹 Pass issues as props */}
        <PendingIssues issues={pendingIssues} />
        <ApprovedIssues issues={approvedIssues} />
        <InProcessIssues issues={inProcessIssues} />
        <SolvedIssues issues={solvedIssues} />
        <RejectedIssues issues={rejectedIssues} />
      </div>
    </div>
  )
}

export default Home;
