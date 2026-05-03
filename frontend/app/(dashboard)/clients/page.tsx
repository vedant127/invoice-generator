"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Search, MoreVertical, Mail, Building2, Users, X, Phone, MapPin, ChevronRight } from "lucide-react";
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

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-blue-500 text-white',
      'bg-purple-500 text-white',
      'bg-emerald-500 text-white',
      'bg-rose-500 text-white',
      'bg-amber-500 text-white',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 lg:px-12 xl:px-16 pb-24 bg-[#F8F9FB] font-sans animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clients</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your customer relationships and billing profiles.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 bg-blue-600 text-white rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-[0_10px_15px_-3px_rgba(37,99,235,0.3)] active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Client
          </button>
        </div>

        {/* Search & Stats Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-bold text-base placeholder:text-slate-400 shadow-sm" 
              placeholder="Search by name, company, or email..." 
            />
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex -space-x-2">
              {clients.slice(0, 3).map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${getAvatarColor(i)} flex items-center justify-center text-[10px] font-black`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {clients.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                  +{clients.length - 3}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Clients</p>
              <p className="text-sm font-black text-slate-900">{clients.length} Active</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-slate-400 font-bold animate-pulse">
            Loading client database...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-6">
              <Users className="w-12 h-12 text-blue-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No clients found</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">Add your first client to start creating professional invoices for them.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl active:scale-95"
            >
              <Plus className="w-5 h-5" /> Add Your First Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClients.map((client, index) => (
              <article key={client.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:border-blue-200 hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm ${getAvatarColor(index)} transform group-hover:rotate-6 transition-transform`}>
                      {(client.company_name || client.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h2 className="text-xl font-black text-slate-900 leading-tight mb-1 truncate">{client.company_name || client.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.industry || "General"}</p>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-blue-600 transition-colors p-2 -mr-2 rounded-xl hover:bg-slate-50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-10 flex-grow relative z-10">
                  <div className="flex items-center gap-3 text-slate-500 group/link">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors truncate" href={`mailto:${client.email}`}>{client.email}</a>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 truncate">{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-8 -mb-8 px-8 py-6 rounded-b-[2rem] relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                      ${(client.total_billed || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black border border-slate-200 shadow-sm flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {client.invoice_count || 0} Invoices
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Add Client Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-500">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Client</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Create a new profile for your customer.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Company Name / Legal Entity</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="text" required
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                        placeholder="e.g. Acme Corp Inc."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Primary Contact Name</label>
                    <div className="relative group">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Industry</label>
                    <input 
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                      placeholder="e.g. SaaS, Design"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Email for Invoicing</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                        placeholder="billing@acme.com"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Business Address (for Invoice Header)</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                      <textarea 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 h-28 resize-none bg-slate-50/50 focus:bg-white"
                        placeholder="Street address, Suite, City, State..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-14 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-14 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                  >
                    {submitting ? "Processing..." : "Create Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
