"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  name: string;
  picture: string;
  credits: number;
  googleUserId: string;
  email: string;
  plan?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = "https://api.aiclotheschanger.me/prod-api";
const API_ORIGIN = "https://api.aiclotheschanger.me";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("loggedInUser");
      }
    }
    setIsLoading(false);
  }, []);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("auth_token");
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/g/getUser`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const freshUser = data?.data ?? data?.user;
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem("loggedInUser", JSON.stringify(freshUser));
        }
      }
    } catch {
      // silent fail
    }
  }, []);

  const login = useCallback(() => {
    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${API_BASE}/g/callback`)}&response_type=code&scope=openid%20email%20profile&prompt=select_account`,
      "google-login",
      "width=600,height=600"
    );

    function handleMessage(event: MessageEvent) {
      if (event.origin !== API_ORIGIN) return;

      const payload = parseLoginPayload(event.data);
      if (payload?.user && payload?.token) {
        setUser(payload.user);
        setToken(payload.token);
        localStorage.setItem("auth_token", payload.token);
        localStorage.setItem("loggedInUser", JSON.stringify(payload.user));
        window.removeEventListener("message", handleMessage);
        popup?.close();
      }
    }

    window.addEventListener("message", handleMessage);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("loggedInUser");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isLoginModalOpen, openLoginModal, closeLoginModal, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function parseLoginPayload(data: unknown): { user: User; token: string } | null {
  if (!data || typeof data !== "object") return null;
  const direct = data as { user?: User; token?: string };

  if (direct.user && typeof direct.token === "string") {
    return { user: direct.user, token: direct.token };
  }

  if ("token" in direct && typeof direct.token === "string") {
    try {
      const parsed = JSON.parse(direct.token) as { user?: User; token?: string };
      if (parsed.user && typeof parsed.token === "string") {
        return { user: parsed.user, token: parsed.token };
      }
    } catch {
      return null;
    }
  }

  return null;
}
