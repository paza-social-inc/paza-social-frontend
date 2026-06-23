"use client";

import { setAuthToken } from "@/app/actions/auth";
import { useAuthStore } from "@/hooks/store/auth/useAuth";
import { pazaApi } from "@/lib/axiosClients";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type GoogleCallbackPayload = {
  code: string;
  accountType: "Creator" | "Business" | "None";
};

export default function GoogleCallbackPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSubmittedRef = useRef(false);
  // Captures the OAuth `state` ("brand" | "creator" | null/"login") so the
  // mutation's onSuccess can tell whether this Google auth originated from the
  // signup flow (and therefore needs basic-details + onboarding) vs. the login
  // flow (skip straight through).
  const signupStateRef = useRef<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);

  const googleAuthMutation = useMutation({
    mutationFn: ({ code, accountType }: GoogleCallbackPayload) =>
      pazaApi.post("/api/auth/google/callback", { code, accountType }),

    onSuccess: async (res) => {
      const token = res.data?.token;
      const user = res.data?.user;
      const isNewUser = Boolean(res.data?.isNewUser);

      if (!token || !user) {
        toast.error("Google login succeeded but auth data was missing.");
        router.push("/login");
        return;
      }

      await setAuthToken(token);

      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.setItem("token", token);
        // setAuthToken (server action) owns the httpOnly `token` cookie that
        // middleware reads. Don't write a JS duplicate of the same name (it
        // can't override the httpOnly one and the `secure` flag is dropped on
        // localhost http anyway). localStorage feeds the axios Bearer header.
      }

      setAuth(token, {
        id: user.id != null ? String(user.id) : undefined,
        email: user.email ?? "",
        firstname: user.firstName,
        lastname: user.lastName,
        accountType: user.accountType,
      });

      // state = "brand" | "creator" came from the signup flow (the Google
      // button on the register page). A brand-new Google signup must collect
      // the same basic details the form collects (birthday for creators,
      // gender/phone/city, Terms) before onboarding — otherwise metadata is
      // never picked up. Only a returning Google login skips straight through.
      const state = signupStateRef.current;
      const cameFromSignup = state === "brand" || state === "creator";
      if (isNewUser && cameFromSignup) {
        const accountTypeParam = state === "brand" ? "brand" : "creator";
        window.location.href = `/google/complete-signup?accountType=${accountTypeParam}`;
        return;
      }

      toast.success("Successfully logged in with Google!");

      // If no account type set, send to setup page before overview
      if (!user.accountType || user.accountType === "None") {
        window.location.href = "/account-type-setup";
        return;
      }

      window.location.href = "/overview";
    },

    onError: (error: unknown) => {
      console.error("Google callback error:", error);
      const msg = axios.isAxiosError(error)
        ? String(error.response?.data?.message || error.response?.data?.error || "")
        : "";
      toast.error(msg || "Google authentication failed.");
      router.push("/login");
    },
  });

  useEffect(() => {
    if (hasSubmittedRef.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      toast.error("Authorization code not found.");
      router.push("/login");
      return;
    }

    // state = "brand" | "creator" from signup flow
    // state = "login" | null from login page — don't force an accountType
    const accountType: "Creator" | "Business" | "None" =
      state === "brand" ? "Business" :
      state === "creator" ? "Creator" :
      "None";

    hasSubmittedRef.current = true;
    signupStateRef.current = state;

    console.log("GOOGLE CODE:", code);
    console.log("GOOGLE STATE:", state);
    console.log("ACCOUNT TYPE RESOLVED:", accountType);

    googleAuthMutation.mutate({ code, accountType });
  }, [searchParams, router, googleAuthMutation]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="mt-2">Authenticating with Google...</p>
      </div>
    </div>
  );
}
