import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import type { Session } from "@supabase/supabase-js";
import App from "./App";
import AuthScreen from "./AuthScreen";
import PasswordUpdateScreen from "./PasswordUpdateScreen";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import "./styles.css";

function Root() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [recoveringPassword, setRecoveringPassword] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setChecking(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setRecoveringPassword(event === "PASSWORD_RECOVERY");
      setSession(nextSession);
      setChecking(false);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return <div className="auth-loading"><span className="auth-loading-mark">R</span><span>Preparando sua coleção...</span></div>;
  }

  if (!isSupabaseConfigured || !session?.user) return <AuthScreen />;
  if (recoveringPassword) return <PasswordUpdateScreen />;

  return <App userEmail={session.user.email ?? "Jogador"} onSignOut={() => { void supabase?.auth.signOut(); }} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><Root /></React.StrictMode>,
);
