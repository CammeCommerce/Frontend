import { atom } from "recoil";

export const sidenavDetailAtom = atom<null | SideNavDetailMenu>({
  key: "sidenavDetailAtom",
  default: null,
});
