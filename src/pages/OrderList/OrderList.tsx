import OrderListContent from "../../components/content/OrderListContent";
import MainHeader from "../../components/header/MainHeader";
import SideNav from "../../components/sidenav/SideNav";

function OrderList() {
  return (
    <>
      <SideNav />
      <div className="w-content flex h-screen flex-col">
        <MainHeader />
        <OrderListContent />
      </div>
    </>
  );
}

export default OrderList;
