import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface AdminState {
    session: Session | null;
    isAuthenticated: boolean;
    loading: boolean;
    init: () => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export const useAdmin = create<AdminState>((set) => ({
    session: null,
    isAuthenticated: false,
    loading: true,

    init: () => {
        // Recupere la session existante (si l'utilisateur est deja connecte)
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, isAuthenticated: !!session, loading: false });
        });

        // Reagit aux changements de session (connexion, deconnexion, expiration)
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, isAuthenticated: !!session, loading: false });
        });
    },

    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: "Email ou mot de passe incorrect." };
        }

        set({ session: data.session, isAuthenticated: true, loading: false });
        return { success: true };
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ session: null, isAuthenticated: false });
    },
}));