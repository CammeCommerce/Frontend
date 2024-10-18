import OrderMatchingListContent from "../../components/content/OrderMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function OrderMatchingList() {
  useAuthCheck();

  return (
    <>
      <SideNav />
      <div className="flex h-screen w-content flex-col overflow-y-auto">
        <MainHeader />
        <OrderMatchingListContent />
      </div>
    </>
  );
}

export default OrderMatchingList;
