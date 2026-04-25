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

interface ProfileSnapshot {
  display_name?: string | null;
  onboarding_completed?: boolean | null;
  streak: number;
  completedClasses: number;
  totalClasses: number;
  publishedTheses: number;
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
  profileData: ProfileSnapshot
): UserProfile => ({
  id: supabaseUser.id,
  name: profileData.display_name || supabaseUser.user_metadata?.display_name || supabaseUser.email?.split("@")[0] || "Usuario",
  email: supabaseUser.email || "",
  streak: profileData.streak,
  completedClasses: profileData.completedClasses,
  totalClasses: profileData.totalClasses,
  publishedTheses: profileData.publishedTheses,
  onboardingCompleted: profileData.onboarding_completed ?? false,
});

const toISODate = (value: Date) => value.toISOString().slice(0, 10);

const calculateCurrentStreak = (completedAtValues: Array<string | null>) => {
  const completedDays = new Set(
    completedAtValues
      .filter((value): value is string => Boolean(value))
      .map((value) => toISODate(new Date(value)))
  );

  if (completedDays.size === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cursor = new Date(today);
  if (!completedDays.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!completedDays.has(toISODate(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (completedDays.has(toISODate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    let displayName: string | null = null;
    let onboardingCompleted = false;
    let streak = 0;
    let completedClasses = 0;
    let totalClasses = 0;
    let publishedTheses = 0;

    try {
      const { data, count, error } = await supabase
        .from("lesson_progress")
        .select("completed_at", { count: "exact" })
        .eq("user_id", supabaseUser.id)
        .not("completed_at", "is", null);

      if (error) {
        throw error;
      }

      completedClasses = count ?? 0;
      streak = calculateCurrentStreak((data ?? []).map((row: { completed_at: string | null }) => row.completed_at));
    } catch {
      streak = 0;
      completedClasses = 0;
    }

    try {
      const { count, error } = await supabase
        .from("lessons")
        .select("id", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      totalClasses = count ?? 0;
    } catch {
      totalClasses = 0;
    }

    try {
      const { count, error } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", supabaseUser.id);

      if (error) {
        throw error;
      }

      publishedTheses = count ?? 0;
    } catch {
      publishedTheses = 0;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, onboarding_completed")
        .eq("user_id", supabaseUser.id)
        .single();

      if (error) {
        throw error;
      }

      displayName = data.display_name;
      onboardingCompleted = data.onboarding_completed ?? false;
    } catch {
      displayName = null;
      onboardingCompleted = false;
    }

    setUser(buildProfile(supabaseUser, {
      display_name: displayName,
      onboarding_completed: onboardingCompleted,
      streak,
      completedClasses,
      totalClasses,
      publishedTheses,
    }));
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
