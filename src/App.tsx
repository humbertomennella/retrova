import { useRef, useState } from "react";
import {
  Activity, Archive, ArrowRight, Check, ChevronDown, ChevronRight,
  CircleHelp, CloudUpload, Compass, Cpu, Gamepad2, HardDrive,
  Home, Library, LockKeyhole, Menu, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Trophy, Users, UserRound, X, Zap
} from "lucide-react";

type Section = "inicio" | "biblioteca" | "consoles" | "conquistas" | "amigos" | "perfil";
type ConsoleItem = { name: string; short: string; note: string };

const consoles: ConsoleItem[] = [
  { name: "Nintendo 64", short: "N64", note: "Em avaliação" },
  { name: "Super Nintendo", short: "SNES", note: "Em avaliação" },
  { name: "Mega Drive", short: "MD", note: "Em avaliação" },
  { name: "PlayStation", short: "PS1", note: "Em avaliação" },
  { name: "Game Boy", short: "GB", note: "Em avaliação" },
  { name: "Game Boy Color", short: "GBC", note: "Em avaliação" },
];

const navItems: { id: Section; label: string; icon: typeof Home; status?: string }[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "biblioteca", label: "Biblioteca", icon: Library },
  { id: "consoles", label: "Sistemas", icon: Gamepad2 },
  { id: "conquistas", label: "Conquistas", icon: Trophy, status: "Em breve" },
  { id: "amigos", label: "Amigos", icon: Users, status: "Em breve" },
  { id: "perfil", label: "Perfil", icon: UserRound, status: "Em breve" },
];

function Brand() {
  return <div className="brand" aria-label="RETROVA"><span>RETRO</span><b>VA</b><i>✦</i></div>;
}

function EmptyLibrary({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="empty-library">
      <div className="empty-art" aria-hidden="true">
        <div className="art-sun" />
        <div className="art-grid" />
        <div className="art-mountain mountain-one" />
        <div className="art-mountain mountain-two" />
        <div className="art-water" />
        <div className="art-player"><span /></div>
      </div>
      <div className="empty-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> SUA JORNADA COMEÇA AQUI</div>
        <h1>Bem-vindo à <span>RETROVA</span></h1>
        <p className="hero-lead">Sua biblioteca de jogos clássicos, do seu jeito.</p>
        <p className="hero-description">Adicione os jogos que você já possui, organize sua coleção e redescubra os clássicos diretamente no navegador.</p>
        <button className="primary-button" onClick={onAdd}><Plus size={19} /> Adicionar meu primeiro jogo <ArrowRight size={17} /></button>
        <div className="privacy-note"><LockKeyhole size={14} /> Sua coleção será privada e vinculada à sua conta.</div>
      </div>
    </div>
  );
}

function AddGameModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [system, setSystem] = useState("");
  const [notice, setNotice] = useState("");
  const allowed = /\.(nes|unf|smc|sfc|md|gen|bin|cue|iso|chd|gb|gbc|gba|n64|z64|v64)$/i;

  function handleFile(next: File | undefined) {
    if (!next) return;
    if (!allowed.test(next.name)) {
      setFile(null);
      setNotice("Formato não reconhecido nesta etapa. Confira a extensão do arquivo.");
      return;
    }
    setFile(next);
    setNotice("");
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div><span className="eyebrow">SUA COLEÇÃO, SUAS REGRAS</span><h2 id="modal-title">Adicionar jogo</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>
        <p className="modal-intro">Selecione um arquivo de jogo que você possui. Nesta primeira versão, a seleção é local: o envio privado e a identificação automática ainda serão conectados.</p>
        <button className={`dropzone ${file ? "has-file" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}>
          {file ? <Check size={28} /> : <CloudUpload size={30} />}
          <strong>{file ? file.name : "Escolha um arquivo ou arraste até aqui"}</strong>
          <span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · arquivo selecionado` : "ROMs e imagens de disco em formatos compatíveis"}</span>
          <small>{file ? "Clique para trocar o arquivo" : "Não envie arquivos que você não tem direito de usar."}</small>
        </button>
        <input ref={inputRef} className="visually-hidden" type="file" onChange={(e) => handleFile(e.target.files?.[0])} />
        <label className="field-label" htmlFor="system-select">Sistema / console</label>
        <select id="system-select" className="select-field" value={system} onChange={(e) => setSystem(e.target.value)}>
          <option value="">Identificar depois</option>
          {consoles.map((item) => <option key={item.short} value={item.short}>{item.name}</option>)}
        </select>
        {notice && <p className="form-notice">{notice}</p>}
        <div className="modal-foot">
          <span><ShieldCheck size={15} /> Arquivo não é enviado nesta versão</span>
          <button className="primary-button compact" disabled={!file} onClick={() => setNotice("Arquivo selecionado. A integração de armazenamento privado será implementada na próxima etapa.")}>Continuar <ChevronRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}

function App({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [active, setActive] = useState<Section>("inicio");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");


  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand"><Brand /><button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Fechar menu"><X size={18} /></button></div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map(({ id, label, icon: Icon, status }) => (
            <button key={id} className={`nav-link ${active === id ? "active" : ""}`} onClick={() => { setActive(id); setMobileNav(false); }}>
              <Icon size={18} strokeWidth={2.1} /><span>{label}</span>{status && <small>{status}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-promo-icon"><Gamepad2 size={23} /></div>
          <strong>O próximo continue é seu.</strong>
          <p>Monte sua coleção com os jogos que fazem parte da sua história.</p>
          <button className="text-button" onClick={() => setModalOpen(true)}>Adicionar jogo <ArrowRight size={14} /></button>
        </div>
        <div className="sidebar-footer"><span>RETROVA <b>PREVIEW</b></span><span>v0.1.0</span></div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Fechar menu" />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Abrir menu"><Menu size={20} /></button>
          <div className="search-wrap"><Search size={17} /><input aria-label="Buscar" placeholder="Buscar na sua biblioteca..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Ajuda"><CircleHelp size={19} /></button><div className="top-divider" /><button className="account-button" onClick={onSignOut} title="Sair da conta"><span className="avatar"><UserRound size={18} /></span><span><b>{userEmail}</b><small>Sair da conta</small></span><ChevronDown size={15} /></button></div>
        </header>

        <div className="content-grid">
          <section className="primary-content">
            {active === "inicio" && <>
              <EmptyLibrary onAdd={() => setModalOpen(true)} />
              <section className="steps-section">
                <div className="section-heading"><div><span className="eyebrow">SIMPLES E DIRETO</span><h2>Como começar</h2></div><span className="section-count">04 ETAPAS</span></div>
                <div className="steps-grid">
                  <article className="step-card"><div className="step-icon violet"><CloudUpload size={21} /></div><span className="step-number">01</span><h3>Adicione seu jogo</h3><p>Selecione um arquivo de jogo que você possui.</p></article>
                  <article className="step-card"><div className="step-icon blue"><Cpu size={21} /></div><span className="step-number">02</span><h3>Identifique o sistema</h3><p>Informe o console ou deixe a identificação para uma etapa futura.</p></article>
                  <article className="step-card"><div className="step-icon violet"><Archive size={21} /></div><span className="step-number">03</span><h3>Organize a coleção</h3><p>Revise nome, capa e informações antes de salvar.</p></article>
                  <article className="step-card"><div className="step-icon blue"><Zap size={21} /></div><span className="step-number">04</span><h3>Prepare-se para jogar</h3><p>A execução no navegador virá após a integração do emulador.</p></article>
                </div>
              </section>
              <section className="systems-section">
                <div className="section-heading"><div><span className="eyebrow">PLANO DE COMPATIBILIDADE</span><h2>Sistemas em avaliação</h2></div><button className="subtle-link" onClick={() => setActive("consoles")}>Ver sistemas <ArrowRight size={14} /></button></div>
                <div className="systems-grid">{consoles.map((item, index) => <button className="system-card" key={item.short} onClick={() => setActive("consoles")}><span className={`system-mark mark-${index}`}>{item.short}</span><strong>{item.name}</strong><small>{item.note}</small></button>)}</div>
              </section>
            </>}
            {active === "biblioteca" && <section className="subpage"><span className="eyebrow">COLEÇÃO PESSOAL</span><h1>Minha biblioteca</h1><EmptyState icon={<Library size={25} />} title="Sua biblioteca ainda está vazia" description="Os jogos que você adicionar aparecerão aqui. Cada coleção será privada à respectiva conta." action="Adicionar primeiro jogo" onAction={() => setModalOpen(true)} /></section>}
            {active === "consoles" && <section className="subpage"><span className="eyebrow">COMPATIBILIDADE</span><h1>Sistemas</h1><p className="subpage-lead">Estes são os sistemas considerados para a plataforma. A compatibilidade real será confirmada individualmente, com testes de emulação, controles e salvamento.</p><div className="systems-grid expanded">{consoles.map((item, index) => <div className="system-card" key={item.short}><span className={`system-mark mark-${index}`}>{item.short}</span><strong>{item.name}</strong><small>{item.note}</small></div>)}</div></section>}
            {active === "conquistas" && <section className="subpage"><span className="eyebrow">PROGRESSO</span><h1>Conquistas</h1><EmptyState icon={<Trophy size={25} />} title="Conquistas ainda não estão disponíveis" description="Elas só serão exibidas quando houver integração capaz de registrar eventos reais dos jogos." /></section>}
            {active === "amigos" && <section className="subpage"><span className="eyebrow">SOCIAL</span><h1>Amigos</h1><EmptyState icon={<Users size={25} />} title="Área social em desenvolvimento" description="Não há amigos, presença online ou atividade fictícia nesta prévia." /></section>}
            {active === "perfil" && <section className="subpage"><span className="eyebrow">CONTA</span><h1>Meu perfil</h1><EmptyState icon={<UserRound size={25} />} title="Perfil ainda não conectado" description="Cadastro, autenticação e configurações de conta serão integrados em uma próxima fase." /></section>}
          </section>

          <aside className="right-rail">
            <section className="rail-card welcome-card"><div className="rail-card-heading"><span className="eyebrow">SEU ESPAÇO</span><span className="live-dot" /></div><div className="profile-row"><span className="profile-avatar"><UserRound size={24} /></span><div><strong>{userEmail}</strong><small>Jogador RETROVA</small></div></div><div className="rail-divider" /><p className="rail-copy">Uma biblioteca pessoal para os jogos clássicos que você já possui.</p></section>
            <section className="rail-card"><div className="rail-title"><HardDrive size={17} /><h3>Privacidade primeiro</h3></div><div className="privacy-visual"><div className="privacy-orbit"><LockKeyhole size={23} /></div><div><strong>Biblioteca pessoal</strong><small>Separada por conta de usuário</small></div></div><p className="rail-footnote">O armazenamento privado será configurado junto com a autenticação e o backend.</p></section>
            <section className="rail-card activity-card"><div className="rail-title"><Activity size={17} /><h3>Atividade</h3></div><div className="activity-empty"><div className="activity-icon"><Compass size={21} /></div><strong>Nenhuma atividade ainda</strong><p>Quando você começar sua coleção, suas atualizações aparecerão aqui.</p></div></section>
            <section className="rail-note"><Sparkles size={17} /><p><strong>Feita para sua coleção.</strong><br />Sem catálogo compartilhado de ROMs. Os jogos são adicionados pelo próprio usuário.</p></section>
          </aside>
        </div>

        <footer className="page-footer"><div className="footer-brand"><Brand /><span>O passado dos games. Uma nova forma de jogar.</span></div><div className="footer-links"><button>Ajuda</button><button>Privacidade</button><button aria-label="Configurações"><Settings2 size={16} /></button></div></footer>
      </main>
      {modalOpen && <AddGameModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function EmptyState({ icon, title, description, action, onAction }: { icon: React.ReactNode; title: string; description: string; action?: string; onAction?: () => void }) {
  return <div className="generic-empty"><div className="generic-empty-icon">{icon}</div><h2>{title}</h2><p>{description}</p>{action && onAction && <button className="primary-button compact" onClick={onAction}><Plus size={16} />{action}</button>}</div>;
}

export default App;
