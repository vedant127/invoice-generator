"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import api from "@/lib/api";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      if ((session as any).accessToken) {
        localStorage.setItem("token", (session as any).accessToken);
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  const handleSocialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/api/v1/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen font-sans text-[#191b23] antialiased selection:bg-[#2563eb] selection:text-white w-full">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .font-h1, .font-h2, .font-h3 { font-family: 'Sora', sans-serif; }
        .font-body, .font-label { font-family: 'Manrope', sans-serif; }
        .font-data { font-family: 'JetBrains Mono', monospace; }

        .mesh-bg {
            background-color: #F8F9FB;
            background-image: 
                radial-gradient(at 40% 20%, hsla(228,100%,74%,1) 0px, transparent 50%),
                radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
                radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
                radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
                radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
                radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
                radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%);
            opacity: 0.15;
            position: absolute;
            inset: 0;
            z-index: 0;
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <main className="flex min-h-screen w-full relative">
        {/* Left Side: Illustration Area (Hidden on Mobile) */}
        <div className="flex-1 hidden lg:flex relative overflow-hidden bg-[#F8F9FB] items-center justify-center p-10">
          <div className="mesh-bg"></div>
          <div className="relative z-10 w-full max-w-lg flex flex-col gap-6">
            {/* Invoice Mockup Card */}
            <div className="bg-white rounded-xl border border-[#e1e2ed] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.08)] transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-h3 text-xl font-bold text-[#191b23] mb-1">InvoiceFlow Inc.</div>
                  <div className="font-body text-sm text-[#434655]">123 Tech Boulevard<br/>San Francisco, CA 94105</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-h2 text-2xl font-bold text-[#2563eb] mb-1">INVOICE</div>
                  <div className="font-data text-sm text-[#434655]">#INV-2023-001</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-semibold">
                  <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Paid
                </span>
                <span className="font-body text-sm text-[#434655]">Due: Oct 24, 2023</span>
              </div>

              <div className="border-t border-b border-[#e1e2ed] py-2 mb-4">
                <div className="grid grid-cols-12 gap-2 text-[12px] font-bold text-[#434655] bg-[#f3f3fe] px-2 py-1 rounded">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                <div className="grid grid-cols-12 gap-2 text-sm text-[#191b23] px-2 py-2 border-b border-[#e1e2ed]">
                  <div className="col-span-6 font-body">Enterprise Software License</div>
                  <div className="col-span-2 text-right font-data">1</div>
                  <div className="col-span-2 text-right font-data">$4,500</div>
                  <div className="col-span-2 text-right font-data">$4,500</div>
                </div>
                <div className="grid grid-cols-12 gap-2 text-sm text-[#191b23] px-2 py-2">
                  <div className="col-span-6 font-body">Implementation Support (Hours)</div>
                  <div className="col-span-2 text-right font-data">12</div>
                  <div className="col-span-2 text-right font-data">$150</div>
                  <div className="col-span-2 text-right font-data">$1,800</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between text-sm text-[#434655] mb-1 font-body">
                    <span>Subtotal</span>
                    <span className="font-data">$6,300.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#434655] mb-2 font-body">
                    <span>Tax (8.5%)</span>
                    <span className="font-data">$535.50</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#191b23] border-t border-[#e1e2ed] pt-2 font-h3">
                    <span>Total</span>
                    <span className="font-data text-[#2563eb]">$6,835.50</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Login Form Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-white relative z-10 shadow-[-10px_0px_30px_rgba(0,0,0,0.05)] lg:max-w-xl xl:max-w-2xl w-full">
          {/* Mobile Logo */}
          <div className="absolute top-0 w-full flex items-center justify-start h-16 px-6 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2563eb] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <span className="text-xl font-bold tracking-tight text-[#191b23]">InvoiceFlow</span>
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-10">
            <div className="text-center lg:text-left">
              <div className="hidden lg:flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-[#2563eb] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                <span className="text-2xl font-bold tracking-tight text-[#191b23]">InvoiceFlow</span>
              </div>
              <h1 className="font-h1 text-3xl font-bold text-[#191b23] mb-2">Welcome back</h1>
              <p className="font-body text-md text-[#434655]">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-label text-[12px] font-bold text-[#191b23]" htmlFor="email">Email Address</label>
                <input 
                  className="h-10 px-3 rounded-lg border border-[#e1e2ed] bg-white font-body text-sm text-[#191b23] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#737686]" 
                  id="email" 
                  placeholder="you@example.com" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="font-label text-[12px] font-bold text-[#191b23]" htmlFor="password">Password</label>
                  <Link className="text-[12px] font-bold text-[#2563eb] hover:text-[#004ac6] transition-colors" href="#">Forgot Password?</Link>
                </div>
                <input 
                  className="h-10 px-3 rounded-lg border border-[#e1e2ed] bg-white font-body text-sm text-[#191b23] focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#737686]" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                className="h-10 w-full rounded-lg bg-[#2563eb] hover:bg-[#004ac6] text-white font-bold text-[12px] mt-2 transition-all shadow-sm active:scale-[0.98] duration-150 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#e1e2ed]"></div>
              <span className="font-label text-[12px] text-[#434655] px-1">Or continue with</span>
              <div className="flex-1 h-px bg-[#e1e2ed]"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border border-[#e1e2ed] bg-white hover:bg-[#f3f3fe] text-[#191b23] font-bold text-[12px] transition-colors shadow-sm" 
                type="button"
                onClick={() => handleSocialLogin("google")}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
              <button 
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border border-[#e1e2ed] bg-white hover:bg-[#f3f3fe] text-[#191b23] font-bold text-[12px] transition-colors shadow-sm" 
                type="button"
                onClick={() => handleSocialLogin("github")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"></path>
                </svg>
                GitHub
              </button>
            </div>

            <div className="text-center">
              <span className="font-body text-sm text-[#434655]">Don't have an account? </span>
              <Link className="font-bold text-[12px] text-[#2563eb] hover:text-[#004ac6] transition-colors" href="/register">Sign up for free</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
