import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true, // Enable debug logs in terminal
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET,
      // Standard checks for GitHub
      checks: ["state"],
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("--- AUTH DEBUG ---");
      console.log("GITHUB_CLIENT_ID in code:", process.env.GITHUB_CLIENT_ID);
      console.log("GITHUB_CLIENT_SECRET exists:", !!process.env.GITHUB_CLIENT_SECRET);
      
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
          console.log(`[AUTH] Syncing ${user.email} with backend: ${apiBaseUrl}`);

          const response = await fetch(`${apiBaseUrl}/api/v1/auth/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              full_name: user.name || user.email?.split("@")[0] || "User",
              provider: account.provider,
              provider_id: user.id || account.providerAccountId,
              image: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            (user as any).accessToken = data.access_token;
            return true;
          }
          console.error("[AUTH] Backend sync failed:", await response.text());
          return false;
        } catch (error) {
          console.error("[AUTH] Critical sync error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
