import dagre from '@dagrejs/dagre'
import { NODES, EDGES, FLOATING, THEMES } from './data/roadmap.js'

// 尺寸常量(卡片放大版)
const MILE_W = 220
const MILE_H = 74
const CARD_W = 200
const CARD_H = 64
const GAP = 12
const PAD_X = 14
const PAD_TOP = 38
const PAD_BOTTOM = 14

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
const topicsOf = (groupId) => NODES.filter((n) => n.kind === 'topic' && n.group === groupId)

// 节点配色:自己有 theme 用自己的;topic 没写就继承所属分组的;兜底灰色。
const themeOf = (n) =>
  THEMES[n.theme] || (n.group && byId[n.group] ? THEMES[byId[n.group].theme] : null) || THEMES.gray

// 某节点的做题聚合:done / trying / total,以及状态(done/doing/none)
// 自定义题目(customProblems)一并计入
function agg(node, status, customProblems) {
  const statics = node.problems || []
  const customs = (customProblems && customProblems[node.id]) || []
  const total = statics.length + customs.length
  if (total === 0) return { done: 0, trying: 0, total: 0, state: 'none' }
  let done = 0
  let trying = 0
  const tally = (st) => {
    if (st === 'solved') done += 1
    else if (st === 'attempting') trying += 1
  }
  statics.forEach((_, i) => tally(status[`${node.id}#${i}`]))
  customs.forEach((p) => tally(status[`${node.id}#${p.id}`]))
  const state = done === total ? 'done' : done > 0 || trying > 0 ? 'doing' : 'none'
  return { done, trying, total, state }
}

// 计算一个分组盒子的尺寸(按 cols 排成网格)
function groupSize(groupId) {
  const kids = topicsOf(groupId)
  const cols = byId[groupId].cols || (kids.length > 3 ? 2 : 1)
  const rows = Math.ceil(kids.length / cols)
  const width = PAD_X * 2 + cols * CARD_W + (cols - 1) * GAP
  const height = PAD_TOP + rows * CARD_H + (rows - 1) * GAP + PAD_BOTTOM
  return { width, height, cols, rows }
}

export function buildGraph(status, customProblems = {}) {
  const floating = new Set(FLOATING)
  const milestones = NODES.filter((n) => n.kind === 'milestone')
  const groups = NODES.filter((n) => n.kind === 'group')

  // ── dagre 只排「非浮动」的 milestone / group ──
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'LR', nodesep: 34, ranksep: 80, marginx: 24, marginy: 24 })
  g.setDefaultEdgeLabel(() => ({}))

  milestones.forEach((m) => {
    if (!floating.has(m.id)) g.setNode(m.id, { width: MILE_W, height: MILE_H })
  })
  groups.forEach((gr) => {
    if (!floating.has(gr.id)) {
      const { width, height } = groupSize(gr.id)
      g.setNode(gr.id, { width, height })
    }
  })
  EDGES.forEach(([from, to]) => {
    if (!floating.has(from) && !floating.has(to)) g.setEdge(from, to)
  })
  dagre.layout(g)

  const pos = {} // id -> {x,y} 左上角
  g.nodes().forEach((id) => {
    const n = g.node(id)
    const w = byId[id].kind === 'group' ? groupSize(id).width : MILE_W
    const h = byId[id].kind === 'group' ? groupSize(id).height : MILE_H
    pos[id] = { x: n.x - w / 2, y: n.y - h / 2 }
  })

  // ── 浮动分组(其他算法):放到整张图的左下角,避免和其它盒子重叠 ──
  // 取所有已排布节点的最低点,再往下放一行
  let maxBottom = 0
  Object.keys(pos).forEach((id) => {
    const h = byId[id].kind === 'group' ? groupSize(id).height : MILE_H
    maxBottom = Math.max(maxBottom, pos[id].y + h)
  })
  const leftX = pos['array'] ? pos['array'].x : 40
  floating.forEach((id) => {
    pos[id] = { x: leftX, y: maxBottom + 50 }
  })

  // ── 组装 React Flow 节点 ──
  const rfNodes = []

  // 里程碑
  milestones.forEach((m) => {
    rfNodes.push({
      id: m.id,
      type: 'milestone',
      position: pos[m.id] || { x: 0, y: 0 },
      data: { node: m, theme: themeOf(m), ...agg(m, status, customProblems) },
    })
  })

  // 分组盒子(父节点)+ 里面的 topic 卡片(子节点)
  groups.forEach((gr) => {
    const { width, height, cols } = groupSize(gr.id)
    rfNodes.push({
      id: gr.id,
      type: 'group',
      position: pos[gr.id] || { x: 0, y: 0 },
      data: { node: gr, theme: themeOf(gr) },
      style: { width, height },
      selectable: false,
    })
    topicsOf(gr.id).forEach((t, idx) => {
      const col = idx % cols
      const row = Math.floor(idx / cols)
      rfNodes.push({
        id: t.id,
        type: 'topic',
        parentId: gr.id,
        extent: 'parent',
        draggable: false,
        position: {
          x: PAD_X + col * (CARD_W + GAP),
          y: PAD_TOP + row * (CARD_H + GAP),
        },
        data: { node: t, theme: themeOf(t), ...agg(t, status, customProblems) },
      })
    })
  })

  // ── 边(带箭头)──
  const rfEdges = EDGES.map(([from, to, style]) => ({
    id: `${from}->${to}`,
    source: from,
    target: to,
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed', width: 20, height: 20, color: '#6e7a88' },
    style: {
      stroke: '#6e7a88',
      strokeWidth: 2.6,
      strokeDasharray: style === 'dashed' ? '7 5' : undefined,
    },
  }))

  return { nodes: rfNodes, edges: rfEdges }
}

export const SIZES = { CARD_W, CARD_H, MILE_W, MILE_H }
