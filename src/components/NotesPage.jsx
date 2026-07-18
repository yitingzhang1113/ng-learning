import { useState } from 'react'
import { NODES } from '../data/roadmap.js'
import { SYSTEM_DESIGN, OOD_EXAMPLES, OOD_REAL, SD_ID, OOD_ID } from '../data/prep.js'
import { useLang, pick, pick2 } from '../i18n.js'
import ProblemNoteEditor, { noteFilled, noteSummary } from './ProblemNoteEditor.jsx'

// 汇总所有「可记笔记」的条目:导图题(含自定义题)+ 系统设计 + OOD
function allItems(customProblems) {
  const items = []
  NODES.forEach((n) => {
    ;(n.problems || []).forEach((pr, i) =>
      items.push({
        key: `${n.id}#${i}`, sectionId: n.id, idx: i,
        zh: pr.zh, en: pr.en, url: pr.url,
        groupKey: n.id, groupZh: n.zh, groupEn: n.en, kind: 'roadmap', nodeId: n.id,
      }),
    )
    ;((customProblems || {})[n.id] || []).forEach((pr) =>
      items.push({
        key: `${n.id}#${pr.id}`, sectionId: n.id, idx: pr.id,
        zh: pr.zh, en: pr.en, url: pr.url,
        groupKey: n.id, groupZh: n.zh, groupEn: n.en, kind: 'roadmap', nodeId: n.id,
      }),
    )
  })
  const pushPrep = (sid, it, groupZh, groupEn, kind) =>
    items.push({ key: `${sid}#${it.id}`, sectionId: sid, idx: it.id, zh: it.zh, en: it.en, groupKey: sid, groupZh, groupEn, kind })
  SYSTEM_DESIGN.forEach((it) => pushPrep(SD_ID, it, '系统设计', 'System Design', 'sysdesign'))
  ;((customProblems || {})[SD_ID] || []).forEach((it) => pushPrep(SD_ID, it, '系统设计', 'System Design', 'sysdesign'))
  ;[...OOD_EXAMPLES, ...OOD_REAL].forEach((it) => pushPrep(OOD_ID, it, 'OOD', 'OOD', 'ood'))
  ;((customProblems || {})[OOD_ID] || []).forEach((it) => pushPrep(OOD_ID, it, 'OOD', 'OOD', 'ood'))
  return items
}

export default function NotesPage({ problemNotes, customProblems, onProblemNote, onOpenInRoadmap, onExpandNote }) {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(() => new Set())
  const toggle = (k) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(k) ? next.delete(k) : next.add(k)
      return next
    })

  const noted = allItems(customProblems).filter((it) => noteFilled(problemNotes[it.key]))

  // 按来源分组(保留顺序)
  const order = []
  const groups = {}
  noted.forEach((it) => {
    if (!groups[it.groupKey]) {
      groups[it.groupKey] = { zh: it.groupZh, en: it.groupEn, list: [] }
      order.push(it.groupKey)
    }
    groups[it.groupKey].list.push(it)
  })

  return (
    <div className="notes-page">
      <div className="prep-head">
        <h1>{t('notesTitle')}</h1>
        <p className="prep-desc">{t('notesDesc', noted.length)}</p>
      </div>

      {noted.length === 0 ? (
        <p className="notes-empty">{t('notesEmpty')}</p>
      ) : (
        order.map((gk) => {
          const g = groups[gk]
          return (
            <div key={gk} className="notes-group">
              <div className="notes-group-title">
                {pick(lang, g)} <span>({g.list.length})</span>
              </div>
              <ul className="prep-list">
                {g.list.map((it) => {
                  const sum = noteSummary(problemNotes[it.key])
                  const isOpen = open.has(it.key)
                  return (
                    <li key={it.key} className={`prep-item${isOpen ? ' open' : ''}`}>
                      <div className="prep-row">
                        <div className="prep-title" onClick={() => toggle(it.key)}>
                          <span className="pt-en">{pick(lang, it)}</span>
                          <span className="pt-zh">{pick2(lang, it)}</span>
                        </div>
                        <div className="prep-badges">
                          {sum.hasText && <span title="text">📝</span>}
                          {sum.codeCount > 0 && <span title="code">💻{sum.codeCount}</span>}
                          {sum.videoCount > 0 && <span title="video">🎬{sum.videoCount}</span>}
                        </div>
                        {it.url && (
                          <a className="mini-link" href={it.url} target="_blank" rel="noreferrer">
                            LeetCode
                          </a>
                        )}
                        {it.kind === 'roadmap' && onOpenInRoadmap && (
                          <button className="mini-link" onClick={() => onOpenInRoadmap(it.nodeId)}>
                            {t('locate')}
                          </button>
                        )}
                        <button className="note-btn has open" onClick={() => toggle(it.key)}>
                          {isOpen ? t('collapse') : t('expand')}
                        </button>
                      </div>
                      {isOpen && (
                        <div className="problem-note">
                          <ProblemNoteEditor
                            value={problemNotes[it.key]}
                            onChange={(val) => onProblemNote(it.sectionId, it.idx, val)}
                            onExpand={onExpandNote ? () => onExpandNote(it.sectionId, it.idx) : undefined}
                          />
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })
      )}
    </div>
  )
}
