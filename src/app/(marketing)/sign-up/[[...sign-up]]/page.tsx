import { SignUp } from "@clerk/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignUp />
    </div>
  );
}
