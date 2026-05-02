"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Moon,
  Download,
  Layers,
  CreditCard,
  LogOut
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "grid_view" },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Payments", href: "/payments", icon: "payments" },
    { name: "Clients", href: "/clients", icon: "group" },
    { name: "Invoices", href: "/invoices", icon: "description" },
    { name: "Templates", href: "/templates", icon: "layers" },
  ];

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-outline-variant bg-white flex flex-col h-screen sticky top-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-symbols-outlined text-xl">layers</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-on-surface">Finnie</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-blue-100" 
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-outline-variant">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container mb-4 transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-bold text-sm">Settings</span>
          </Link>
          <div className="flex items-center gap-3 px-2 py-2 bg-surface-container-low rounded-2xl border border-outline-variant/50">
            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold shadow-sm">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">John Doe</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Admin</p>
            </div>
            <button className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-on-surface tracking-tight">
              {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black text-secondary border border-outline-variant rounded-xl hover:bg-surface-container transition-all active:scale-95 ml-4 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Report
            </button>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-surface-container rounded-xl border-none text-sm w-48 md:w-64 focus:ring-2 focus:ring-primary transition-all placeholder:text-outline font-medium" 
                placeholder="Quick search..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-1 border-l border-outline-variant pl-5">
              <button className="p-2.5 text-on-surface-variant hover:bg-surface-container rounded-xl transition-all active:scale-90">
                <span className="material-symbols-outlined">dark_mode</span>
              </button>
              <button className="p-2.5 text-on-surface-variant hover:bg-surface-container rounded-xl transition-all relative active:scale-90">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
