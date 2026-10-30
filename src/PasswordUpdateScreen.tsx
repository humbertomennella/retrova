import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { supabase } from "./lib/supabase";

export default function PasswordUpdateScreen() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!supabase) return;
    if (password.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await supabase.auth.signOut();
    window.location.assign(import.meta.env.BASE_URL);
  }

  return (
    <main className="auth-screen">
      <div className="auth-backdrop-grid" />
      <header className="auth-topbar"><a className="auth-brand" href={import.meta.env.BASE_URL}><span>RETRO</span><b>VA</b><i>✦</i></a><span className="auth-top-note">RECUPERAÇÃO DE ACESSO</span></header>
      <div className="auth-layout auth-layout-single">
        <section className="auth-card">
          <div className="auth-card-head"><span className="auth-card-mark"><LockKeyhole size={19} /></span><span className="auth-card-label">NOVA SENHA</span></div>
          <div className="auth-heading"><span className="eyebrow">QUASE LÁ</span><h2>Defina sua nova senha.</h2><p>Escolha uma senha nova para voltar à sua biblioteca.</p></div>
          <form className="auth-form" onSubmit={submit}>
            <label htmlFor="new-password">Nova senha</label>
            <div className="auth-input-wrap"><LockKeyhole size={17} /><input id="new-password" type={visible ? "text" : "password"} minLength={6} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required /><button className="auth-eye" type="button" onClick={() => setVisible(v => !v)} aria-label="Mostrar ou ocultar senha">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <label htmlFor="confirm-password">Confirme a nova senha</label>
            <div className="auth-input-wrap"><LockKeyhole size={17} /><input id="confirm-password" type={visible ? "text" : "password"} minLength={6} autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></div>
            {error && <div className="auth-message error">{error}</div>}
            <button className="auth-submit" disabled={busy} type="submit">{busy ? "Salvando..." : "Salvar nova senha"} <ArrowRight size={17} /></button>
          </form>
        </section>
      </div>
      <footer className="auth-footer"><span>© 2026 RETROVA</span><span>O passado dos games. Uma nova forma de jogar.</span><span>VERSÃO PREVIEW</span></footer>
    </main>
  );
}
