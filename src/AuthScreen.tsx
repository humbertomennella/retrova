import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Gamepad2, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Mode = "login" | "signup" | "recovery";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const redirectUrl = () => `${window.location.origin}${import.meta.env.BASE_URL}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!isSupabaseConfigured || !supabase) {
      setMessage({ type: "error", text: "A autenticação da RETROVA ainda não foi conectada. O projeto Supabase próprio e as credenciais de publicação precisam ser configurados." });
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirectUrl() },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage({ type: "success", text: "Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar." });
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectUrl() });
        if (error) throw error;
        setMessage({ type: "success", text: "Se o endereço estiver cadastrado, você receberá um e-mail com as instruções para redefinir a senha." });
      }
    } catch (error) {
      const raw = error instanceof Error ? error.message : "Não foi possível concluir a operação.";
      const friendly = raw.includes("Invalid login credentials") ? "E-mail ou senha incorretos."
        : raw.includes("User already registered") ? "Este e-mail já possui uma conta. Entre ou recupere sua senha."
        : raw.includes("Password should be") ? "A senha precisa ter pelo menos 6 caracteres."
        : raw;
      setMessage({ type: "error", text: friendly });
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "login" ? "Continue de onde parou." : mode === "signup" ? "Sua coleção começa aqui." : "Recupere seu acesso.";
  const subtitle = mode === "login" ? "Entre na sua conta e volte à sua biblioteca." : mode === "signup" ? "Crie sua conta e mantenha seus jogos organizados em um só lugar." : "Vamos enviar um link para você criar uma nova senha.";

  return (
    <main className="auth-screen">
      <div className="auth-backdrop-grid" />
      <header className="auth-topbar">
        <a className="auth-brand" href={import.meta.env.BASE_URL} aria-label="RETROVA início"><span>RETRO</span><b>VA</b><i>✦</i></a>
        <span className="auth-top-note"><span /> SUA BIBLIOTECA. SUA HISTÓRIA.</span>
      </header>

      <div className="auth-layout">
        <section className="auth-story">
          <div className="auth-kicker"><Sparkles size={14} /> O PASSADO DOS GAMES, DO SEU JEITO</div>
          <h1>Seus clássicos.<br /><span>Seu lugar.</span></h1>
          <p className="auth-story-copy">Uma casa para organizar sua coleção de jogos, acompanhar sua jornada e manter viva a memória de cada partida.</p>
          <div className="auth-feature-list">
            <div><span className="auth-feature-icon"><Gamepad2 size={18} /></span><span><strong>Sua biblioteca pessoal</strong><small>Uma coleção organizada por você.</small></span></div>
            <div><span className="auth-feature-icon"><LockKeyhole size={18} /></span><span><strong>Privacidade desde o início</strong><small>Sua conta, seus dados, seu espaço.</small></span></div>
            <div><span className="auth-feature-icon"><ShieldCheck size={18} /></span><span><strong>Feita para durar</strong><small>Uma experiência simples, sem complicação.</small></span></div>
          </div>
          <div className="auth-console-art" aria-hidden="true"><div className="auth-art-glow" /><div className="auth-art-ring ring-one" /><div className="auth-art-ring ring-two" /><div className="auth-pixel">✦</div><div className="auth-art-caption">PRESS START <span>▸</span></div></div>
        </section>

        <section className="auth-card">
          <div className="auth-card-head"><span className="auth-card-mark"><Gamepad2 size={19} /></span><span className="auth-card-label">ÁREA DO JOGADOR</span><span className="auth-status"><i /> ACESSO SEGURO</span></div>
          <div className="auth-heading"><span className="eyebrow">{mode === "login" ? "BEM-VINDO DE VOLTA" : mode === "signup" ? "NOVO POR AQUI?" : "RECUPERAÇÃO DE CONTA"}</span><h2>{title}</h2><p>{subtitle}</p></div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="auth-email">E-mail</label>
            <div className="auth-input-wrap"><Mail size={17} /><input id="auth-email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            {mode !== "recovery" && <>
              <div className="auth-label-row"><label htmlFor="auth-password">Senha</label>{mode === "login" && <button type="button" className="auth-text-button" onClick={() => { setMode("recovery"); setMessage(null); }}>Esqueci minha senha</button>}</div>
              <div className="auth-input-wrap"><LockKeyhole size={17} /><input id="auth-password" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="Mínimo de 6 caracteres" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            </>}
            {message && <div className={`auth-message ${message.type}`} role="status">{message.text}</div>}
            {!isSupabaseConfigured && <div className="auth-config-note">Prévia da interface: o serviço de contas ainda não está conectado.</div>}
            <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar na RETROVA" : mode === "signup" ? "Criar minha conta" : "Enviar link de recuperação"} <ArrowRight size={17} /></button>
          </form>
          <div className="auth-switch">{mode === "login" ? <>Ainda não tem conta? <button onClick={() => { setMode("signup"); setMessage(null); }}>Criar conta</button></> : mode === "signup" ? <>Já possui uma conta? <button onClick={() => { setMode("login"); setMessage(null); }}>Fazer login</button></> : <><button onClick={() => { setMode("login"); setMessage(null); }}>Voltar para o login</button></>}</div>
          <div className="auth-card-foot"><LockKeyhole size={13} /> Suas credenciais são processadas pelo Supabase Auth.</div>
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 RETROVA</span><span>O passado dos games. Uma nova forma de jogar.</span><span>VERSÃO PREVIEW</span></footer>
    </main>
  );
}
