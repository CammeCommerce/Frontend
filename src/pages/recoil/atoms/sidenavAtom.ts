import { atom } from "recoil";

export const sidenavAtom = atom<null | SideNavMenu>({
  key: "sidenavAtom",
  default: null,
});
