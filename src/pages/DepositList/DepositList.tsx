import DepositListContent from "../../components/content/DepositListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function DepositList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <DepositListContent />
      </div>
    </>
  );
}

export default DepositList;
