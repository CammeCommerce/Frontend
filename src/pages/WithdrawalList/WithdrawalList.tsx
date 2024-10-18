import WithdrawalListContent from "../../components/content/WithdrawalListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function WithdrawalList() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <WithdrawalListContent />
      </div>
    </>
  );
}

export default WithdrawalList;
