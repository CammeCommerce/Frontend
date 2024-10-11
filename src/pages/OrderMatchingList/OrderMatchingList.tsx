import OrderMatchingListContent from "../../components/content/OrderMatchingListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function OrderMatchingList() {
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
