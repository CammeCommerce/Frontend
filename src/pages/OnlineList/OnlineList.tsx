import OnlineListContent from "../../components/content/OnlineListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function OnlineList() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <OnlineListContent />
      </div>
    </>
  );
}

export default OnlineList;
