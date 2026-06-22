"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/providers/auth-provider";
import type { AuthState } from "@/types/auth";

/**
 * Hook to access auth state from AuthProvider.
 * Must be used within a component wrapped by <AuthProvider>.
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
