import WithdrawalMatchingListContent from "../../components/content/WithdrawalMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function WithdrawalMatchingList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <WithdrawalMatchingListContent />
      </div>
    </>
  );
}

export default WithdrawalMatchingList;
