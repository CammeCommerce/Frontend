import WithdrawalMatchingListContent from "../../components/content/WithdrawalMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function WithdrawalMatchingList() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <WithdrawalMatchingListContent />
      </div>
    </>
  );
}

export default WithdrawalMatchingList;
