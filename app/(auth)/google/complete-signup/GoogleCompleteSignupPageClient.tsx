"use client";

import { GoogleCompleteSignupForm } from "@/components/Auth/signup/GoogleCompleteSignupForm";
import { useAuthStore } from "@/hooks/store/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Client wrapper for the Google complete-signup page.
 *
 * Pulls the email/first/last name that the Google callback already stored in
 * the auth store (and localStorage token) to prefill the basic-details form.
 * If there's no authenticated user here, the callback flow didn't land a token
 * — bounce to login rather than render a broken form.
 */
export function GoogleCompleteSignup({
  accountType,
}: {
  accountType: "brand" | "creator";
}) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    // The Google callback wrote the token to localStorage before redirecting
    // here. If it's missing (e.g. user navigated directly), there's nothing
    // to complete — send them back to the start of the flow.
    const lsToken =
      token ?? (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!lsToken) {
      router.replace("/account-type");
    }
  }, [token, router]);

  return (
    <GoogleCompleteSignupForm
      accountType={accountType}
      className="max-w-2xl mx-auto min-h-screen py-12"
      defaults={{
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
      }}
    />
  );
}
