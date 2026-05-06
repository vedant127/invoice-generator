"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/v1/auth/register", {
        email,
        password,
        full_name: name,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 w-full flex items-center justify-center p-4 md:p-8 lg:p-12">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;500;700&family=Sora:wght@400;600;700&display=swap');
        
        .font-display { font-family: "Sora", sans-serif; }
        .font-sans { font-family: "DM Sans", sans-serif; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row relative z-10">
        {/* Left Side: Decorative */}
        <section className="hidden lg:flex lg:w-5/12 bg-slate-100 relative overflow-hidden flex-col justify-between p-12">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <Link className="flex items-center gap-2 group" href="/">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg group-hover:scale-105 transition-transform">
                IV
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">InvoicePro</span>
            </Link>
          </div>

          <div className="relative z-10 mt-12 mb-8">
            <h2 className="font-display text-3xl font-bold leading-tight mb-4 text-slate-900">Streamline your billing <br/>process today.</h2>
            <p className="text-slate-600 mb-8 max-w-sm">Create professional invoices, track payments, and get paid faster with our intuitive platform.</p>
            
            <div className="glass-panel rounded-xl p-4 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Invoice #INV-2023-001</p>
                    <p className="text-xs text-slate-500">Sent to Acme Corp</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Paid</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Amount</p>
                  <p className="font-display font-bold text-xl">$4,250.00</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-200"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm font-medium text-slate-500">
            "The cleanest invoice tool we've used." — <span className="text-slate-800">Design Studio</span>
          </div>
        </section>

        {/* Right Side: Signup Form */}
        <section className="w-full lg:w-7/12 p-8 sm:p-12 xl:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            <div className="lg:hidden mb-8">
              <Link className="flex items-center gap-2" href="/">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg">
                  IV
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">InvoicePro</span>
              </Link>
            </div>

            <div className="mb-8 text-center sm:text-left">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Create an account</h1>
              <p className="text-slate-500">Join thousands of freelancers and businesses.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors" 
                type="button"
                onClick={() => handleSocialLogin("google")}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors" 
                type="button"
                onClick={() => handleSocialLogin("github")}
              >
                <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                GitHub
              </button>
            </div>

            <div className="relative flex items-center py-5 mb-6">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or sign up with email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">Full Name</label>
                <input 
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Jane Doe" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
                <input 
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 py-2.5 px-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" 
                  id="email" 
                  name="email" 
                  placeholder="jane@example.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                <div className="relative mt-1">
                  <input 
                    className="block w-full rounded-lg border-slate-300 bg-slate-50 py-2.5 pl-4 pr-10 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    aria-label="Toggle password visibility" 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start mt-4">
                <div className="flex h-6 items-center">
                  <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" id="terms" name="terms" required type="checkbox" />
                </div>
                <div className="ml-3 text-sm leading-6 text-slate-500">
                  I agree to the <Link className="font-medium text-blue-600 hover:underline underline-offset-2" href="#">Terms of Service</Link> and <Link className="font-medium text-blue-600 hover:underline underline-offset-2" href="#">Privacy Policy</Link>.
                </div>
              </div>

              <div className="pt-2">
                <button 
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-blue-500/20" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account? 
              <Link className="font-semibold text-blue-600 hover:text-blue-500 transition-colors" href="/login"> Sign in here</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
