import { SignUp } from "@clerk/nextjs";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) => {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <div>
      <SignUp forceRedirectUrl={redirectUrl} />
    </div>
  );
};

export default page;
