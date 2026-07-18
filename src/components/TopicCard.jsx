import { STATUS_DOT } from '../data/roadmap.js'
import { useLang, pick, pick2 } from '../i18n.js'

// 分组盒子里的板块卡片,双语 + 状态点 + 进度条(点击打开右侧题目面板)
export default function TopicCard({ data, selected }) {
  const { lang } = useLang()
  const { node, theme, done, trying, total, state } = data
  const frac = total ? done / total : 0
  const dot = STATUS_DOT[state]
  const tint = selected ? undefined : { borderColor: theme.border }

  return (
    <div className={`topic-card ${state}${selected ? ' selected' : ''}`} style={tint}>
      <span className="card-accent" style={{ background: theme.accent }} />
      {total > 0 && <span className="node-dot" style={{ background: dot }} />}
      <div className="card-zh">{pick(lang, node)}</div>
      <div className="card-en">{pick2(lang, node)}</div>
      <div className="node-bar">
        <span style={{ width: `${frac * 100}%` }} />
      </div>
      {trying > 0 && <span className="node-trying">尝试中 {trying}</span>}
    </div>
  )
}
