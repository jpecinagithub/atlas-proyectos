import { useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PROYECTOS, TIPOS, type Proyecto, type TipoProyecto } from './data/projects';
import { ProjectDiagram } from './arch';
import { Ecosystem } from './eco';

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
      title={active ? 'Quitar de favoritos' : 'Marcar como favorito'}
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

function Catalog() {
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
      if (nq && !(p.name + ' ' + p.description + ' ' + p.repo).toLowerCase().includes(nq)) return false;
      return true;
    });
  }, [q, tipo, prov, dock, soloFavs, favs]);

  return (
    <div>
      <div className="hero">
        <h1>Atlas de <span className="grad">Proyectos</span></h1>
        <p>
          Los 51 proyectos explicados de forma visual: qué es cada uno, dónde vive su código,
          dónde se despliega, qué arquitectura usa y con qué servicios externos habla.
        </p>
      </div>
      <div className="stats">
        <div className="stat"><b>{PROYECTOS.length}</b><span>proyectos</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.vercelUrl).length}</b><span>en Vercel</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.docker).length}</b><span>con Docker</span></div>
        <div className="stat"><b>{PROYECTOS.filter(p => p.providers && !p.providers.includes('por confirmar')).length}</b><span>proveedor verificado</span></div>
      </div>
      <div className="toolbar">
        <input className="search" placeholder="🔍 Buscar proyecto…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="toolbar">
        <div className="chips">
          <button className={'chip' + (tipo === 'todos' ? ' active' : '')} onClick={() => setTipo('todos')}>Todos</button>
          {(Object.keys(TIPOS) as TipoProyecto[]).map(t => (
            <button key={t} className={'chip' + (tipo === t ? ' active' : '')} onClick={() => setTipo(t)}>
              <span className="dot" style={{ background: TIPOS[t].color }} />{TIPOS[t].label}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar">
        <div className="chips">
          <button className={'chip' + (prov === 'con' ? ' active' : '')} onClick={() => setProv(prov === 'con' ? 'todos' : 'con')}>🤖 con proveedor externo</button>
          <button className={'chip' + (dock ? ' active' : '')} onClick={() => setDock(!dock)}>🐳 con Docker en servidor</button>
          <button className={'chip' + (soloFavs ? ' active' : '')} onClick={() => setSoloFavs(!soloFavs)}>⭐ Favoritos{favs.length > 0 ? ` (${favs.length})` : ''}</button>
        </div>
      </div>
      {list.length === 0 && <div className="empty">Sin resultados. Prueba con otro filtro.</div>}
      <div className="grid">
        {list.map(p => (
          <a key={p.id} className="card" href={'#/p/' + p.id} style={{ position: 'relative' }}>
            <Star active={favs.includes(p.id)} onToggle={e => { e.preventDefault(); toggleFav(p.id); }} />
            <div className="thumb"><Thumb p={p} /></div>
            <div className="card-body">
              <h3>{p.name}</h3>
              <p>{p.description || '—'}</p>
              <div className="badges">
                <span className="badge type" style={{ background: TIPOS[p.type].color }}>{TIPOS[p.type].label}</span>
                {p.providers && <span className="badge">🤖 {p.providers.replace(/ ✓/g, '').split(',')[0]}</span>}
                {p.docker && !p.docker.includes('sin docker') && <span className="badge">🐳 Docker</span>}
                {!p.vercelUrl && <span className="badge">sin Vercel</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Detail({ id }: { id: string }) {
  const p = PROYECTOS.find(x => x.id === id);
  const [favs, toggleFav] = useFavoritos();
  if (!p) return <div className="empty">Proyecto no encontrado. <a href="#/">Volver al catálogo</a></div>;
  const verified = p.providers.includes('✓');
  const isFav = favs.includes(p.id);
  return (
    <div>
      <a className="back" href="#/">← Volver al catálogo</a>
      <div className="detail-hero">
        <div className="thumb" style={{ aspectRatio: '16 / 7' }}><Thumb p={p} big /></div>
        <div className="detail-head">
          <div>
            <h1>{p.name}</h1>
            <p className="sub">{p.description || '—'}</p>
            <div className="badges" style={{ marginTop: 10 }}>
              <span className="badge type" style={{ background: TIPOS[p.type].color }}>{TIPOS[p.type].label}</span>
              <span className="badge">{p.visibility === 'Privado' ? '🔒' : '🌍'} {p.visibility || 'Público'}</span>
            </div>
          </div>
          <div className="links">
            {p.vercelUrl && <a className="btn primary" href={p.vercelUrl} target="_blank" rel="noreferrer">▲ Abrir web</a>}
            <a className="btn" href={p.github} target="_blank" rel="noreferrer">📦 GitHub</a>
            {p.github2 && <a className="btn" href={p.github2} target="_blank" rel="noreferrer">📦 GitHub (backend)</a>}
            <button className={'btn' + (isFav ? ' primary' : '')} onClick={() => toggleFav(p.id)}>
              {isFav ? '⭐ Favorito' : '☆ Marcar favorito'}
            </button>
          </div>
        </div>
      </div>
      <div className="panels">
        <div className="panel">
          <h2>🧭 Arquitectura</h2>
          <ProjectDiagram p={p} />
        </div>
        <div className="panel">
          <h2>📋 Ficha técnica</h2>
          <dl className="kv">
            <dt>Tipo</dt><dd>{TIPOS[p.type].label}</dd>
            <dt>Repositorio</dt><dd><a href={p.github} target="_blank" rel="noreferrer">{p.repo}</a></dd>
            {p.github2 && <><dt>Repo backend</dt><dd><a href={p.github2} target="_blank" rel="noreferrer">BACK-AGENT</a></dd></>}
            <dt>Despliegue</dt><dd>{p.vercelUrl ? <a href={p.vercelUrl} target="_blank" rel="noreferrer">{p.vercelUrl.replace('https://', '')}</a> : '— sin despliegue web —'}</dd>
            <dt>Proveedores</dt><dd>{p.providers ? p.providers + (verified ? '' : ' (por confirmar)') : '— ninguno —'}</dd>
            <dt>Docker</dt><dd>{p.docker || '—'}</dd>
            <dt>Visibilidad</dt><dd>{p.visibility || 'Público'}</dd>
          </dl>
          {p.notes && (<><h2 style={{ marginTop: 18 }}>📝 Observaciones</h2><p className="notes">{p.notes}</p></>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const hash = useHash();
  const isEco = hash === '#/ecosistema';
  const m = hash.match(/^#\/p\/(.+)$/);
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="#/" className="brand" style={{ color: 'var(--text)' }}>
            <span className="logo">🧭</span>
            <span>Atlas de Proyectos<small>51 proyectos · arquitectura visual</small></span>
          </a>
          <nav className="nav">
            <a href="#/" className={!isEco && !m ? 'active' : ''}>Catálogo</a>
            <a href="#/ecosistema" className={isEco ? 'active' : ''}>Ecosistema</a>
          </nav>
        </div>
      </header>
      <main className="main">
        {isEco ? <Ecosystem /> : m ? <Detail id={m[1]} /> : <Catalog />}
      </main>
      <footer className="footer">Atlas de Proyectos · generado a partir del inventario verificado · {new Date().getFullYear()}</footer>
      <Analytics />
    </>
  );
}
