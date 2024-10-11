import ProfitLossStatementContent from "../../components/content/ProfitLossStatementContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function ProfitLossStatement() {
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
