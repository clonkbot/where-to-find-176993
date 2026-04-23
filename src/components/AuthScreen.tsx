import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-[#8B9A7E]/20 rounded-full animate-pulse" />
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-[#8B9A7E]/10 rounded-full" />
      <div className="absolute top-1/4 right-1/4 w-1 h-20 bg-[#2C2C2C]/5" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Title Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-[#2C2C2C] rounded-full">
            <svg className="w-8 h-8 text-[#2C2C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2C2C2C] tracking-tight mb-3">
            where to find
          </h1>
          <p className="text-[#2C2C2C]/60 font-sans text-base md:text-lg max-w-xs mx-auto leading-relaxed">
            Instant recall of your physical items through a mirrored digital hierarchy
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-[#2C2C2C]/5 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="font-serif text-2xl text-[#2C2C2C] mb-8 text-center">
            {flow === "signIn" ? "Welcome back" : "Create your space"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2 tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-sans text-[#2C2C2C]/70 mb-2 tracking-wide">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                className="w-full px-4 py-3.5 bg-[#F5F0E8]/50 border border-[#2C2C2C]/10 rounded-xl text-[#2C2C2C] font-sans placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#8B9A7E] focus:ring-2 focus:ring-[#8B9A7E]/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <p className="text-red-600/80 text-sm font-sans text-center py-2 bg-red-50 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#2C2C2C] text-white font-sans text-base tracking-wide rounded-xl hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:ring-offset-2 focus:ring-offset-[#F5F0E8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {flow === "signIn" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                flow === "signIn" ? "Sign in" : "Create account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2C2C2C]/10">
            <p className="text-center text-sm text-[#2C2C2C]/60 font-sans">
              {flow === "signIn" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setFlow(flow === "signIn" ? "signUp" : "signIn");
                  setError(null);
                }}
                className="text-[#8B9A7E] hover:text-[#6d7a63] font-medium underline underline-offset-2 transition-colors"
              >
                {flow === "signIn" ? "Create an account" : "Sign in instead"}
              </button>
            </p>
          </div>
        </div>

        {/* Guest Access */}
        <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => signIn("anonymous")}
            className="inline-flex items-center gap-2 text-[#2C2C2C]/50 hover:text-[#2C2C2C]/80 font-sans text-sm transition-colors group"
          >
            <span className="w-8 h-px bg-[#2C2C2C]/20 group-hover:w-12 transition-all" />
            Continue as guest
            <span className="w-8 h-px bg-[#2C2C2C]/20 group-hover:w-12 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
