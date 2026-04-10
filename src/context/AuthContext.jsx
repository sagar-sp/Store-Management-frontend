import { createContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      api
        .get("/users/me")
        .then((response) => setUser(response.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = (payload) => {
    localStorage.setItem("token", payload.token);
    setToken(payload.token);
    setUser(payload.user);
    setAuthToken(payload.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
