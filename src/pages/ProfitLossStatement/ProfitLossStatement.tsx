import ProfitLossStatementContent from "../../components/content/ProfitLossStatementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function ProfitLossStatement() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <ProfitLossStatementContent />
      </div>
    </>
  );
}

export default ProfitLossStatement;
