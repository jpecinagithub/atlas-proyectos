import type { Proyecto } from './data/projects';

interface Node { title: string; sub?: string; hl?: boolean; }

function short(s: string, n = 30): string {
  const t = s.replace(/ ✓/g, '').trim();
  return t.length > n ? t.slice(0, n - 1) + '…' : t;
}

export function FlowDiagram({ nodes, labels = [] as string[] }: { nodes: Node[]; labels?: string[] }) {
  const W = 940, H = 190, gap = 24;
  const nw = (W - gap * (nodes.length - 1)) / nodes.length;
  const nh = 110, y = 40;
  return (
    <svg className="diagram" viewBox={`0 0 ${W} ${H}`} role="img">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="#818cf8" />
        </marker>
      </defs>
      {nodes.map((n, i) => {
        const x = i * (nw + gap);
        return (
          <g key={i}>
            <rect className={n.hl ? 'node-hl' : 'node'} x={x} y={y} width={nw} height={nh} rx={12} />
            <text x={x + nw / 2} y={y + 44} textAnchor="middle">{n.title}</text>
            {n.sub && (
              <text className="sub" x={x + nw / 2} y={y + 68} textAnchor="middle">
                {n.sub.length > 34 ? n.sub.slice(0, 33) + '…' : n.sub}
              </text>
            )}
            {i > 0 && (
              <>
                <line className="edge" x1={x - gap} y1={y + nh / 2} x2={x - 4} y2={y + nh / 2} />
                {labels[i - 1] && (
                  <text className="elabel" x={x - gap / 2} y={y + nh / 2 - 10} textAnchor="middle">{labels[i - 1]}</text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const TOPOLOGY_INFO: Record<string, string> = {
  'vercel': 'Todo vive en Vercel: la web estática y, si hace falta, funciones serverless. Sin servidor propio.',
  'serverless-ai': 'Frontend y funciones serverless en Vercel; la IA se consume como API externa.',
  'docker': 'Frontend en Vercel; el backend corre en contenedores Docker del servidor propio.',
  'llm-local': 'Frontend en Vercel; el modelo LLM corre en local en el servidor (sin proveedor externo).',
  'agentjob': 'Arquitectura de dos repositorios: el front desplegado en Vercel y el backend en un repo separado sin despliegue.',
  'servidor': 'Aplicación completa en el servidor propio, sin Vercel.',
  'mixto-db': 'Frontend en Vercel con base de datos y almacenamiento gestionados (serverless).',
};

export function ProjectDiagram({ p }: { p: Proyecto }) {
  const user: Node = { title: '👤 Usuario', sub: 'navegador' };
  let nodes: Node[] = [];
  let labels: string[] = [];
  switch (p.topology) {
    case 'serverless-ai':
      nodes = [user, { title: '▲ Vercel', sub: 'front + functions', hl: true }, { title: '🤖 ' + short(p.providers || 'Proveedor IA', 22), sub: 'API externa' }];
      labels = ['HTTPS', 'API'];
      break;
    case 'docker': {
      const conts = p.docker.split(',').length;
      nodes = [user, { title: '▲ Vercel', sub: 'frontend', hl: true }, { title: '🐳 Servidor Docker', sub: `${conts} contenedores` }, { title: '🤖 ' + short(p.providers || 'Proveedor IA', 22), sub: 'API externa' }];
      labels = ['HTTPS', 'API', 'API'];
      break;
    }
    case 'llm-local':
      nodes = [user, { title: '▲ Vercel', sub: 'frontend', hl: true }, { title: '🖥️ Servidor', sub: 'gateway' }, { title: '🦙 llama.cpp', sub: 'Qwen en local' }];
      labels = ['HTTPS', 'HTTP', 'local'];
      break;
    case 'agentjob':
      nodes = [user, { title: '▲ Vercel', sub: 'FRONT-AGENT', hl: true }, { title: '📦 GitHub', sub: 'BACK-AGENT · sin despliegue' }];
      labels = ['usa', '—'];
      break;
    case 'servidor':
      nodes = [user, { title: '🖥️ Servidor propio', sub: 'PM2 · erp3-backend', hl: true }, { title: '🗄️ MySQL 8', sub: 'nativo' }];
      labels = ['HTTP', 'SQL'];
      break;
    case 'mixto-db':
      nodes = [user, { title: '▲ Vercel', sub: 'front + functions', hl: true }, { title: '🗄️ ' + short(p.providers || 'BD gestionada', 24), sub: 'serverless' }];
      labels = ['HTTPS', 'SQL/API'];
      break;
    default:
      nodes = [user, { title: '▲ Vercel', sub: 'Edge Network', hl: true }, { title: '📄 App web', sub: 'estática / serverless' }];
      labels = ['HTTPS', ''];
  }
  return (
    <div>
      <FlowDiagram nodes={nodes} labels={labels} />
      <p className="flow-note">🧭 <b>Cómo leerlo:</b> {TOPOLOGY_INFO[p.topology]}</p>
    </div>
  );
}
