const DashboardShellRouteGroupLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 px-4 xl:px-6 2xl:px-8">
      {children}
    </div>
  );
};

export default DashboardShellRouteGroupLayout;
