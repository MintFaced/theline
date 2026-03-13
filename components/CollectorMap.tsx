'use client'
// components/CollectorMap.tsx
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

interface Node {
  id: string
  name: string
  slug: string
  lineNumber: number
  allLineNumbers: number[]
  category: string
  image: string | null
  xHandle: string | null
  // D3 simulation adds these
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

interface Edge {
  source: string | Node
  target: string | Node
  count: number
}

interface GraphData {
  generated: string
  nodeCount: number
  edgeCount: number
  nodes: Node[]
  edges: Edge[]
}

const CATEGORY_COLORS: Record<string, string> = {
  photography:   '#C8A96E',
  illustration:  '#7EB8A4',
  ai:            '#A67BC8',
  generative:    '#6E9EC8',
  painting:      '#C87E7E',
  '3d':          '#C8B97E',
  glitch:        '#7EC8A0',
  mixed:         '#A0A0A0',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category?.toLowerCase()] ?? '#555'
}

export function CollectorMap({ initialData }: { initialData: GraphData | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)
  const simulationRef = useRef<any>(null)

  const [graphData, setGraphData] = useState<GraphData | null>(initialData)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<Node | null>(null)
  const [selected, setSelected] = useState<Node | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [stats, setStats] = useState({ connections: 0, mostConnected: '' })

  // Mouse state for pan/zoom
  const isDragging = useRef(false)
  const lastMouse = useRef({ x: 0, y: 0 })
  const isPinching = useRef(false)
  const lastPinchDist = useRef(0)
  const draggedNode = useRef<Node | null>(null)

  const transformRef = useRef(transform)
  transformRef.current = transform

  const hoveredRef = useRef<Node | null>(null)
  hoveredRef.current = hovered

  const graphRef = useRef<GraphData | null>(null)
  graphRef.current = graphData

  // Load graph data — use initialData if passed from server, otherwise fetch
  useEffect(() => {
    function processData(data: GraphData) {
      setGraphData(data)
      const connectionCount: Record<string, number> = {}
      for (const e of data.edges) {
        const s = typeof e.source === 'string' ? e.source : e.source.id
        const t = typeof e.target === 'string' ? e.target : e.target.id
        connectionCount[s] = (connectionCount[s] || 0) + 1
        connectionCount[t] = (connectionCount[t] || 0) + 1
      }
      const topId = Object.entries(connectionCount).sort((a, b) => b[1] - a[1])[0]?.[0]
      const topNode = data.nodes.find(n => n.id === topId)
      setStats({ connections: data.edgeCount, mostConnected: topNode?.name ?? '' })
      setLoading(false)
    }

    if (initialData) {
      processData(initialData)
      return
    }

    fetch('/api/graph/data')
      .then(r => {
        if (!r.ok) throw new Error('Graph data not found')
        return r.json()
      })
      .then(processData)
      .catch(() => {
        setError('Graph not yet computed. Visit /api/graph/compute?secret=theline-cron-2026-ve3oe to generate it.')
        setLoading(false)
      })
  }, [initialData])

  // D3 simulation + canvas render
  useEffect(() => {
    if (!graphData || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const container = containerRef.current
    const W = container.clientWidth
    const H = container.clientHeight
    canvas.width = W
    canvas.height = H

    // Dynamically import D3 simulation
    import('d3-force').then(({ forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide }) => {
      const nodes: Node[] = graphData.nodes.map(n => ({ ...n }))
      const nodeMap: Record<string, Node> = {}
      for (const n of nodes) nodeMap[n.id] = n

      const edges: Edge[] = graphData.edges
        .filter(e => nodeMap[typeof e.source === 'string' ? e.source : e.source.id] &&
                     nodeMap[typeof e.target === 'string' ? e.target : e.target.id])
        .map(e => ({
          source: typeof e.source === 'string' ? e.source : (e.source as Node).id,
          target: typeof e.target === 'string' ? e.target : (e.target as Node).id,
          count: e.count,
        }))

      // Node degree for sizing
      const degree: Record<string, number> = {}
      for (const e of edges) {
        const s = e.source as string
        const t = e.target as string
        degree[s] = (degree[s] || 0) + 1
        degree[t] = (degree[t] || 0) + 1
      }
      const maxDegree = Math.max(...Object.values(degree), 1)

      function nodeRadius(n: Node): number {
        const d = degree[n.id] || 0
        return 3 + (d / maxDegree) * 12
      }

      const sim = forceSimulation(nodes as any)
        .force('link', forceLink(edges as any)
          .id((d: any) => d.id)
          .distance(40)
          .strength(0.3))
        .force('charge', forceManyBody().strength(-60))
        .force('center', forceCenter(W / 2, H / 2))
        .force('collide', forceCollide().radius((d: any) => nodeRadius(d) + 2))
        .alphaDecay(0.02)

      simulationRef.current = { sim, nodes, edges, nodeMap, degree, maxDegree, nodeRadius }

      function draw() {
        const { x, y, k } = transformRef.current
        ctx.clearRect(0, 0, W, H)

        ctx.save()
        ctx.translate(x, y)
        ctx.scale(k, k)

        // Draw edges
        const hovNode = hoveredRef.current
        const selNode = selected

        for (const e of edges) {
          const s = e.source as Node
          const t = e.target as Node
          if (!s.x || !t.x) continue

          const isHighlighted = hovNode && (s.id === hovNode.id || t.id === hovNode.id)
          ctx.beginPath()
          ctx.moveTo(s.x!, s.y!)
          ctx.lineTo(t.x!, t.y!)
          ctx.strokeStyle = isHighlighted ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.06)'
          ctx.lineWidth = isHighlighted ? (1.5 / k) : (0.5 / k)
          ctx.stroke()
        }

        // Draw nodes
        for (const n of nodes) {
          if (!n.x) continue
          const r = nodeRadius(n)
          const isHov = hovNode?.id === n.id
          const isSel = selNode?.id === n.id
          const isConnected = hovNode && edges.some(e => {
            const s = (e.source as Node).id
            const t = (e.target as Node).id
            return (s === hovNode.id && t === n.id) || (t === hovNode.id && s === n.id)
          })

          ctx.beginPath()
          ctx.arc(n.x!, n.y!, r, 0, Math.PI * 2)

          if (isHov || isSel) {
            ctx.fillStyle = '#C8A96E'
          } else if (isConnected) {
            ctx.fillStyle = 'rgba(200,169,110,0.5)'
          } else if (hovNode) {
            ctx.fillStyle = 'rgba(255,255,255,0.1)'
          } else {
            ctx.fillStyle = getCategoryColor(n.category)
          }
          ctx.fill()

          // Label for high-degree or hovered nodes
          if ((degree[n.id] || 0) > maxDegree * 0.15 || isHov || isSel) {
            ctx.font = `${isHov ? 500 : 400} ${(11 / k).toFixed(1)}px monospace`
            ctx.fillStyle = isHov ? '#F0EDE6' : 'rgba(240,237,230,0.5)'
            ctx.textAlign = 'center'
            ctx.fillText(n.name, n.x!, n.y! - r - (4 / k))
          }
        }

        ctx.restore()
      }

      sim.on('tick', () => {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = requestAnimationFrame(draw)
      })

      sim.on('end', draw)
    })

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      simulationRef.current?.sim?.stop()
    }
  }, [graphData])

  // Redraw on transform / hover change
  useEffect(() => {
    if (!simulationRef.current) return
    const { sim } = simulationRef.current
    if (sim.alpha() < 0.01) {
      // Manually trigger a draw
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = requestAnimationFrame(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        const { nodes, edges, degree, maxDegree, nodeRadius } = simulationRef.current
        const { x, y, k } = transformRef.current
        const hovNode = hoveredRef.current

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(k, k)

        for (const e of edges) {
          const s = e.source as Node
          const t = e.target as Node
          if (!s.x || !t.x) continue
          const isHighlighted = hovNode && (s.id === hovNode.id || t.id === hovNode.id)
          ctx.beginPath()
          ctx.moveTo(s.x!, s.y!)
          ctx.lineTo(t.x!, t.y!)
          ctx.strokeStyle = isHighlighted ? 'rgba(200,169,110,0.6)' : 'rgba(255,255,255,0.06)'
          ctx.lineWidth = isHighlighted ? (1.5 / k) : (0.5 / k)
          ctx.stroke()
        }

        for (const n of nodes) {
          if (!n.x) continue
          const r = nodeRadius(n)
          const isHov = hovNode?.id === n.id
          const isConnected = hovNode && edges.some((e: Edge) => {
            const s = (e.source as Node).id
            const t = (e.target as Node).id
            return (s === hovNode.id && t === n.id) || (t === hovNode.id && s === n.id)
          })

          ctx.beginPath()
          ctx.arc(n.x!, n.y!, r, 0, Math.PI * 2)
          if (isHov) ctx.fillStyle = '#C8A96E'
          else if (isConnected) ctx.fillStyle = 'rgba(200,169,110,0.5)'
          else if (hovNode) ctx.fillStyle = 'rgba(255,255,255,0.1)'
          else ctx.fillStyle = getCategoryColor(n.category)
          ctx.fill()

          if ((degree[n.id] || 0) > maxDegree * 0.15 || isHov) {
            ctx.font = `${isHov ? 500 : 400} ${(11 / k).toFixed(1)}px monospace`
            ctx.fillStyle = isHov ? '#F0EDE6' : 'rgba(240,237,230,0.5)'
            ctx.textAlign = 'center'
            ctx.fillText(n.name, n.x!, n.y! - r - (4 / k))
          }
        }
        ctx.restore()
      })
    }
  }, [hovered, transform])

  // Hit test — find node under cursor
  const hitTest = useCallback((cx: number, cy: number): Node | null => {
    if (!simulationRef.current) return null
    const { nodes, nodeRadius } = simulationRef.current
    const { x, y, k } = transformRef.current
    // Convert screen coords to graph coords
    const gx = (cx - x) / k
    const gy = (cy - y) / k

    let closest: Node | null = null
    let closestDist = Infinity
    for (const n of nodes) {
      if (!n.x) continue
      const r = nodeRadius(n)
      const dx = gx - n.x!
      const dy = gy - n.y!
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < r + 4 && dist < closestDist) {
        closest = n
        closestDist = dist
      }
    }
    return closest
  }, [])

  // Canvas mouse events
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    if (draggedNode.current) {
      const { k, x, y } = transformRef.current
      draggedNode.current.fx = (cx - x) / k
      draggedNode.current.fy = (cy - y) / k
      simulationRef.current?.sim?.alphaTarget(0.3).restart()
      return
    }

    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }))
      return
    }

    const node = hitTest(cx, cy)
    setHovered(node)
    canvasRef.current!.style.cursor = node ? 'pointer' : 'grab'
  }, [hitTest])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const node = hitTest(cx, cy)

    if (node) {
      draggedNode.current = node
      node.fx = node.x
      node.fy = node.y
    } else {
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
      canvasRef.current!.style.cursor = 'grabbing'
    }
  }, [hitTest])

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedNode.current) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const node = hitTest(e.clientX - rect.left, e.clientY - rect.top)
      if (node?.id === draggedNode.current.id) {
        setSelected(s => s?.id === node.id ? null : node)
      }
      draggedNode.current.fx = null
      draggedNode.current.fy = null
      draggedNode.current = null
      simulationRef.current?.sim?.alphaTarget(0)
    }
    isDragging.current = false
    canvasRef.current!.style.cursor = 'grab'
  }, [hitTest])

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const rect = canvasRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    setTransform(t => {
      const newK = Math.max(0.1, Math.min(5, t.k * factor))
      const scale = newK / t.k
      return {
        k: newK,
        x: cx - scale * (cx - t.x),
        y: cy - scale * (cy - t.y),
      }
    })
  }, [])

  // Selected node connections
  const selectedConnections = selected && graphData ? graphData.edges.filter(e => {
    const s = typeof e.source === 'string' ? e.source : (e.source as Node).id
    const t = typeof e.target === 'string' ? e.target : (e.target as Node).id
    return s === selected.id || t === selected.id
  }).map(e => {
    const s = typeof e.source === 'string' ? e.source : (e.source as Node).id
    const t = typeof e.target === 'string' ? e.target : (e.target as Node).id
    const otherId = s === selected.id ? t : s
    const direction = s === selected.id ? 'sent to' : 'received from'
    const other = graphData.nodes.find(n => n.id === otherId)
    return { other, direction, count: e.count }
  }).filter(c => c.other) : []

  return (
    <div className="relative w-full" style={{ height: '100vh' }}>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-5 flex items-start justify-between pointer-events-none">
        <div>
          <p className="label mb-1">The Line</p>
          <h1 className="font-display font-light text-2xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
            Collector Map
          </h1>
          {graphData && (
            <p className="font-mono text-[10px] text-line-muted tracking-widest mt-1">
              {graphData.nodeCount} artists · {graphData.edgeCount} connections
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="pointer-events-auto bg-line-bg/80 backdrop-blur border border-line-border p-4 hidden md:block">
          <p className="font-mono text-[9px] text-line-muted tracking-widest uppercase mb-3">Category</p>
          <div className="space-y-1.5">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="font-mono text-[9px] text-line-muted tracking-widest capitalize">{cat}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-line-border space-y-1">
            <p className="font-mono text-[9px] text-line-muted">Scroll to zoom</p>
            <p className="font-mono text-[9px] text-line-muted">Drag to pan</p>
            <p className="font-mono text-[9px] text-line-muted">Click node to inspect</p>
          </div>
        </div>
      </div>

      {/* Canvas */}
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-px h-16 bg-line-accent mx-auto mb-6 animate-pulse" />
            <p className="font-mono text-xs text-line-muted tracking-widest">Loading graph…</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="font-display font-light text-2xl text-line-text mb-4" style={{ letterSpacing: '-0.02em' }}>
              Graph not yet computed
            </p>
            <p className="font-sans text-sm text-line-muted mb-6">{error}</p>
            <code className="font-mono text-xs text-line-accent bg-line-surface px-4 py-2 block">
              /api/graph/compute?secret=theline-cron-2026-ve3oe
            </code>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: 'grab' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { isDragging.current = false; setHovered(null) }}
          onWheel={handleWheel}
        />
      )}

      {/* Selected node panel */}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 md:right-auto md:w-80 z-20 bg-line-bg/95 backdrop-blur border-t md:border-t-0 md:border-r border-line-border p-6 max-h-[50vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] text-line-accent tracking-widest uppercase mb-1">
                {selected.allLineNumbers.map(n => `LINE ${n}`).join(' · ')}
              </p>
              <h2 className="font-display font-light text-xl text-line-text" style={{ letterSpacing: '-0.02em' }}>
                {selected.name}
              </h2>
              {selected.xHandle && (
                <p className="font-mono text-[10px] text-line-muted mt-1">@{selected.xHandle}</p>
              )}
            </div>
            <button onClick={() => setSelected(null)} className="text-line-muted hover:text-line-text transition-colors font-mono text-xs">✕</button>
          </div>

          {selectedConnections.length > 0 ? (
            <>
              <p className="font-mono text-[10px] text-line-muted tracking-widest uppercase mb-3">
                {selectedConnections.length} connection{selectedConnections.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {selectedConnections.slice(0, 10).map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Link href={`/artists/${c.other!.slug}`}
                      className="font-sans text-xs text-line-text hover:text-line-accent transition-colors truncate">
                      {c.other!.name}
                    </Link>
                    <span className="font-mono text-[9px] text-line-muted ml-2 shrink-0">
                      {c.count} {c.count === 1 ? 'work' : 'works'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="font-sans text-xs text-line-muted">No connections with other Line artists yet.</p>
          )}

          <Link href={`/artists/${selected.slug}`}
            className="btn-outline text-xs mt-4 inline-flex">
            View Profile →
          </Link>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered && !selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-line-bg/90 backdrop-blur border border-line-border px-4 py-2 pointer-events-none">
          <p className="font-mono text-xs text-line-text">{hovered.name}</p>
          <p className="font-mono text-[10px] text-line-muted">
            LINE {hovered.lineNumber} · {hovered.category}
          </p>
        </div>
      )}

      {/* Back link */}
      <div className="absolute bottom-6 right-6 z-10">
        <Link href="/artists" className="font-mono text-[10px] text-line-muted hover:text-line-accent transition-colors tracking-widest">
          ← All Artists
        </Link>
      </div>
    </div>
  )
}
