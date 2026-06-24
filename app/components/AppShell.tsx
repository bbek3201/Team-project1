import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export function AppShell({
  children,
  mainClassName,
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="mx-auto flex max-w-6xl gap-10 px-8 py-8">
        <Sidebar />
        <main className={mainClassName}>{children}</main>
      </div>
    </div>
  );
}
