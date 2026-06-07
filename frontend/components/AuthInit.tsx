"use client";

import { useEffect } from "react";
import useAuthStore from "@/lib/stores/authStore";

export default function AuthInit() {
  const { token, user, fetchMe } = useAuthStore();

  useEffect(() => {
    // Always refresh from server when token exists — keeps role/profile in sync
    if (token) fetchMe();
  }, []);

  return null;
}
