import { useMemo, useRef, useState } from 'react'
import {
  Home, LibraryBig, Trophy, Users, UserRound, Gamepad2, MessageSquare,
  Bell, Search, Plus, UploadCloud, FileUp, Tag, Play, ChevronDown,
  ChevronRight, HardDrive, Settings, HelpCircle, ShieldCheck, X,
  CheckCircle2, AlertCircle, Menu, Monitor, Gamepad, Disc3, Sparkles
} from 'lucide-react'

type Game = { id: string; name: string; file: string; system: string; size: string }
const systems = ['Nintendo 64', 'Super Nintendo', 'Mega Drive', 'PlayStation', 'Game Boy', 'Game Boy Color', 'Game Gear', 'Atari', 'Arcade']

function App() {
  const [active, setActive] = useState('Início')
  const [modal, setModal] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState('Super Nintendo')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const filteredGames = useMemo(() => games.filter(g => (g.name + g.system).toLowerCase().includes(query.toLowerCase())), [games, query])
  const addGame = () => {
    if (!selectedFile) return
    const game: Game = {
      id: crypto.randomUUID(),
      name: selectedFile.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
      file: selectedFile.name,
      system: selectedSystem,
      size: (selectedFile.size / 1024 / 1024).toFixed(1) + ' MB',
    }
    setGames(current => [game, ...current])
    setSelectedFile(null)
    setModal(false)
    setActive('Biblioteca')
    setNotice('Arquivo adicionado à demonstração local. Ainda não foi enviado a um servidor.')
    window.setTimeout(() => setNotice(''), 6500)
  }

  const navItems = [
    { label: 'Início', icon: Home }, { label: 'Biblioteca', icon: LibraryBig },
    { label: 'Conquistas', icon: Trophy }, { label: 'Amigos', icon: Users },
    { label: 'Perfil', icon: UserRound }, { label: 'Consoles', icon: Gamepad2 },
    { label: 'Comunidade', icon: MessageSquare },
  ]
  const chooseNav = (label: string) => { setActive(label); setMobileNav(false) }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <button className="brand" onClick={() => chooseNav('Início')} aria-label="RETROVA início">
        <span>RETRO<span className="brand-accent">VA</span></span><i>✦</i>
      </button>
      <nav className="primary-nav">
        {navItems.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => chooseNav(label)}>
          <Icon size={19} strokeWidth={2.1}/><span>{label}</span>
          {label === 'Biblioteca' && games.length > 0 && <small className="nav-count">{games.length}</small>}
        </button>)}
      </nav>
      <div className="side-divider"/>
      <div className="side-label">SISTEMAS</div>
      <nav className="system-nav">
        {systems.map((system, i) => <button key={system} className="system-item" onClick={() => {setActive('Consoles'); setSelectedSystem(system)}}>
          {i === 3 ? <Disc3 size={17}/> : i === 0 ? <Gamepad size={17}/> : <Monitor size={17}/>}<span>{system}</span>
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="side-promo-icon"><Gamepad2 size={28}/><Sparkles size={13}/></div>
        <strong>Sua jornada começa aqui.</strong>
        <p>Adicione seus jogos e monte sua coleção pessoal.</p>
        <button className="text-link" onClick={() => setModal(true)}>Adicionar jogo <ChevronRight size={14}/></button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Abrir menu"><Menu/></button>
        <div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar na sua biblioteca..." /></div>
        <div className="top-actions"><button className="icon-button" aria-label="Notificações"><Bell size={19}/><span className="notification-dot"/></button><div className="top-divider"/><button className="account"><div className="avatar">P</div><span><b>Player</b><small>Perfil local</small></span><ChevronDown size={15}/></button></div>
      </header>

      <div className="content-grid">
        <section className="content-main">
          {active === 'Início' ? <>
            <section className="welcome-hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-dot"/> SUA PRÓXIMA FASE COMEÇA AQUI</div>
                <h1>Bem-vindo à<br/><span>RETROVA</span></h1>
                <p className="hero-lead">Sua biblioteca de jogos clássicos, do seu jeito.</p>
                <p className="hero-description">Adicione os jogos que você já possui, organize sua coleção e redescubra os clássicos diretamente no navegador.</p>
                <button className="primary-button" onClick={() => setModal(true)}><Plus size={19}/> Adicionar meu primeiro jogo</button>
                <button className="subtle-link" onClick={() => setActive('Consoles')}><Play size={14}/> Conhecer os sistemas compatíveis</button>
              </div>
              <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="mountain mountain-back"/><div className="mountain mountain-front"/><div className="grid-floor"/><div className="tiny-player"><span/></div></div>
              <div className="hero-glow"/>
            </section>

            <div className="section-heading"><div><span className="section-kicker">PRIMEIROS PASSOS</span><h2>Como começar?</h2></div></div>
            <div className="steps-grid">
              {[{n:'01',icon:FileUp,title:'Adicione seu jogo',desc:'Selecione um arquivo de jogo que você já possui.'},{n:'02',icon:Gamepad2,title:'Escolha o sistema',desc:'Informe o console para orientar a identificação.'},{n:'03',icon:Tag,title:'Confira os detalhes',desc:'Revise o nome e as informações identificadas.'},{n:'04',icon:Play,title:'Prepare-se para jogar',desc:'O jogo ficará na sua biblioteca quando a integração estiver pronta.'}].map(({n,icon:Icon,title,desc})=><article className="step-card" key={n}><div className="step-top"><span>{n}</span><div className="step-icon"><Icon size={21}/></div></div><h3>{title}</h3><p>{desc}</p></article>)}
            </div>

            <div className="section-heading consoles-heading"><div><span className="section-kicker">COMPATIBILIDADE</span><h2>Sistemas em planejamento</h2></div><button className="view-link" onClick={() => setActive('Consoles')}>Ver sistemas <ChevronRight size={14}/></button></div>
            <div className="systems-grid">{systems.slice(0,7).map((s,i)=><button className="system-card" key={s} onClick={() => {setSelectedSystem(s);setActive('Consoles')}}><span className="system-glyph">{['N64','SNES','MD','PS','GB','GBC','GG'][i]}</span><b>{s}</b><small>{i < 3 ? 'Planejado para suporte' : 'Em avaliação'}</small></button>)}</div>
          </> : active === 'Biblioteca' ? <>
            <div className="page-heading"><div><span className="section-kicker">SUA COLEÇÃO</span><h1>Minha biblioteca</h1><p>Seus jogos, organizados em um só lugar.</p></div><button className="primary-button compact" onClick={() => setModal(true)}><Plus size={17}/> Adicionar jogo</button></div>
            {filteredGames.length ? <div className="game-list">{filteredGames.map(g=><article className="game-row" key={g.id}><div className="game-cover"><Gamepad2 size={27}/></div><div className="game-info"><b>{g.name}</b><span>{g.system} · {g.file}</span></div><small>{g.size}</small><span className="local-tag">LOCAL · DEMO</span></article>)}</div> : <EmptyState onAdd={() => setModal(true)} title={query ? 'Nenhum jogo encontrado' : 'Sua biblioteca está vazia'} text={query ? 'Tente outro termo de busca.' : 'Os jogos que você adicionar aparecerão aqui. Cada coleção é privada e pertence à sua conta.'} />}
          </> : active === 'Consoles' ? <>
            <div className="page-heading"><div><span className="section-kicker">PLATAFORMAS</span><h1>Sistemas</h1><p>Veja os sistemas previstos para a RETROVA.</p></div></div>
            <div className="console-list">{systems.map((s,i)=><button key={s} className={`console-row ${selectedSystem===s?'selected':''}`} onClick={()=>setSelectedSystem(s)}><div className="console-icon"><Gamepad2/></div><span><b>{s}</b><small>{i<3?'Em planejamento inicial':'Compatibilidade a validar'}</small></span><ChevronRight size={17}/></button>)}</div>
          </> : <ComingSoon title={active}/>}
        </section>

        <aside className="right-rail">
          <section className="rail-card profile-card"><div className="rail-heading"><span>MEU ESPAÇO</span><button aria-label="Configurações" className="mini-icon"><Settings size={15}/></button></div><div className="profile-row"><div className="profile-avatar">P</div><div><b>Player</b><small>Bem-vindo à RETROVA</small></div></div><div className="profile-foot"><span>Biblioteca pessoal</span><b>{games.length.toString().padStart(2,'0')} jogos</b></div></section>
          <section className="rail-card storage-card"><div className="rail-heading"><span><HardDrive size={15}/> ARQUIVOS DESTA SESSÃO</span></div><div className="storage-empty"><div className="storage-ring"><span>{games.length}</span></div><div><b>{games.length === 0 ? 'Nenhum arquivo selecionado' : `${games.length} arquivo(s) na demonstração`}</b><small>Sem envio para servidor nesta versão.</small></div></div><div className="privacy-note"><ShieldCheck size={14}/> Seus arquivos não são enviados nesta demonstração.</div></section>
          <section className="rail-card activity-card"><div className="rail-heading"><span>ATIVIDADE</span></div><div className="activity-empty"><div className="empty-icon"><UploadCloud size={22}/></div><b>Nenhuma atividade ainda</b><p>Quando você adicionar jogos, sua atividade aparecerá aqui.</p></div></section>
          <section className="help-card"><div className="help-icon"><HelpCircle size={19}/></div><div><b>Precisa de ajuda?</b><p>Entenda como sua biblioteca pessoal vai funcionar.</p><button onClick={()=>setNotice('A central de ajuda será implementada em uma próxima etapa.')}>Central de ajuda <ChevronRight size={13}/></button></div></section>
        </aside>
      </div>
      <footer className="footer"><span className="footer-brand">RETRO<span>VA</span></span><span>O passado dos games. Uma nova forma de jogar.</span><div><button onClick={()=>setNotice('Central de ajuda ainda não implementada.')}>Ajuda</button><button onClick={()=>setNotice('Termos de uso serão publicados antes do lançamento.')}>Termos de uso</button><button onClick={()=>setNotice('Política de privacidade será publicada antes do lançamento.')}>Privacidade</button></div></footer>
    </main>

    {mobileNav && <button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Fechar menu"/>}
    {notice && <div className="toast"><AlertCircle size={17}/>{notice}<button onClick={()=>setNotice('')} aria-label="Fechar"><X size={15}/></button></div>}
    {modal && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><section className="upload-modal"><div className="modal-header"><div><span className="section-kicker">SUA COLEÇÃO</span><h2>Adicionar jogo</h2></div><button className="icon-button" onClick={()=>setModal(false)} aria-label="Fechar"><X/></button></div><p className="modal-description">Selecione um arquivo de jogo que você já possui e informe o sistema correspondente.</p><label className="field-label">Sistema</label><select value={selectedSystem} onChange={e=>setSelectedSystem(e.target.value)}>{systems.map(s=><option key={s}>{s}</option>)}</select><input ref={fileRef} className="file-input" type="file" onChange={e=>setSelectedFile(e.target.files?.[0] ?? null)} accept=".nes,.sfc,.smc,.gb,.gbc,.gba,.n64,.z64,.v64,.md,.gen,.bin,.cue,.iso,.chd,.zip,.7z" /><button className="drop-zone" onClick={()=>fileRef.current?.click()}><div className="drop-icon"><UploadCloud size={24}/></div><b>{selectedFile ? selectedFile.name : 'Escolha um arquivo do seu dispositivo'}</b><span>{selectedFile ? `${(selectedFile.size/1024/1024).toFixed(1)} MB · arquivo selecionado` : 'Selecione uma ROM compatível. O envio real ainda não está conectado.'}</span><small>Selecionar arquivo</small></button><div className="modal-warning"><ShieldCheck size={16}/><span>Protótipo local: o arquivo não sai do seu navegador e não é salvo em uma conta.</span></div><div className="modal-actions"><button className="secondary-button" onClick={()=>setModal(false)}>Cancelar</button><button className="primary-button compact" disabled={!selectedFile} onClick={addGame}><Plus size={16}/> Adicionar à demonstração</button></div></section></div>}
  </div>
}

function EmptyState({onAdd,title,text}:{onAdd:()=>void,title:string,text:string}) {
  return <div className="empty-state"><div className="empty-visual"><div className="empty-orbit orbit-one"/><div className="empty-orbit orbit-two"/><div className="empty-console"><Gamepad2 size={36}/></div></div><span className="section-kicker">COMECE SUA COLEÇÃO</span><h2>{title}</h2><p>{text}</p><button className="primary-button" onClick={onAdd}><Plus size={18}/> Adicionar jogo</button></div>
}
function ComingSoon({title}:{title:string}) {
  return <div className="coming-page"><div className="coming-icon"><Sparkles size={27}/></div><span className="section-kicker">EM DESENVOLVIMENTO</span><h1>{title}</h1><p>Esta área faz parte da visão da RETROVA, mas ainda não está implementada. Primeiro vamos garantir que adicionar e organizar seus jogos funcione de verdade.</p></div>
}
export default App
