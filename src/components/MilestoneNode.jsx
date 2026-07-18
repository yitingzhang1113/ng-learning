import { Handle, Position } from '@xyflow/react'
import { STATUS_DOT } from '../data/roadmap.js'
import { useLang, pick, pick2 } from '../i18n.js'

// 里程碑节点(独立卡片,如 数组 / 链表 / 二叉树),双语 + 状态点 + 进度条
export default function MilestoneNode({ data, selected }) {
  const { lang } = useLang()
  const { node, theme, done, trying, total, state } = data
  const frac = total ? done / total : 0
  const dot = STATUS_DOT[state]
  // 选中时交给 CSS 的蓝色高亮;平时用板块自己的柔和配色
  const tint = selected ? undefined : { background: theme.bg, borderColor: theme.border }

  return (
    <div className={`mile-node ${state}${selected ? ' selected' : ''}`} style={tint}>
      <Handle type="target" position={Position.Left} className="rf-handle" />
      {total > 0 && <span className="node-dot" style={{ background: dot }} />}
      <div className="mile-zh" style={{ color: theme.label }}>{pick(lang, node)}</div>
      <div className="mile-en">{pick2(lang, node)}</div>
      {total > 0 ? (
        <div className="node-bar">
          <span style={{ width: `${frac * 100}%` }} />
        </div>
      ) : (
        <div className="node-bar ghost" />
      )}
      {trying > 0 && <span className="node-trying">尝试中 {trying}</span>}
      <Handle type="source" position={Position.Right} className="rf-handle" />
    </div>
  )
}
