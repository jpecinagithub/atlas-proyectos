import type { Proyecto } from './data/projects';
import { useLang, STRINGS } from './i18n';

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

export function ProjectDiagram({ p }: { p: Proyecto }) {
  const { lang } = useLang();
  const t = STRINGS[lang];
  const topoKey = ('topo_' + p.topology) as keyof typeof t;
  const user: Node = { title: t.user, sub: t.browser };
  let nodes: Node[] = [];
  let labels: string[] = [];
  switch (p.topology) {
    case 'serverless-ai':
      nodes = [user, { title: t.vercel, sub: t.frontFunctions, hl: true }, { title: '🤖 ' + short(p.providers || 'AI', 22), sub: t.extApi }];
      labels = ['HTTPS', 'API'];
      break;
    case 'docker': {
      const conts = p.docker.split(',').length;
      nodes = [user, { title: t.vercel, sub: t.frontend, hl: true }, { title: t.dockerServer, sub: `${conts} ${t.containers}` }, { title: '🤖 ' + short(p.providers || 'AI', 22), sub: t.extApi }];
      labels = ['HTTPS', 'API', 'API'];
      break;
    }
    case 'llm-local':
      nodes = [user, { title: t.vercel, sub: t.frontend, hl: true }, { title: t.server, sub: t.gateway }, { title: t.llamacpp, sub: t.qwenLocal }];
      labels = ['HTTPS', 'HTTP', 'local'];
      break;
    case 'agentjob':
      nodes = [user, { title: t.vercel, sub: 'FRONT-AGENT', hl: true }, { title: t.gh, sub: t.backAgentNoDeploy }];
      labels = ['→', '—'];
      break;
    case 'servidor':
      nodes = [user, { title: t.ownServer, sub: t.pm2erp, hl: true }, { title: t.mysql, sub: t.native }];
      labels = ['HTTP', 'SQL'];
      break;
    case 'mixto-db':
      nodes = [user, { title: t.vercel, sub: t.frontFunctions, hl: true }, { title: '🗄️ ' + short(p.providers || 'DB', 24), sub: 'serverless' }];
      labels = ['HTTPS', 'SQL/API'];
      break;
    default:
      nodes = [user, { title: t.vercel, sub: t.edge, hl: true }, { title: t.webApp, sub: t.staticServerless }];
      labels = ['HTTPS', ''];
  }
  return (
    <div>
      <FlowDiagram nodes={nodes} labels={labels} />
      <p className="flow-note">🧭 <b>{t.howTo}</b> {t[topoKey] as string}</p>
    </div>
  );
}
