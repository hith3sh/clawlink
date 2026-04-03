import { SignUp } from "@clerk/nextjs";

export const runtime = 'edge';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignUp />
    </div>
  );
}