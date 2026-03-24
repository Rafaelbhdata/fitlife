"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  height_cm: number;
  target_weight_kg: number;
  daily_calorie_goal: number;
  daily_water_goal_ml: number;
  preferred_weight_unit: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const fetchUserAndProfile = useCallback(async () => {
    try {
      const supabase = createClient();

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setState({ user: null, profile: null, loading: false, error: null });
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }

      setState({
        user,
        profile: profile || null,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Auth error:", err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Error de autenticación",
      }));
    }
  }, []);

  useEffect(() => {
    fetchUserAndProfile();

    // Listen to auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setState({ user: null, profile: null, loading: false, error: null });
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          fetchUserAndProfile();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndProfile]);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }, [router]);

  const refreshProfile = useCallback(async () => {
    await fetchUserAndProfile();
  }, [fetchUserAndProfile]);

  // Get display name or email initials
  const getInitials = useCallback(() => {
    if (state.profile?.display_name) {
      return state.profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (state.user?.email) {
      return state.user.email.slice(0, 2).toUpperCase();
    }
    return "??";
  }, [state.profile, state.user]);

  const getDisplayName = useCallback(() => {
    return state.profile?.display_name || state.user?.email?.split("@")[0] || "Usuario";
  }, [state.profile, state.user]);

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    signOut,
    refreshProfile,
    getInitials,
    getDisplayName,
    isAuthenticated: !!state.user,
  };
}
