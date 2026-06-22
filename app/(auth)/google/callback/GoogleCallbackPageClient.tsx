// "use client";

// import { setAuthToken } from "@/app/actions/auth";
// import { useAuthStore } from "@/hooks/store/auth/useAuth";
// import { pazaApi } from "@/lib/axiosClients";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// type GoogleCallbackPayload = {
//   code: string;
//   accountType: "Creator" | "Business";
// };

// export default function GoogleCallbackPageClient() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const hasSubmittedRef = useRef(false);

//   const setAuth = useAuthStore((s) => s.setAuth);

//   const googleAuthMutation = useMutation({
//     mutationFn: ({ code, accountType }: GoogleCallbackPayload) =>
//       pazaApi.post("/api/auth/google/callback", {
//         code,
//         accountType,
//       }),

//     onSuccess: async (res) => {
//       const token = res.data?.token;
//       const user = res.data?.user;

//       if (!token || !user) {
//         toast.error("Google login succeeded but auth data was missing.");
//         router.push("/login");
//         return;
//       }

//       await setAuthToken(token);

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("admin_token");
//         localStorage.setItem("token", token);
//         document.cookie = `token=${token}; path=/; secure; samesite=lax`;
//       }

//       setAuth(token, {
//         id: user.id != null ? String(user.id) : undefined,
//         email: user.email ?? "",
//         firstname: user.firstName,
//         lastname: user.lastName,
//         accountType: user.accountType,
//       });

//       toast.success("Successfully logged in with Google!");
//       window.location.href = "/overview";
//     },

//     onError: (error: unknown) => {
//       console.error("Google callback error:", error);

//       const msg = axios.isAxiosError(error)
//         ? String(
//             error.response?.data?.message ||
//               error.response?.data?.error ||
//               ""
//           )
//         : "";

//       toast.error(msg || "Google authentication failed.");
//       router.push("/login");
//     },
//   });

//   useEffect(() => {
//     if (hasSubmittedRef.current) return;

//     const code = searchParams.get("code");
//     const state = searchParams.get("state");

//     if (!code) {
//       toast.error("Authorization code not found.");
//       router.push("/login");
//       return;
//     }

//     const accountType: "Creator" | "Business" =
//       state === "brand" ? "Business" : "Creator";

//     hasSubmittedRef.current = true;

//     console.log("GOOGLE CODE:", code);
//     console.log("GOOGLE STATE:", state);
//     console.log("ACCOUNT TYPE:", accountType);

//     googleAuthMutation.mutate({
//       code,
//       accountType,
//     });
//   }, [searchParams, router, googleAuthMutation]);

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <div className="text-center">
//         <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
//         <p className="mt-2">Authenticating with Google...</p>
//       </div>
//     </div>
//   );
// }

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
  const setAuth = useAuthStore((s) => s.setAuth);

  const googleAuthMutation = useMutation({
    mutationFn: ({ code, accountType }: GoogleCallbackPayload) =>
      pazaApi.post("/api/auth/google/callback", { code, accountType }),

    onSuccess: async (res) => {
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        toast.error("Google login succeeded but auth data was missing.");
        router.push("/login");
        return;
      }

      await setAuthToken(token);

      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; secure; samesite=lax`;
      }

      setAuth(token, {
        id: user.id != null ? String(user.id) : undefined,
        email: user.email ?? "",
        firstname: user.firstName,
        lastname: user.lastName,
        accountType: user.accountType,
      });

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