"use client";
import { useState, useEffect } from "react";
import { 
  Bell, 
  Moon, 
  Shield, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Layout,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotif: true,
    paymentAlerts: true,
    invoiceReminders: false,
    darkMode: false,
    compactView: true,
    twoFactor: true,
    sessionTimeout: false
  });
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    } else {
      const isDark = document.documentElement.classList.contains('dark');
      setSettings(prev => ({ ...prev, darkMode: isDark }));
    }

    const syncTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setSettings(prev => ({ ...prev, darkMode: isDark }));
    };

    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    const newSettings = { ...settings, [key]: newValue };
    setSettings(newSettings);
    localStorage.setItem("user_settings", JSON.stringify(newSettings));

    if (key === 'darkMode') {
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem("theme", "light");
      }
      // Trigger a global event to notify layout
      window.dispatchEvent(new Event('storage'));
    }

    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col gap-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your application preferences and security.</p>
        </div>
      </div>

      {showSaved && (
        <div className="fixed top-24 right-8 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-black text-sm animate-in fade-in slide-in-from-right-8 duration-300">
          Preferences Saved!
        </div>
      )}

      {/* Notifications Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Notifications
        </h2>
        <div className="space-y-2">
          <SettingRow 
            label="Email Notifications" 
            sub="Receive updates via email" 
            isOn={settings.emailNotif} 
            onToggle={() => toggleSetting('emailNotif')}
            icon={<Mail className="w-4 h-4" />}
          />
          <SettingRow 
            label="Payment Alerts" 
            sub="Get notified on new payments" 
            isOn={settings.paymentAlerts} 
            onToggle={() => toggleSetting('paymentAlerts')}
            icon={<CheckCircle2 className="w-4 h-4" />}
          />
          <SettingRow 
            label="Invoice Reminders" 
            sub="Auto-reminders for pending invoices" 
            isOn={settings.invoiceReminders} 
            onToggle={() => toggleSetting('invoiceReminders')}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Appearance
        </h2>
        <div className="space-y-2">
          <SettingRow 
            label="Dark Mode" 
            sub="Switch to dark theme" 
            isOn={settings.darkMode} 
            onToggle={() => toggleSetting('darkMode')}
            icon={<Moon className="w-4 h-4" />}
          />
          <SettingRow 
            label="Compact View" 
            sub="Show more data in less space" 
            isOn={settings.compactView} 
            onToggle={() => toggleSetting('compactView')}
            icon={<Layout className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm transition-colors">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Security
        </h2>
        <div className="space-y-2">
          <SettingRow 
            label="Two-Factor Authentication" 
            sub="Extra layer of security" 
            isOn={settings.twoFactor} 
            onToggle={() => toggleSetting('twoFactor')}
            icon={<Smartphone className="w-4 h-4" />}
          />
          <SettingRow 
            label="Session Timeout" 
            sub="Auto logout after 30 mins" 
            isOn={settings.sessionTimeout} 
            onToggle={() => toggleSetting('sessionTimeout')}
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
      </section>
    </div>
  );
}

function SettingRow({ label, sub, isOn, onToggle, icon }: { label: string, sub: string, isOn: boolean, onToggle: () => void, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-800 last:border-0 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOn ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-white">{label}</div>
          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{sub}</div>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isOn ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-slate-200 dark:bg-slate-800'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${isOn ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
