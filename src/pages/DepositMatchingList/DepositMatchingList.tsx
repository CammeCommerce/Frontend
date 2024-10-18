import DepositMatchingListContent from "../../components/content/DepositMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function DepositMatchingList() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <DepositMatchingListContent />
      </div>
    </>
  );
}

export default DepositMatchingList;
