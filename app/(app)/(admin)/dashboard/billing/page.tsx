import { PricingTable } from "@clerk/nextjs";

const BillingPage = () => {
  return (
    <div>
      <h1 className="mb-10 text-center text-3xl font-bold md:text-left">
        Manage your billing
      </h1>
      <PricingTable />
    </div>
  );
};

export default BillingPage;
