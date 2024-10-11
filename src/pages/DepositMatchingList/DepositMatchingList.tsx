import DepositMatchingListContent from "../../components/content/DepositMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function DepositMatchingList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <DepositMatchingListContent />
      </div>
    </>
  );
}

export default DepositMatchingList;
