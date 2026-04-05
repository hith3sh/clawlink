import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn />
    </div>
  );
}
