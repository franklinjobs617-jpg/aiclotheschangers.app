"use client";

import { useState, useEffect } from "react";
import { LoginModel } from "./LoginModel";
import { useAuth } from "@/context/AuthContext";

let triggerAuthModal: (() => void) | null = null;

export function openAuthModal() {
  triggerAuthModal?.();
}

export function GlobalAuthModal() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    triggerAuthModal = () => {
      if (!user) setOpen(true);
    };
    return () => {
      triggerAuthModal = null;
    };
  }, [user]);

  return <LoginModel open={open} onClose={() => setOpen(false)} />;
}
