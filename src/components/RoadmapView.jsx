import { useMemo, useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { NODES, STATUS_DOT } from '../data/roadmap.js'
import { buildGraph } from '../layout.js'
import MilestoneNode from './MilestoneNode.jsx'
import TopicCard from './TopicCard.jsx'
import GroupNode from './GroupNode.jsx'
import SidePanel from './SidePanel.jsx'
import ProgressPanel from './ProgressPanel.jsx'

const nodeTypes = { milestone: MilestoneNode, topic: TopicCard, group: GroupNode }
const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]))

const DIFF_BUCKETS = [
  { key: 'Easy', color: '#2bb3ad' },
  { key: 'Med.', diff: 'Medium', color: '#e6a23c' },
  { key: 'Hard', color: '#ef4444' },
]

export default function RoadmapView({
  status,
  notes,
  problemNotes,
  customProblems,
  cycleStatus,
  setNote,
  setProblemNote,
  addProblem,
  removeProblem,
  resetProgress,
  focusId,
  onExpandNote,
}) {
  const [selectedId, setSelectedId] = useState(focusId || null)

  const graph = useMemo(() => buildGraph(status, customProblems), [status, customProblems])
  const [nodes, setNodes, onNodesChange] = useNodesState(graph.nodes)
  const [edges, , onEdgesChange] = useEdgesState(graph.edges)

  useEffect(() => setNodes(graph.nodes), [graph.nodes, setNodes])
  useEffect(() => {
    if (focusId) setSelectedId(focusId)
  }, [focusId])

  const onNodeClick = useCallback((_, node) => {
    const def = NODE_BY_ID[node.id]
    if (def && def.kind !== 'group') setSelectedId(node.id)
  }, [])

  const stats = useMemo(() => {
    let solved = 0
    let attempting = 0
    let total = 0
    const by = { Easy: { s: 0, t: 0 }, Medium: { s: 0, t: 0 }, Hard: { s: 0, t: 0 } }
    NODES.forEach((n) =>
      (n.problems || []).forEach((pr, i) => {
        total += 1
        if (by[pr.diff]) by[pr.diff].t += 1
        const st = status[`${n.id}#${i}`]
        if (st === 'solved') {
          solved += 1
          if (by[pr.diff]) by[pr.diff].s += 1
        } else if (st === 'attempting') attempting += 1
      }),
    )
    // 自定义题目也计入总进度
    Object.entries(customProblems || {}).forEach(([sid, list]) =>
      list.forEach((pr) => {
        total += 1
        if (by[pr.diff]) by[pr.diff].t += 1
        const st = status[`${sid}#${pr.id}`]
        if (st === 'solved') {
          solved += 1
          if (by[pr.diff]) by[pr.diff].s += 1
        } else if (st === 'attempting') attempting += 1
      }),
    )
    const buckets = DIFF_BUCKETS.map((b) => {
      const d = b.diff || b.key
      return { key: b.key, color: b.color, s: by[d].s, t: by[d].t }
    })
    return { solved, attempting, total, buckets }
  }, [status, customProblems])

  const selected = selectedId ? NODE_BY_ID[selectedId] : null

  return (
    <div className="flow-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedId(null)}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.25}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable nodeColor={(n) => STATUS_DOT[n.data?.state] || '#dfe3e8'} />
      </ReactFlow>

      <ProgressPanel stats={stats} onReset={resetProgress} />

      <SidePanel
        node={selected}
        status={status}
        notes={notes}
        problemNotes={problemNotes}
        customProblems={customProblems}
        onCycle={cycleStatus}
        onNote={setNote}
        onProblemNote={setProblemNote}
        onAddProblem={addProblem}
        onRemoveProblem={removeProblem}
        onExpandNote={onExpandNote}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
