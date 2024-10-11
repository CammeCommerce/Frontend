import WithdrawalListContent from "../../components/content/WithdrawalListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function WithdrawalList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <WithdrawalListContent />
      </div>
    </>
  );
}

export default WithdrawalList;
