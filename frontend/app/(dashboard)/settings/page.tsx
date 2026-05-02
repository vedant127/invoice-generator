"use client";
import { useState } from "react";
import { Settings, User, Building, CreditCard, Bell, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabClasses = (tab: string) => 
    `w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
      activeTab === tab 
        ? "bg-[#d5e0f8] text-[#004ac6] shadow-sm" 
        : "text-[#434655] hover:bg-[#ededf9] hover:text-[#191b23]"
    }`;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-[#191b23] tracking-tight font-heading">Settings</h2>
        <p className="text-[#434655] font-medium">Manage your account and business preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-10">
        {/* Navigation Tabs */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <button onClick={() => setActiveTab("profile")} className={tabClasses("profile")}>
            <User className="w-5 h-5" /> Profile Details
          </button>
          <button onClick={() => setActiveTab("business")} className={tabClasses("business")}>
            <Building className="w-5 h-5" /> Business Info
          </button>
          <button onClick={() => setActiveTab("billing")} className={tabClasses("billing")}>
            <CreditCard className="w-5 h-5" /> Billing & Plans
          </button>
          <button onClick={() => setActiveTab("notifications")} className={tabClasses("notifications")}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#c3c6d7] p-8 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563eb]/5 rounded-full -mr-16 -mt-16"></div>
          
          {activeTab === "profile" && (
            <div className="space-y-8 relative z-10">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-xl font-bold text-[#191b23] mb-1 font-heading">Profile Details</h3>
                <p className="text-sm text-[#434655] font-medium">This information will be visible on your invoices.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#434655] uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Alex Rivers" 
                    className="w-full rounded-xl border border-[#c3c6d7] px-4 py-3 text-sm font-medium focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/10 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#434655] uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex@invoicepro.com" 
                    disabled 
                    className="w-full rounded-xl border border-gray-100 bg-[#faf8ff] text-gray-500 px-4 py-3 text-sm font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#434655] uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue="+1 (555) 000-0000" 
                    className="w-full rounded-xl border border-[#c3c6d7] px-4 py-3 text-sm font-medium focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/10 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#434655] uppercase tracking-widest">Preferred Language</label>
                  <select className="w-full rounded-xl border border-[#c3c6d7] px-4 py-3 text-sm font-medium focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/10 outline-none transition-all appearance-none bg-white">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button className="bg-[#004ac6] text-white px-8 py-3 rounded-xl shadow-lg text-sm font-bold hover:bg-[#003ea8] transition-all flex items-center gap-2 active:scale-95">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center py-24 text-center relative z-10">
              <div className="w-20 h-20 bg-[#faf8ff] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Settings className="w-10 h-10 text-gray-300 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-[#191b23] mb-2 font-heading">Section Under Development</h4>
              <p className="text-sm text-[#434655] max-w-xs font-medium">The {activeTab} management module will be available in the next release.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

