import Authlayout from "@/components/layout/AuthLayout";
import { redirect } from "next/navigation";
import { GoogleCompleteSignup } from "./GoogleCompleteSignupPageClient";

export default async function CompleteSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ accountType?: string }>;
}) {
  const params = await searchParams;
  const accountType = params.accountType;
  // The accountType is set by the Google callback redirect
  // (?accountType=brand|creator). Validate server-side so a bad/missing value
  // can't render the form in a broken state.
  if (accountType !== "brand" && accountType !== "creator") {
    redirect("/account-type");
  }
  return (
    <Authlayout
      imageSide="left"
      title="Complete sign up"
      authImage="https://pazasocial.netlify.app/static/media/hero2.273b3d3ea29814271bd2.jpg"
    >
      <GoogleCompleteSignup accountType={accountType} />
    </Authlayout>
  );
}
