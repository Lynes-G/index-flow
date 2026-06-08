const DashboardShellRouteGroupLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="mx-auto w-full max-w-[1760px]">{children}</div>;
};

export default DashboardShellRouteGroupLayout;
