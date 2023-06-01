import { atom } from "recoil";

export const ATOM_USER_KEY = "ATOM_USER";

export const userState = atom({
  key: ATOM_USER_KEY,
  default: {
    name: "default",
  },
});
