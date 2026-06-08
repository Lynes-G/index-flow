import { SignIn } from "@clerk/nextjs";
import { authPageClerkAppearance } from "@/lib/frontend/auth/authClerkAppearance";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) => {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <div className="w-full">
      <SignIn
        forceRedirectUrl={redirectUrl}
        appearance={authPageClerkAppearance}
      />
    </div>
  );
};

export default page;
