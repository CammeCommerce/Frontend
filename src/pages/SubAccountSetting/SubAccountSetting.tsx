import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function SubAccountSetting() {
  useAuthCheck();

  return (
    <>
      <SideNav />
    </>
  );
}

export default SubAccountSetting;
