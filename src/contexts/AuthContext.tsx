import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  streak: number;
  completedClasses: number;
  totalClasses: number;
  publishedTheses: number;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  session: null,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
  refreshProfile: async () => {},
  loading: true,
});

const buildProfile = (
  supabaseUser: SupabaseUser,
  profileData?: { display_name?: string | null; onboarding_completed?: boolean | null },
  stats?: { completedClasses: number; publishedTheses: number }
): UserProfile => ({
  id: supabaseUser.id,
  name: profileData?.display_name || supabaseUser.user_metadata?.display_name || supabaseUser.email?.split("@")[0] || "Usuario",
  email: supabaseUser.email || "",
  streak: 0,
  completedClasses: stats?.completedClasses ?? 0,
  totalClasses: 12,
  publishedTheses: stats?.publishedTheses ?? 0,
  onboardingCompleted: profileData?.onboarding_completed ?? false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    let completedClasses = 0;
    let publishedTheses = 0;

    try {
      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", supabaseUser.id)
        .not("completed_at", "is", null);
      completedClasses = count ?? 0;
    } catch {
      completedClasses = 0;
    }

    try {
      const { count } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", supabaseUser.id);
      publishedTheses = count ?? 0;
    } catch {
      publishedTheses = 0;
    }

    const { data } = await supabase
      .from("profiles")
      .select("display_name, onboarding_completed")
      .eq("user_id", supabaseUser.id)
      .single();
    setUser(buildProfile(supabaseUser, data, { completedClasses, publishedTheses }));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await fetchProfile(session.user);
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setTimeout(() => fetchProfile(newSession.user), 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchProfile(currentSession.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error?.message || null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!session, user, session, login, signup, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
