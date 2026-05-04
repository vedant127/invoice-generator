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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  // Dark mode effect
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-surface text-slate-900'}`}>
      {/* Sidebar Navigation - Hidden on Mobile */}
      <aside className={`w-64 border-r hidden lg:flex flex-col h-screen sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-symbols-outlined text-xl">layers</span>
          </div>
          <span className={`text-xl font-bold tracking-tighter ${isDarkMode ? 'text-white' : 'text-on-surface'}`}>Finnie</span>
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
                    : isDarkMode 
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-slate-800' : 'border-outline-variant'}`}>
          <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined">settings</span>
            <span className="font-bold text-sm">Settings</span>
          </Link>
          <div className={`flex items-center gap-3 px-2 py-2 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-surface-container-low border-outline-variant/50'}`}>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
              {user ? getInitials(user.full_name) : "..."}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-on-surface'}`}>{user ? user.full_name : "Loading..."}</p>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>Admin</p>
            </div>
            <button 
              onClick={handleLogout}
              className={`p-1.5 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-rose-400' : 'text-on-surface-variant hover:text-error'}`}
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <div className="flex items-center gap-6">
            <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {navItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
            <div className="relative group hidden md:block">
              <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${isDarkMode ? 'text-slate-600 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>search</span>
              <input 
                className={`pl-10 pr-4 py-1.5 rounded-xl text-sm w-64 outline-none transition-all font-medium ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20' : 'bg-slate-50 border border-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'}`} 
                placeholder="Search invoices, clients..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-[22px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-full transition-all relative active:scale-90 ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotificationsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[90]" 
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Notifications</h3>
                      <button className="text-[10px] uppercase font-black text-blue-500 hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className={`p-3 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                          <p className="text-sm font-bold">New invoice paid</p>
                          <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Invoice #INV-2024-00{i} was paid by client.</p>
                        </div>
                      ))}
                    </div>
                    <button className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>View all activity</button>
                  </div>
                </>
              )}
            </div>

            <button className={`p-2 rounded-full transition-all active:scale-90 ${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>

            <div className={`w-px h-6 mx-2 hidden sm:block ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

            <div className="relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 ml-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[11px] shadow-sm group-hover:ring-4 group-hover:ring-blue-50 transition-all">
                  {user ? getInitials(user.full_name) : "..."}
                </div>
              </button>

              {isProfileOpen && (
                <>
                  {/* Backdrop for closing dropdown */}
                  <div 
                    className="fixed inset-0 z-[90]" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[100] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
                    <div className="px-4 py-3 border-b mb-1 border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold truncate">{user?.full_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span> Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                    </Link>
                    <div className={`h-px my-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    <button 
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-rose-500 transition-colors ${isDarkMode ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md px-4 h-20 flex items-center justify-around transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]' : 'bg-white/90 border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'}`}>
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : isDarkMode 
                      ? "text-slate-500 hover:text-slate-300"
                      : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>{item.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              pathname === '/settings' 
                ? "text-blue-600 dark:text-blue-400" 
                : isDarkMode 
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <span className={`material-symbols-outlined text-[24px] ${pathname === '/settings' ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${pathname === '/settings' ? 1 : 0}` }}>settings</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
