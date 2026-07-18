import { NODES, DIFF } from '../data/roadmap.js'
import { SYSTEM_DESIGN, OOD_EXAMPLES, OOD_REAL, SD_ID, OOD_ID } from '../data/prep.js'
import { useLang, pick, pick2 } from '../i18n.js'
import ProblemNoteEditor from './ProblemNoteEditor.jsx'

const STATUS_ICON = { undefined: '○', attempting: '◐', solved: '✓' }
const STATUS_CLS = { undefined: 'st-none', attempting: 'st-try', solved: 'st-done' }

// 根据 sectionId + index 找到题目(导图题按序号,自定义题/系统设计/OOD 按 id)
function findItem(sectionId, index, customProblems) {
  const inCustom = (sid) => (customProblems?.[sid] || []).find((p) => p.id === index)
  if (sectionId === SD_ID)
    return { item: SYSTEM_DESIGN.find((x) => x.id === index) || inCustom(SD_ID), from: '系统设计 System Design' }
  if (sectionId === OOD_ID)
    return {
      item: OOD_REAL.find((x) => x.id === index) || OOD_EXAMPLES.find((x) => x.id === index) || inCustom(OOD_ID),
      from: 'OOD',
    }
  const node = NODES.find((n) => n.id === sectionId)
  if (!node) return { item: null }
  if (typeof index === 'string') {
    const cp = (customProblems?.[sectionId] || []).find((p) => p.id === index)
    if (cp) return { item: cp, from: node }
  }
  return { item: node.problems?.[index], from: node }
}

// 独立的整页笔记编辑界面。index 为 '__module__' 时编辑的是板块整体笔记。
export default function NotePage({ target, status, notes, problemNotes, customProblems, onCycle, onProblemNote, onNote, onBack }) {
  const { lang, t } = useLang()
  if (!target) return null
  const { sectionId, index } = target
  const isModule = index === '__module__'

  let item, fromLabel
  if (isModule) {
    item = NODES.find((n) => n.id === sectionId)
    fromLabel = `📒 ${t('moduleNote')}`
  } else {
    const found = findItem(sectionId, index, customProblems)
    item = found.item
    fromLabel = typeof found.from === 'string' ? found.from : `${pick(lang, found.from)}`
  }
  if (!item) return null

  const key = `${sectionId}#${index}`
  const st = status[key]
  const diff = !isModule && item.diff ? DIFF[item.diff] : null

  return (
    <div className="note-page">
      <button className="note-back" onClick={onBack}>{t('back')}</button>

      <div className="note-head">
        <div className="note-titles">
          <div className="note-from">{fromLabel}</div>
          <h1>{pick(lang, item)}</h1>
          <div className="note-sub">{pick2(lang, item)}</div>
        </div>
        <div className="note-actions">
          {diff && (
            <span className="diff big" style={{ color: diff.color }}>{item.diff}</span>
          )}
          {!isModule && (
            <button
              className={`status-btn big ${STATUS_CLS[st] || 'st-none'}`}
              onClick={() => onCycle(sectionId, index)}
              title={t(st === 'solved' ? 'stSolved' : st === 'attempting' ? 'stTry' : 'stNone')}
            >
              {STATUS_ICON[st] || '○'}
            </button>
          )}
          {!isModule && item.url && (
            <a className="mini-link" href={item.url} target="_blank" rel="noreferrer">
              LeetCode ↗
            </a>
          )}
        </div>
      </div>

      <div className="note-editor-wide">
        <ProblemNoteEditor
          value={isModule ? notes?.[sectionId] : problemNotes[key]}
          onChange={(val) =>
            isModule ? onNote(sectionId, val) : onProblemNote(sectionId, index, val)
          }
        />
      </div>
    </div>
  )
}
