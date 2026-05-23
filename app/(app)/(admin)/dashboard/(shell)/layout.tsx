const DashboardShellRouteGroupLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="mx-[calc(50%-50dvw)] max-w-none px-4 xl:px-6 2xl:px-8">
      {children}
    </div>
  );
};

export default DashboardShellRouteGroupLayout;
