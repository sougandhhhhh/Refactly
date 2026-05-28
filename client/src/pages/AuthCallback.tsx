import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { supabase } from "@/lib/supabase";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          email: session.user.email,
          image: session.user.user_metadata?.avatar_url,
        };
        localStorage.setItem("refactly.user", JSON.stringify(user));
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/signin", { replace: true });
      }
    }).catch(() => {
      navigate("/signin", { replace: true });
    });
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-page-texture px-6">
      <div className="text-center">
        <BrandLogo size="lg" className="justify-center" />
        <h1 className="mt-6 font-display text-5xl text-charcoal-dark">Completing sign in...</h1>
      </div>
    </main>
  );
}
