import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function OtherSetting() {
  useAuthCheck();

  return (
    <>
      <SideNav />
    </>
  );
}

export default OtherSetting;
