import SideNav from "../../components/sidenav/SideNav";
import useAuthCheck from "../../hooks/useAuthCheck/useAuthCheck";

function Main() {
  useAuthCheck();

  return (
    <>
      <SideNav />
    </>
  );
}

export default Main;
