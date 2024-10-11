import DepositListContent from "../../components/content/DepositListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function DepositList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <DepositListContent />
      </div>
    </>
  );
}

export default DepositList;
