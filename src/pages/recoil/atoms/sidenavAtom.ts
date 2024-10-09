import { atom } from "recoil";

export const sidenavAtom = atom<null | SideNavMenu>({
  key: "sidenavAtom",
  default: null,
});

export const sidenavDetailAtom = atom<null | SideNavDetailMenu>({
  key: "sidenavDetailAtom",
  default: null,
});
