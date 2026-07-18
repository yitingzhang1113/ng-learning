import { Handle, Position } from '@xyflow/react'
import { useLang, pick, pick2 } from '../i18n.js'

// 分组盒子(容器),只画外框和标题;里面的卡片是独立的子节点
export default function GroupNode({ data }) {
  const { lang } = useLang()
  const { node, theme } = data
  return (
    <div className="group-box" style={{ background: theme.bg, borderColor: theme.border }}>
      <Handle type="target" position={Position.Left} className="rf-handle" />
      <div className="group-label">
        <span className="group-zh" style={{ color: theme.label }}>{pick(lang, node)}</span>
        <span className="group-en">{pick2(lang, node)}</span>
      </div>
      <Handle type="source" position={Position.Right} className="rf-handle" />
    </div>
  )
}
