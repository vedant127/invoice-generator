"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Search, MoreVertical, Mail, Building2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Client Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    industry: "General"
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = () => {
    setLoading(true);
    api.get("/api/v1/clients/").then(res => {
      setClients(res.data);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/clients/", formData);
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company_name: "",
        address: "",
        industry: "General"
      });
      fetchClients();
    } catch (err) {
      console.error("Failed to add client:", err);
      alert("Failed to add client. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company_name && client.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayClients = filteredClients;

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-[#2563eb]/10 text-[#004ac6]',
      'bg-[#bc4800]/10 text-[#bc4800]',
      'bg-[#ba1a1a]/10 text-[#ba1a1a]',
      'bg-indigo-100 text-indigo-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#191b23] tracking-tight font-heading">Clients</h2>
          <p className="text-[#434655] font-medium mt-1">Manage your customer relationships and billing profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 bg-[#004ac6] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#003ea8] transition-all shadow-[0_4px_14px_0_rgba(0,74,198,0.39)] active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Client
        </button>
      </div>

      <div className="relative max-w-xl shadow-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#434655] w-5 h-5" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-[#c3c6d7] text-[#191b23] focus:border-[#004ac6] focus:ring-4 focus:ring-[#004ac6]/5 outline-none transition-all font-medium text-base placeholder:text-[#737686]" 
          placeholder="Search by name, company, or email..." 
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 text-gray-400 font-medium">
          Loading client database...
        </div>
      ) : displayClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#c3c6d7] p-24 text-center shadow-sm">
          <div className="w-20 h-20 bg-[#faf8ff] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Users className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-[#191b23] mb-2 font-heading">No clients found</h3>
          <p className="text-[#434655] font-medium max-w-xs mx-auto mb-8">Add your first client to start creating professional invoices for them.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#004ac6] text-white rounded-xl font-bold hover:bg-[#003ea8] transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Your First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayClients.map((client, index) => (
            <article key={client.id} className="bg-white border border-[#c3c6d7] rounded-2xl p-6 shadow-sm hover:border-[#2563eb]/30 hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#2563eb]/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm ${getAvatarColor(index)}`}>
                    {(client.company_name || client.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="text-lg font-bold text-[#191b23] leading-tight mb-1 truncate">{client.company_name || client.name}</h2>
                    <p className="text-xs font-bold text-[#434655] uppercase tracking-wider">{client.company_name ? client.name : "Individual"}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#004ac6] transition-colors p-2 -mr-2 rounded-xl hover:bg-gray-50">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-8 flex-grow relative z-10">
                <div className="flex items-center gap-3 text-[#434655] group/link">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a className="text-sm font-medium hover:text-[#004ac6] transition-colors truncate" href={`mailto:${client.email}`}>{client.email}</a>
                </div>
                <div className="flex items-center gap-3 text-[#434655]">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{client.industry || "General Business"}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-end bg-[#faf8ff] -mx-6 -mb-6 p-6 rounded-b-2xl relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-1.5">Lifetime Value</span>
                  <span className="text-xl font-bold text-[#191b23] tracking-tighter">
                    ${(client.total_billed || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="bg-white text-[#004ac6] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#c3c6d7] shadow-sm">
                  {client.invoice_count || 0} Invoices
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#191b23]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-[#faf8ff]">
              <h2 className="text-2xl font-bold text-[#191b23] font-heading">New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X className="w-6 h-6 text-[#434655]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#434655] uppercase tracking-widest mb-2">Company Name</label>
                  <input 
                    type="text" required
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c3c6d7] focus:ring-4 focus:ring-[#004ac6]/5 focus:border-[#004ac6] outline-none transition-all font-medium"
                    placeholder="Acme Corporation"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#434655] uppercase tracking-widest mb-2">Contact Person</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c3c6d7] focus:ring-4 focus:ring-[#004ac6]/5 focus:border-[#004ac6] outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#434655] uppercase tracking-widest mb-2">Industry</label>
                  <input 
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c3c6d7] focus:ring-4 focus:ring-[#004ac6]/5 focus:border-[#004ac6] outline-none transition-all font-medium"
                    placeholder="Technology"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#434655] uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c3c6d7] focus:ring-4 focus:ring-[#004ac6]/5 focus:border-[#004ac6] outline-none transition-all font-medium"
                    placeholder="contact@acme.com"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#434655] uppercase tracking-widest mb-2">Business Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#c3c6d7] focus:ring-4 focus:ring-[#004ac6]/5 focus:border-[#004ac6] outline-none transition-all font-medium h-28 resize-none"
                    placeholder="Street, City, State, ZIP..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 border border-[#c3c6d7] text-[#434655] font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 bg-[#004ac6] text-white font-bold rounded-xl hover:bg-[#003ea8] transition-all shadow-lg disabled:opacity-50 active:scale-95"
                >
                  {submitting ? "Saving..." : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


