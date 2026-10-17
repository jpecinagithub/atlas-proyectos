import { PROYECTOS } from './data/projects';

const SERVIDOR: [string, string, string, string][] = [
  ['🐳', 'gameforge-* (7)', 'api, worker, runner, browser, postgres, redis, caddy', 'gameforge-ai-studio'],
  ['🐳', 'brandforge-* (3)', 'docker-api, docker-worker, docker-postgres', 'brandforge'],
  ['🐳', 'nexus-* (3)', 'nexus-api, nexus-worker, nexus-db', 'nexus'],
  ['🐳', 'laptop-radar-* (2)', 'laptop-radar-api, laptop-radar-db', 'laptop-radar'],
  ['🐳', 'llm-* (2)', 'llm-gateway, qwen-llm (llama.cpp · Qwen)', 'llm-chat'],
  ['🐳', 'voice-* (3)', 'voice-gateway, voicestudio, cloudflared', 'voice-clone-frontend'],
  ['🐳', 'appforge-studio', 'infra-studio', 'appforge-ai-studio'],
  ['⚙️', 'MySQL 8.0', 'nativo, puerto 3306', 'infra compartida'],
  ['⚙️', 'erp3-backend', 'PM2 (nativo)', 'ERP3'],
  ['⚙️', 'opencode CLI', 'herramienta dev', '—'],
  ['🕒', 'crons', 'backups nexus/brandforge, daily laptop-radar, magic-hour 2×día', 'varios'],
];

function EcosystemDiagram() {
  return (
    <svg className="diagram" viewBox="0 0 940 340" role="img" aria-label="Diagrama del ecosistema">
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="#818cf8" />
        </marker>
      </defs>
      {/* GitHub */}
      <rect className="node-hl" x={370} y={16} width={200} height={84} rx={12} />
      <text x={470} y={50} textAnchor="middle">📦 GitHub</text>
      <text className="sub" x={470} y={72} textAnchor="middle">52 repositorios</text>
      {/* Vercel */}
      <rect className="node" x={60} y={170} width={220} height={100} rx={12} />
      <text x={170} y={206} textAnchor="middle">▲ Vercel</text>
      <text className="sub" x={170} y={228} textAnchor="middle">50 despliegues web</text>
      <text className="sub" x={170} y={246} textAnchor="middle">front + serverless</text>
      {/* Servidor */}
      <rect className="node" x={360} y={170} width={220} height={100} rx={12} />
      <text x={470} y={206} textAnchor="middle">🖥️ Servidor propio</text>
      <text className="sub" x={470} y={228} textAnchor="middle">21 contenedores Docker</text>
      <text className="sub" x={470} y={246} textAnchor="middle">+ MySQL · PM2 · crons</text>
      {/* Proveedores */}
      <rect className="node" x={660} y={170} width={220} height={100} rx={12} />
      <text x={770} y={206} textAnchor="middle">🤖 Proveedores</text>
      <text className="sub" x={770} y={228} textAnchor="middle">OpenRouter · Groq · Alibaba</text>
      <text className="sub" x={770} y={246} textAnchor="middle">Mistral · Gemini · Neon…</text>
      {/* arrows */}
      <line x1={430} y1={100} x2={220} y2={168} stroke="#818cf8" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={470} y1={100} x2={470} y2={168} stroke="#818cf8" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={510} y1={100} x2={720} y2={168} stroke="#818cf8" strokeWidth={2} markerEnd="url(#arrow2)" />
      <text className="elabel" x={300} y={140} textAnchor="middle">despliega</text>
      <text className="elabel" x={500} y={140} textAnchor="middle">aloja</text>
      <text className="elabel" x={640} y={140} textAnchor="middle">consume</text>
      {/* user */}
      <line x1={170} y1={270} x2={170} y2={312} stroke="#818cf8" strokeWidth={2} markerEnd="url(#arrow2)" />
      <line x1={470} y1={270} x2={470} y2={312} stroke="#818cf8" strokeWidth={2} markerEnd="url(#arrow2)" />
      <text x={170} y={332} textAnchor="middle" fontSize={13} fontWeight={700}>👤 Usuarios</text>
      <text x={470} y={332} textAnchor="middle" fontSize={13} fontWeight={700}>👤 Usuarios</text>
    </svg>
  );
}

export function Ecosystem() {
  const conProv = PROYECTOS.filter(p => p.providers && !p.providers.includes('por confirmar'));
  const conDocker = PROYECTOS.filter(p => p.docker && !p.docker.includes('sin docker'));
  return (
    <div>
      <div className="hero">
        <h1>El <span className="grad">ecosistema</span> completo</h1>
        <p>
          Tres pilares sostienen los 51 proyectos: <b>GitHub</b> guarda el código, <b>Vercel</b> sirve las webs
          y el <b>servidor propio</b> corre los backends con Docker. Los <b>proveedores externos</b> aportan
          IA, bases de datos y servicios.
        </p>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <EcosystemDiagram />
        <div className="legend">
          <span><i style={{ background: '#a78bfa' }} />origen del código</span>
          <span><i style={{ background: '#818cf8' }} />plataformas</span>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><b>51</b><span>proyectos</span></div>
        <div className="stat"><b>52</b><span>repos GitHub</span></div>
        <div className="stat"><b>50</b><span>despliegues Vercel</span></div>
        <div className="stat"><b>21</b><span>contenedores Docker</span></div>
        <div className="stat"><b>{conProv.length}</b><span>con proveedor externo</span></div>
        <div className="stat"><b>{conDocker.length}</b><span>con Docker en servidor</span></div>
      </div>
      <div className="panels">
        <div className="panel">
          <h2>🤖 Proveedores externos verificados</h2>
          <table className="data">
            <thead><tr><th>Proyecto</th><th>Proveedor</th></tr></thead>
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
          <h2>🖥️ Servidor propio · inventario</h2>
          <table className="data">
            <thead><tr><th></th><th>Servicio</th><th>Detalle</th></tr></thead>
            <tbody>
              {SERVIDOR.map(([icon, name, det], i) => (
                <tr key={i}><td>{icon}</td><td>{name}</td><td style={{ color: 'var(--muted)' }}>{det}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 12 }}>
            Tres contenedores huérfanos (docker-api/worker/postgres) resultaron ser el backend de <b>brandforge</b>,
            identificado por sus variables de entorno.
          </p>
        </div>
      </div>
    </div>
  );
}
