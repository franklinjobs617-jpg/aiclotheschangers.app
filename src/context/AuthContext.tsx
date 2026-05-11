"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export interface User {
  name: string;
  picture: string;
  credits: number;
  googleUserId: string;
  email: string;
  type?: string | number | null;
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

const API_ORIGIN = process.env.NEXT_PUBLIC_AUTH_API_ORIGIN ?? "https://api.aiclotheschangers.app";
const API_BASE = `${API_ORIGIN}/prod-api`;
const BACKEND_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? `${API_BASE}/g/callback`;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APP_TYPE = "close";
const APP_USER_TYPE = "9";
const AUTH_TOKEN_KEY = `${APP_TYPE}_auth_token`;
const AUTH_USER_KEY = `${APP_TYPE}_loggedInUser`;
const LEGACY_AUTH_TOKEN_KEY = "auth_token";
const LEGACY_AUTH_USER_KEY = "loggedInUser";
const MIN_REFRESH_INTERVAL = 2000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isRefreshingRef = useRef(false);
  const lastRefreshTimeRef = useRef(0);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    clearLegacyStoredAuth();

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        if (isCurrentAppUser(parsedUser)) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          clearStoredAuth();
        }
      } catch {
        clearStoredAuth();
      }
    } else if (!storedToken && storedUser) {
      localStorage.removeItem(AUTH_USER_KEY);
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
    const currentToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!currentToken) return;

    const now = Date.now();
    if (isRefreshingRef.current || now - lastRefreshTimeRef.current < MIN_REFRESH_INTERVAL) return;

    isRefreshingRef.current = true;
    lastRefreshTimeRef.current = now;

    try {
      const freshUser = await fetchAuthenticatedUser(currentToken);
      if (freshUser && isCurrentAppUser(freshUser)) {
        setUser(freshUser);
        setToken(currentToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshUser));
      } else {
        setUser(null);
        setToken(null);
        clearStoredAuth();
      }
    } catch {
      // Keep the cached user if the refresh endpoint is temporarily unavailable.
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  const login = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      return;
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: BACKEND_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
      state: `${crypto.randomUUID()}_${APP_TYPE}`
    });

    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      "GoogleLogin",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) return;
    const loginPopup = popup;

    async function handleMessage(event: MessageEvent) {
      if (event.origin !== API_ORIGIN) return;

      const payload = parseLoginPayload(event.data);
      if (!payload) return;

      const freshUser = await fetchAuthenticatedUser(payload.token).catch(() => null);
      const authenticatedUser = freshUser ?? payload.user;
      if (!isCurrentAppUser(authenticatedUser)) {
        clearStoredAuth();
        return;
      }

      setUser(authenticatedUser);
      setToken(payload.token);
      localStorage.setItem(AUTH_TOKEN_KEY, payload.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authenticatedUser));
      setIsLoginModalOpen(false);
      window.removeEventListener("message", handleMessage);
      loginPopup.close();
    }

    window.addEventListener("message", handleMessage);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
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

  if (typeof direct.token === "string") {
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

async function fetchAuthenticatedUser(authToken: string): Promise<User | null> {
  const res = await fetch(`${API_BASE}/g/getUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-App-Type": APP_TYPE,
      Authorization: `Bearer ${authToken}`
    },
    cache: "no-store"
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.data ?? data?.user ?? null;
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  clearLegacyStoredAuth();
}

function clearLegacyStoredAuth() {
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_USER_KEY);
}

function isCurrentAppUser(user: User | null | undefined) {
  return String(user?.type ?? "") === APP_USER_TYPE;
}
