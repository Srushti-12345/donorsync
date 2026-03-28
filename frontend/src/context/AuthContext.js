import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("donorsync_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const nextAuth = {
          ...auth,
          user: data.user,
          donorProfile: data.donorProfile || null
        };
        setAuth(nextAuth);
        localStorage.setItem("donorsync_user", JSON.stringify(nextAuth));
      } catch {
        logout(false);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    const nextAuth = { token: data.token, user: data.user };
    setAuth(nextAuth);
    localStorage.setItem("donorsync_user", JSON.stringify(nextAuth));
    toast.success("Welcome back");
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    const nextAuth = { token: data.token, user: data.user };
    setAuth(nextAuth);
    localStorage.setItem("donorsync_user", JSON.stringify(nextAuth));
    toast.success("Account created successfully");
    return data.user;
  };

  const logout = (notify = true) => {
    setAuth(null);
    localStorage.removeItem("donorsync_user");
    if (notify) toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
