"use client";

import { LoginModal } from "./LoginModel";
import { useAuth } from "@/context/AuthContext";

export function GlobalAuthModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return <LoginModal open={isLoginModalOpen} onClose={closeLoginModal} />;
}
