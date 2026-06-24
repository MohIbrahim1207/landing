import { useRef, useState, useEffect, useCallback } from 'react';
import { images } from '../data/images';

// Product nodes for the pipeline — each connected to a real product image
const NODES = [
  {
    id: 'homogenizer',
    label: 'High Pressure Homogenizer',
    shortLabel: 'HPH',
    tag: '01',
    image: images.products.homogenizer,
    specs: ['Up to 1,500 bar', 'Cobalt valve seats', 'CIP ready'],
    cx: '8%',
    cy: '45%',
    hAlign: 'right',
    vAlign: 'bottom',
  },
  {
    id: 'selfCleaning',
    label: 'Self Cleaning Filter',
    shortLabel: 'SCF',
    tag: '02',
    image: images.products.selfCleaningFilter,
    specs: ['Auto-backwash', '0 consumables', 'DP triggered'],
    cx: '28%',
    cy: '32%',
    hAlign: 'right',
    vAlign: 'top',
  },
  {
    id: 'bagFilter',
    label: 'Bag Filter Housing',
    shortLabel: 'BFH',
    tag: '03',
    image: images.products.bagFilterHousing,
    specs: ['ASME Sec. VIII', 'Up to 24 bags', 'Swing-bolt closure'],
    cx: '50%',
    cy: '55%',
    hAlign: 'left',
    vAlign: 'bottom',
  },
  {
    id: 'pneumatic',
    label: 'Pneumatic Conveying',
    shortLabel: 'PCS',
    tag: '04',
    image: images.products.pneumaticConveying,
    specs: ['Dense phase', 'Dilute phase', 'Airlock feeders'],
    cx: '72%',
    cy: '28%',
    hAlign: 'left',
    vAlign: 'top',
  },
  {
    id: 'dustCollector',
    label: 'Dust Collector',
    shortLabel: 'DC',
    tag: '05',
    image: images.products.dustCollector,
    specs: ['Pulse-jet cleaning', 'ATEX panels', 'HEPA post-filter'],
    cx: '92%',
    cy: '48%',
    hAlign: 'left',
    vAlign: 'bottom',
  },
];

// Pre-generate particle positions (avoid random in render)
const NUM_PARTICLES = 18;
const PARTICLE_POOL = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
  offset: (i / NUM_PARTICLES),
  speed: 0.0008 + (i % 5) * 0.00015,
  size: 2 + (i % 3),
  opacity: 0.5 + (i % 4) * 0.12,
}));

// SVG cubic bezier path through all 5 nodes (percentage coordinates)
const PATH_D =
  'M 8,45 C 15,38 20,26 28,32 C 36,38 38,52 50,55 C 60,57 65,25 72,28 C 79,31 85,50 92,48';

function FlowParticle({ particle, svgRef, animOffset }) {
  const circleRef = useRef(null);
  const tRef = useRef(particle.offset);

  useEffect(() => {
    let rafId;
    const path = svgRef.current?.querySelector('#flow-path');
    if (!path) return;
    const totalLength = path.getTotalLength();

    const animate = () => {
      tRef.current = (tRef.current + particle.speed) % 1;
      const pt = path.getPointAtLength(tRef.current * totalLength);
      if (circleRef.current) {
        circleRef.current.setAttribute('cx', pt.x);
        circleRef.current.setAttribute('cy', pt.y);
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [particle, svgRef]);

  return (
    <circle
      ref={circleRef}
      r={particle.size}
      fill="#00e0ff"
      opacity={particle.opacity}
      style={{ filter: 'drop-shadow(0 0 4px #00e0ff)' }}
    />
  );
}

export default function HeroPipeline() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [activeNode, setActiveNode] = useState(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });

  const handleNodeClick = useCallback((node, e) => {
    e.stopPropagation();
    if (activeNode?.id === node.id) {
      setActiveNode(null);
      return;
    }
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    // Parse percentage to absolute
    const cx = parseFloat(node.cx) / 100 * rect.width;
    const cy = parseFloat(node.cy) / 100 * rect.height;
    setCardPos({ x: cx, y: cy });
    setActiveNode(node);
  }, [activeNode]);

  const handleDismiss = useCallback(() => setActiveNode(null), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
      onClick={handleDismiss}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glowing cyan gradient for the pipe */}
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e0ff" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#00e0ff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#0080ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00e0ff" stopOpacity="0.15" />
          </linearGradient>

          {/* Glow filter for path */}
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip circle for product images */}
          {NODES.map((node) => (
            <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
              <circle cx="0" cy="0" r="5.5" />
            </clipPath>
          ))}
        </defs>

        {/* Pipeline base glow (thick, dim) */}
        <path
          id="flow-path-glow"
          d={PATH_D}
          fill="none"
          stroke="#00e0ff"
          strokeWidth="1.2"
          strokeOpacity="0.08"
          vectorEffect="non-scaling-stroke"
          style={{ filter: 'blur(2px)' }}
        />

        {/* Primary pipeline */}
        <path
          id="flow-path"
          d={PATH_D}
          fill="none"
          stroke="url(#pipeGrad)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#glowFilter)"
        />

        {/* Animated flow particles */}
        {PARTICLE_POOL.map((p, i) => (
          <FlowParticle key={i} particle={p} svgRef={svgRef} />
        ))}

        {/* Node rings + product image thumbnails */}
        {NODES.map((node) => {
          const cx = parseFloat(node.cx);
          const cy = parseFloat(node.cy);
          const isActive = activeNode?.id === node.id;
          return (
            <g
              key={node.id}
              transform={`translate(${cx}, ${cy})`}
              onClick={(e) => handleNodeClick(node, e)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulsing ring */}
              <circle
                r={isActive ? 9 : 7.5}
                fill="none"
                stroke="#00e0ff"
                strokeWidth={isActive ? 0.5 : 0.3}
                strokeOpacity={isActive ? 0.9 : 0.5}
                style={{
                  transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  filter: isActive ? 'drop-shadow(0 0 3px #00e0ff)' : 'none',
                }}
              />
              {/* Inner dark backing */}
              <circle r="5.5" fill="#0d1516" stroke="#1a2d30" strokeWidth="0.4" />

              {/* Product thumbnail */}
              <image
                href={node.image}
                x="-5.5" y="-5.5"
                width="11" height="11"
                clipPath={`url(#clip-${node.id})`}
                preserveAspectRatio="xMidYMid slice"
                style={{ opacity: isActive ? 1 : 0.85, transition: 'opacity 0.3s' }}
              />

              {/* Active center dot */}
              <circle
                r="1.2"
                fill={isActive ? '#00e0ff' : 'transparent'}
                style={{ transition: 'fill 0.3s', filter: 'drop-shadow(0 0 2px #00e0ff)' }}
              />

              {/* Tag label */}
              <text
                x="0"
                y="-8.5"
                textAnchor="middle"
                fill="#00e0ff"
                fontSize="2.2"
                fontFamily="'Geist Mono', monospace"
                fontWeight="600"
                style={{ opacity: 0.85, userSelect: 'none' }}
              >
                {node.tag}
              </text>
              <text
                x="0"
                y="-11.2"
                textAnchor="middle"
                fill="#bac9cd"
                fontSize="1.8"
                fontFamily="'Inter', sans-serif"
                style={{ userSelect: 'none' }}
              >
                {node.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hotspot detail card — rendered as HTML overlay */}
      {activeNode && (
        <HotspotCard
          node={activeNode}
          svgRef={svgRef}
          onDismiss={handleDismiss}
        />
      )}

      {/* Bottom legend: inline product tags */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 pb-2 px-4">
        {NODES.map((n) => (
          <button
            key={n.id}
            onClick={(e) => { e.stopPropagation(); handleNodeClick(n, e); }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider transition-all duration-300
              ${activeNode?.id === n.id
                ? 'bg-[#00e0ff]/15 border border-[#00e0ff]/50 text-[#00e0ff]'
                : 'bg-white/3 border border-white/8 text-on-surface-variant hover:border-[#00e0ff]/30 hover:text-[#00e0ff]'
              }`}
          >
            <span className="w-1 h-1 rounded-full bg-[#00e0ff] shrink-0" />
            {n.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function HotspotCard({ node, svgRef, onDismiss }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0, transform: 'scale(0.9) translateY(6px)' });

  useEffect(() => {
    // Animate in
    const t = setTimeout(() => {
      setStyle({ opacity: 1, transform: 'scale(1) translateY(0)' });
    }, 20);
    return () => clearTimeout(t);
  }, [node.id]);

  // Position the card relative to the SVG node
  const svgRect = svgRef.current?.getBoundingClientRect();
  const containerRect = svgRef.current?.parentElement?.getBoundingClientRect();
  if (!svgRect || !containerRect) return null;

  const cx = parseFloat(node.cx) / 100 * svgRect.width;
  const cy = parseFloat(node.cy) / 100 * svgRect.height;
  const offsetX = svgRect.left - containerRect.left;
  const offsetY = svgRect.top - containerRect.top;

  // Decide card position relative to the node
  const CARD_W = 220;
  const CARD_H = 200;
  let left = offsetX + cx - CARD_W / 2;
  let top = offsetY + cy - CARD_H - 70;

  // Clamp to container
  left = Math.max(8, Math.min(left, containerRect.width - CARD_W - 8));
  top = Math.max(8, Math.min(top, containerRect.height - CARD_H - 8));

  return (
    <div
      ref={cardRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left,
        top,
        width: CARD_W,
        zIndex: 20,
        transition: 'opacity 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        ...style,
      }}
      className="rounded-xl overflow-hidden border border-[#00e0ff]/30 bg-[#0d1516]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,224,255,0.15)]"
    >
      {/* Product image */}
      <div className="relative h-[100px] overflow-hidden bg-[#080f11]">
        <img
          src={node.image}
          alt={node.label}
          className="w-full h-full object-cover"
          style={{ mixBlendMode: 'lighten', opacity: 0.9 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1516] via-[#0d1516]/30 to-transparent" />
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#00e0ff]/10 border border-[#00e0ff]/30 rounded text-[9px] font-mono text-[#00e0ff] tracking-wider">
          NODE {node.tag}
        </div>
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs transition-all"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-2">
        <p className="text-xs font-bold text-on-surface leading-tight">{node.label}</p>
        <ul className="space-y-1">
          {node.specs.map((spec) => (
            <li key={spec} className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
              <span className="w-1 h-1 rounded-full bg-[#00e0ff] shrink-0" />
              {spec}
            </li>
          ))}
        </ul>
        <a
          href="#systems"
          className="block w-full text-center py-1.5 mt-1 rounded-md bg-[#00e0ff]/10 hover:bg-[#00e0ff]/20 border border-[#00e0ff]/20 text-[10px] font-mono text-[#00e0ff] tracking-wider transition-all duration-200"
          onClick={onDismiss}
        >
          VIEW FULL SPECS →
        </a>
      </div>
    </div>
  );
}
