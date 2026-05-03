"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
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
  const router = useRouter();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "grid_view" },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Payments", href: "/payments", icon: "payments" },
    { name: "Clients", href: "/clients", icon: "group" },
    { name: "Invoices", href: "/invoices", icon: "description" },
    { name: "Templates", href: "/templates", icon: "layers" },
  ];

  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api.get("/api/v1/users/me")
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Failed to fetch user:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  }, [router]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
              {user ? getInitials(user.full_name) : "..."}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">{user ? user.full_name : "Loading..."}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Admin</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
            <div className="relative group hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-blue-600 transition-colors">search</span>
              <input 
                className="pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
                placeholder="Search invoices, clients..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all active:scale-90">
              <span className="material-symbols-outlined text-[22px]">dark_mode</span>
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all relative active:scale-90">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all active:scale-90">
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3 ml-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[11px] shadow-sm group-hover:ring-4 group-hover:ring-blue-50 transition-all">
                {user ? getInitials(user.full_name) : "..."}
              </div>
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
