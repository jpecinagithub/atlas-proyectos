import { PROYECTOS } from './data/projects';
import { useLang, STRINGS } from './i18n';

const SERVIDOR: [string, string, string][] = [
  ['🐳', 'gameforge-* (7)', 'api, worker, runner, browser, postgres, redis, caddy'],
  ['🐳', 'brandforge-* (3)', 'docker-api, docker-worker, docker-postgres'],
  ['🐳', 'nexus-* (3)', 'nexus-api, nexus-worker, nexus-db'],
  ['🐳', 'laptop-radar-* (2)', 'laptop-radar-api, laptop-radar-db'],
  ['🐳', 'llm-* (2)', 'llm-gateway, qwen-llm (llama.cpp · Qwen)'],
  ['🐳', 'voice-* (3)', 'voice-gateway, voicestudio, cloudflared'],
  ['🐳', 'appforge-studio', 'infra-studio'],
  ['⚙️', 'MySQL 8.0', 'native, port 3306'],
  ['⚙️', 'erp3-backend', 'PM2 (native)'],
  ['⚙️', 'opencode CLI', 'dev tool'],
  ['🕒', 'crons', 'nexus/brandforge backups, laptop-radar daily, magic-hour 2×day'],
];

function EcosystemDiagram() {
  const { lang } = useLang();
  const t = STRINGS[lang];
  return (
    <svg className="diagram" viewBox="0 0 940 340" role="img" aria-label="Ecosystem">
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="#fb923c" />
        </marker>
      </defs>
      <rect className="node-hl" x={370} y={16} width={200} height={84} rx={12} />
      <text x={470} y={50} textAnchor="middle">{t.dGithub}</text>
      <text className="sub" x={470} y={72} textAnchor="middle">{t.dRepos}</text>
      <rect className="node" x={60} y={170} width={220} height={100} rx={12} />
      <text x={170} y={206} textAnchor="middle">{t.dVercel}</text>
      <text className="sub" x={170} y={228} textAnchor="middle">{t.dDeploys}</text>
      <text className="sub" x={170} y={246} textAnchor="middle">{t.dFrontServerless}</text>
      <rect className="node" x={360} y={170} width={220} height={100} rx={12} />
      <text x={470} y={206} textAnchor="middle">{t.dOwnServer}</text>
      <text className="sub" x={470} y={228} textAnchor="middle">{t.dContainers}</text>
      <text className="sub" x={470} y={246} textAnchor="middle">{t.dInfra}</text>
      <rect className="node" x={660} y={170} width={220} height={100} rx={12} />
      <text x={770} y={206} textAnchor="middle">{t.dProviders}</text>
      <text className="sub" x={770} y={228} textAnchor="middle">OpenRouter · Groq · Alibaba</text>
      <text className="sub" x={770} y={246} textAnchor="middle">Mistral · Gemini · Neon…</text>
      <line x1={430} y1={100} x2={220} y2={168} stroke="#fb923c" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={470} y1={100} x2={470} y2={168} stroke="#fb923c" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={510} y1={100} x2={720} y2={168} stroke="#fb923c" strokeWidth={2} markerEnd="url(#arrow2)" />
      <text className="elabel" x={300} y={140} textAnchor="middle">{t.dDeploys2}</text>
      <text className="elabel" x={500} y={140} textAnchor="middle">{t.dHosts}</text>
      <text className="elabel" x={640} y={140} textAnchor="middle">{t.dConsumes}</text>
      <line x1={170} y1={270} x2={170} y2={312} stroke="#fb923c" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={470} y1={270} x2={470} y2={312} stroke="#fb923c" strokeWidth={2} markerEnd="url(#arrow2)" />
      <text x={170} y={332} textAnchor="middle" fontSize={13} fontWeight={700}>{t.dUsers}</text>
      <text x={470} y={332} textAnchor="middle" fontSize={13} fontWeight={700}>{t.dUsers}</text>
    </svg>
  );
}

export function Ecosystem() {
  const { lang } = useLang();
  const t = STRINGS[lang];
  const conProv = PROYECTOS.filter(p => p.providers && !p.providers.includes('por confirmar'));
  const conDocker = PROYECTOS.filter(p => p.docker && !p.docker.includes('sin docker'));
  return (
    <div>
      <div className="hero">
        <h1>{t.ecoTitleA} <span className="grad">{t.ecoTitleB}</span> {t.ecoTitleC}</h1>
        <p>{t.ecoP}</p>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <EcosystemDiagram />
        <div className="legend">
          <span><i style={{ background: '#a78bfa' }} />{t.legCode}</span>
          <span><i style={{ background: '#fb923c' }} />{t.legPlat}</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><b>51</b><span>{t.eProjects}</span></div>
        <div className="stat"><b>52</b><span>{t.eRepos}</span></div>
        <div className="stat"><b>50</b><span>{t.eDeploys}</span></div>
        <div className="stat"><b>21</b><span>{t.eContainers}</span></div>
        <div className="stat"><b>{conProv.length}</b><span>{t.eProv}</span></div>
        <div className="stat"><b>{conDocker.length}</b><span>{t.eDocker}</span></div>
      </div>
      <div className="panels">
        <div className="panel">
          <h2>{t.provTitle}</h2>
          <table className="data">
            <thead><tr><th>{t.thProject}</th><th>{t.thProvider}</th></tr></thead>
            <tbody>
              {conProv.map(p => (
                <tr key={p.id}>
                  <td><a href={'#/p/' + p.id}>{p.name}</a></td>
                  <td>{p.providers.replace(/ ✓/g, '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h2>{t.srvTitle}</h2>
          <table className="data">
            <thead><tr><th></th><th>{t.thService}</th><th>{t.thDetail}</th></tr></thead>
            <tbody>
              {SERVIDOR.map(([icon, name, det], i) => (
                <tr key={i}><td>{icon}</td><td>{name}</td><td style={{ color: 'var(--muted)' }}>{det}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 12 }}>{t.srvNote}</p>
        </div>
      </div>
    </div>
  );
}
