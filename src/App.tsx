import { useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PROYECTOS, TIPO_COLOR, fechaActualizacion, type Proyecto, type TipoProyecto } from './data/projects';
import { ProjectDiagram } from './arch';
import { Ecosystem } from './eco';
import { LangCtx, STRINGS, type Lang } from './i18n';

function useHash(): string {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const fn = () => { setHash(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return hash;
}

function thumb(id: string) { return `/thumbs/${id}.jpg`; }
function shot(id: string) { return `/shots/${id}.jpg`; }

function Thumb({ p, big = false }: { p: Proyecto; big?: boolean }) {
  const [err, setErr] = useState(false);
  if (err) {
    return <div className="fallback">{p.name.charAt(0).toUpperCase()}</div>;
  }
  return <img src={big ? shot(p.id) : thumb(p.id)} alt={p.name} loading="lazy" onError={() => setErr(true)} />;
}

function useFavoritos(): [string[], (id: string) => void] {
  const [favs, setFavs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('atlas:favs') || '[]'); } catch { return []; }
  });
  const toggle = (id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('atlas:favs', JSON.stringify(next));
      return next;
    });
  };
  return [favs, toggle];
}

function Star({ active, onToggle }: { active: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onToggle}
      title={active ? '★' : '☆'}
      style={{
        position: 'absolute', top: 10, right: 10, zIndex: 2,
        width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)',
        background: 'rgba(11,16,32,0.75)', backdropFilter: 'blur(6px)',
        fontSize: '1.05rem', cursor: 'pointer', lineHeight: 1,
        filter: active ? 'none' : 'grayscale(1)', opacity: active ? 1 : 0.65,
      }}
    >⭐</button>
  );
}

function desc(p: Proyecto, lang: Lang): string {
  return lang === 'es' ? p.description : (p.description_en || p.description);
}

function Catalog({ lang }: { lang: Lang }) {
  const t = STRINGS[lang];
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState<TipoProyecto | 'todos'>('todos');
  const [prov, setProv] = useState<'todos' | 'con'>('todos');
  const [dock, setDock] = useState(false);
  const [soloFavs, setSoloFavs] = useState(false);
  const [favs, toggleFav] = useFavoritos();

  const list = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return PROYECTOS.filter(p => {
      if (tipo !== 'todos' && p.type !== tipo) return false;
      if (prov === 'con' && !p.providers) return false;
      if (dock && !p.docker) return false;
      if (soloFavs && !favs.includes(p.id)) return false;
      if (nq && !(p.name + ' ' + desc(p, lang) + ' ' + p.repo).toLowerCase().includes(nq)) return false;
      return true;
    });
  }, [q, tipo, prov, dock, soloFavs, favs, lang]);

  const typeLabel = (ty: TipoProyecto) => t[('type_' + ty) as keyof typeof t] as string;

  return (
    <div>
      <div className="hero">
        <h1>{t.heroTitleA} <span className="grad">{t.heroTitleB}</span></h1>
        <p>{t.heroP}</p>
      </div>
      <div className="stats">
        <div className="stat"><b>{PROYECTOS.length}</b><span>{t.sProjects}</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.vercelUrl).length}</b><span>{t.sVercel}</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.docker).length}</b><span>{t.sDocker}</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.providers && !p.providers.includes('por confirmar')).length}</b><span>{t.sProv}</span></div>
      </div>
      <div className="toolbar">
        <input className="search" placeholder={t.search} value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="toolbar">
        <div className="chips">
          <button className={'chip' + (tipo === 'todos' ? ' active' : '')} onClick={() => setTipo('todos')}>{t.all}</button>
          {(Object.keys(TIPO_COLOR) as TipoProyecto[]).map(ty => (
            <button key={ty} className={'chip' + (tipo === ty ? ' active' : '')} onClick={() => setTipo(ty)}>
              <span className="dot" style={{ background: TIPO_COLOR[ty] }} />{typeLabel(ty)}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <div className="chips">
          <button className={'chip' + (prov === 'con' ? ' active' : '')} onClick={() => setProv(prov === 'con' ? 'todos' : 'con')}>{t.fProv}</button>
          <button className={'chip' + (dock ? ' active' : '')} onClick={() => setDock(!dock)}>{t.fDocker}</button>
          <button className={'chip' + (soloFavs ? ' active' : '')} onClick={() => setSoloFavs(!soloFavs)}>{t.fFav}{favs.length > 0 ? ` (${favs.length})` : ''}</button>
        </div>
      </div>
      {list.length === 0 && <div className="empty">{t.empty}</div>}
      <div className="grid">
        {list.map(p => (
          <a key={p.id} className="card" href={'#/p/' + p.id} style={{ position: 'relative' }}>
            <Star active={favs.includes(p.id)} onToggle={e => { e.preventDefault(); toggleFav(p.id); }} />
            <div className="thumb"><Thumb p={p} /></div>
            <div className="card-body">
              <h3>{p.name}</h3>
              <p>{desc(p, lang) || '—'}</p>
              <div className="badges">
                <span className="badge type" style={{ background: TIPO_COLOR[p.type] }}>{typeLabel(p.type)}</span>
                {p.providers && <span className="badge">🤖 {p.providers.replace(/ ✓/g, '').split(',')[0]}</span>}
                {p.docker && !p.docker.includes('sin docker') && <span className="badge">🐳 Docker</span>}
                {!p.vercelUrl && (p.serverUrl
                  ? <a className="badge" href={p.serverUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ textDecoration: 'none' }}>🖥️ {t.srv}</a>
                  : <span className="badge">{t.noVercel}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Detail({ id, lang }: { id: string; lang: Lang }) {
  const t = STRINGS[lang];
  const p = PROYECTOS.find(x => x.id === id);
  const [favs, toggleFav] = useFavoritos();
  if (!p) return <div className="empty">{t.notFound} <a href="#/">{t.back}</a></div>;
  const verified = p.providers.includes('✓');
  const isFav = favs.includes(p.id);
  const siteUrl = p.vercelUrl || p.serverUrl || null;
  const typeLabel = t[('type_' + p.type) as keyof typeof t] as string;
  return (
    <div>
      <a className="back" href="#/">{t.back}</a>
      <div className="detail-hero">
        <div className="thumb" style={{ aspectRatio: '16 / 7' }}><Thumb p={p} big /></div>
        <div className="detail-head">
          <div>
            <h1>{p.name}</h1>
            <p className="sub">{desc(p, lang) || '—'}</p>
            <div className="badges" style={{ marginTop: 10 }}>
              <span className="badge type" style={{ background: TIPO_COLOR[p.type] }}>{typeLabel}</span>
              <span className="badge">{p.visibility === 'Privado' ? '🔒' : '🌍'} {p.visibility === 'Privado' ? t.priv : t.pub}</span>
            </div>
          </div>
          <div className="links">
            {siteUrl && <a className="btn primary" href={siteUrl} target="_blank" rel="noreferrer">{t.openSite}</a>}
            <a className="btn" href={p.github} target="_blank" rel="noreferrer">{t.github}</a>
            {p.github2 && <a className="btn" href={p.github2} target="_blank" rel="noreferrer">{t.githubBack}</a>}
            <button className={'btn' + (isFav ? ' primary' : '')} onClick={() => toggleFav(p.id)}>
              {isFav ? t.fav : t.markFav}
            </button>
          </div>
        </div>
      </div>
      <div className="panels">
        <div className="panel">
          <h2>{t.arch}</h2>
          <ProjectDiagram p={p} />
        </div>
        <div className="panel">
          <h2>{t.tech}</h2>
          <dl className="kv">
            <dt>{t.kType}</dt><dd>{typeLabel}</dd>
            <dt>{t.kRepo}</dt><dd><a href={p.github} target="_blank" rel="noreferrer">{p.repo}</a></dd>
            {p.github2 && <><dt>{t.kRepoBack}</dt><dd><a href={p.github2} target="_blank" rel="noreferrer">BACK-AGENT</a></dd></>}
            <dt>{t.kDeploy}</dt><dd>{siteUrl ? <a href={siteUrl} target="_blank" rel="noreferrer">{siteUrl.replace('https://', '')}</a> : t.noDeploy}</dd>
            <dt>{t.kProv}</dt><dd>{p.providers ? p.providers + (verified ? '' : ' ' + t.toConfirm) : t.none}</dd>
            <dt>{t.kDocker}</dt><dd>{p.docker || t.none}</dd>
            <dt>{t.kVis}</dt><dd>{p.visibility === 'Privado' ? t.priv : t.pub}</dd>
          </dl>
          {p.notes && (<><h2 style={{ marginTop: 18 }}>{t.notes}</h2><p className="notes">{p.notes}</p></>)}
        </div>
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="chips" role="group" aria-label="Idioma / Language">
      {(['es', 'en'] as Lang[]).map(l => (
        <button
          key={l}
          className={'chip' + (lang === l ? ' active' : '')}
          onClick={() => setLang(l)}
          style={{ textTransform: 'uppercase' }}
        >{l}</button>
      ))}
    </div>
  );
}

function Shell() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('atlas:lang') as Lang) || 'es');
  const t = STRINGS[lang];
  const hash = useHash();
  const change = (l: Lang) => { setLang(l); localStorage.setItem('atlas:lang', l); };
  const isEco = hash === '#/ecosistema';
  const m = hash.match(/^#\/p\/(.+)$/);
  return (
    <LangCtx.Provider value={{ lang, setLang: change }}>
      <header className="header">
        <div className="header-inner">
          <a href="#/" className="brand" style={{ color: 'var(--text)' }}>
            <span className="logo">🧭</span>
            <span>Atlas<small>{t.subtitle}</small></span>
          </a>
          <nav className="nav">
            <a href="#/" className={!isEco && !m ? 'active' : ''}>{t.navCatalog}</a>
            <a href="#/ecosistema" className={isEco ? 'active' : ''}>{t.navEco}</a>
          </nav>
          <LangToggle lang={lang} setLang={change} />
        </div>
      </header>
      <main className="main">
        {isEco ? <Ecosystem /> : m ? <Detail id={m[1]} lang={lang} /> : <Catalog lang={lang} />}
      </main>
      <footer className="footer">
        <div style={{ marginBottom: 8 }}>
          <a className="btn" href="/inventario-proyectos.xlsx" download>{t.dlExcel}</a>
        </div>
        Atlas · {t.updated} {fechaActualizacion()} · {new Date().getFullYear()}
      </footer>
      <Analytics />
    </LangCtx.Provider>
  );
}

export default function App() {
  return <Shell />;
}
