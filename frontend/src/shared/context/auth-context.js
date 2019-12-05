import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedInKey: false,
  login: () => {},
  logout: () => {}
});
