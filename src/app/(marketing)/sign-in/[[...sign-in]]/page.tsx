import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const dynamic = "force-dynamic";

function normalizeRedirectParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim().length > 0) {
    return value[0];
  }

  return undefined;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const redirectUrl =
    normalizeRedirectParam(params.redirect_url) ??
    normalizeRedirectParam(params.redirectUrl);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn
        fallbackRedirectUrl={redirectUrl ?? "/dashboard"}
        forceRedirectUrl={redirectUrl}
        appearance={{ baseTheme: dark }}
      />
    </div>
  );
}
