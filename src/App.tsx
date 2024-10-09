import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { useRecoilValue } from "recoil";
import { sidenavAtom, sidenavDetailAtom } from "./pages/recoil";
import CompanyManagement from "./pages/CompanyManagement";

function App() {
  const sidenavMenu = useRecoilValue<null | SideNavMenu>(sidenavAtom);
  const sidenavDetailMenu = useRecoilValue<null | SideNavDetailMenu>(
    sidenavDetailAtom,
  );

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      {sidenavMenu === "매체관리" && (
        <Route path="/company-management" element={<CompanyManagement />} />
      )}
    </Routes>
  );
}

export default App;
