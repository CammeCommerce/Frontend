import OnlineListContent from "../../components/content/OnlineListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function OnlineList() {
  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col">
        <MainHeader />
        <OnlineListContent />
      </div>
    </>
  );
}

export default OnlineList;
