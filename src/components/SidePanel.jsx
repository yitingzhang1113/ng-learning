import { useState, useRef, useEffect, useCallback } from 'react'
import { DIFF } from '../data/roadmap.js'
import { useLang, pick, pick2 } from '../i18n.js'
import ProblemNoteEditor, { noteFilled } from './ProblemNoteEditor.jsx'

// 三态图标:未开始 ○ / 尝试中 ◐(黄)/ 已解决 ✓(绿)
const STATUS_ICON = { undefined: '○', attempting: '◐', solved: '✓' }
const STATUS_CLS = { undefined: 'st-none', attempting: 'st-try', solved: 'st-done' }

// 面板形态偏好(停靠宽度 / 停靠 or 居中)存本地
const MODE_KEY = 'algo-roadmap-panel-mode'
const WIDTH_KEY = 'algo-roadmap-panel-width'

// 代码模板块:标题栏(点击展开/收起)+ 一键复制 + 深色代码区
function TemplateBlock({ tp }) {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(tp.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="tpl-item">
      <div className="tpl-head" onClick={() => setOpen((o) => !o)}>
        <span className="tpl-caret">{open ? '▾' : '▸'}</span>
        <span className="tpl-title">{pick(lang, tp)}</span>
        <button className="mini" onClick={copy}>
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
      {open && <pre className="tpl-code">{tp.code}</pre>}
    </div>
  )
}

// 点击节点后从右侧滑出:该板块题目(三态打卡 + 中英文 + 美区外链 + 每题笔记)+ 板块笔记。
export default function SidePanel({
  node,
  status,
  notes,
  problemNotes,
  customProblems,
  onCycle,
  onNote,
  onProblemNote,
  onAddProblem,
  onRemoveProblem,
  onExpandNote,
  onClose,
}) {
  const { lang, t } = useLang()
  const [openNotes, setOpenNotes] = useState(() => new Set())

  // 「添加题目」表单状态
  const [pEn, setPEn] = useState('')
  const [pZh, setPZh] = useState('')
  const [pDiff, setPDiff] = useState('Medium')
  const [pUrl, setPUrl] = useState('')
  const [deletingKey, setDeletingKey] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  useEffect(() => {
    setPEn(''); setPZh(''); setPUrl(''); setPDiff('Medium'); setDeletingKey(null); setShowAdd(false)
  }, [node?.id])

  // 形态:dock 停靠右侧(左缘可拖宽) / center 居中大窗(右下角可缩放)
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(MODE_KEY) === 'center' ? 'center' : 'dock'
    } catch {
      return 'dock'
    }
  })
  const [width, setWidth] = useState(() => {
    try {
      return parseInt(localStorage.getItem(WIDTH_KEY), 10) || 340
    } catch {
      return 340
    }
  })
  const dragging = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const w = Math.min(Math.max(window.innerWidth - e.clientX, 300), Math.round(window.innerWidth * 0.85))
      setWidth(w)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      document.body.style.cursor = ''
      setWidth((w) => {
        try {
          localStorage.setItem(WIDTH_KEY, String(w))
        } catch {
          /* ignore */
        }
        return w
      })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const startDrag = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    document.body.style.cursor = 'ew-resize'
  }, [])

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next = m === 'dock' ? 'center' : 'dock'
      try {
        localStorage.setItem(MODE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  if (!node) return null
  const problems = node.problems || []
  const customs = (customProblems && customProblems[node.id]) || []
  // 内置题(按序号)+ 自定义题(按 id)合并展示
  const merged = [
    ...problems.map((pr, i) => ({ pr, idx: i, custom: false })),
    ...customs.map((pr) => ({ pr, idx: pr.id, custom: true })),
  ]
  const solved = merged.filter(({ idx }) => status[`${node.id}#${idx}`] === 'solved').length

  const submitProblem = () => {
    const en = pEn.trim()
    const zh = pZh.trim()
    if (!en && !zh) return
    let url = pUrl.trim()
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://leetcode.com/problems/${url.replace(/^\/+|\/+$/g, '')}/`
    }
    onAddProblem?.(node.id, { en: en || zh, zh: zh || en, diff: pDiff, url: url || undefined })
    setPEn(''); setPZh(''); setPUrl('')
    setShowAdd(false)
  }

  const handleDelete = (item) => {
    const key = `${node.id}#${item.idx}`
    if (deletingKey !== key) {
      setDeletingKey(key)
      setTimeout(() => setDeletingKey((k) => (k === key ? null : k)), 2500)
      return
    }
    onRemoveProblem?.(node.id, item.idx)
    setDeletingKey(null)
  }

  const toggleNote = (key) =>
    setOpenNotes((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <>
      {mode === 'center' && <div className="panel-backdrop" onClick={onClose} />}
      <aside className={`side-panel ${mode}`} style={mode === 'dock' ? { width } : undefined}>
        {mode === 'dock' && <div className="panel-resizer" onMouseDown={startDrag} title="⇔" />}
        <div className="side-head">
          <div>
            <h2>{pick(lang, node)}</h2>
            <div className="side-en">{pick2(lang, node)}</div>
            {problems.length > 0 && (
              <div className="side-progress">{t('solved', solved, problems.length)}</div>
            )}
          </div>
          <div className="side-head-actions">
            {onAddProblem && node.kind !== 'group' && (
              <button
                className={`side-mode add-toggle${showAdd ? ' on' : ''}`}
                onClick={() => setShowAdd((s) => !s)}
                title={t('addProblem')}
              >
                ＋
              </button>
            )}
            <button
              className="side-mode"
              onClick={toggleMode}
              title={mode === 'dock' ? t('centerView') : t('dockView')}
            >
              {mode === 'dock' ? '⧉' : '⇥'}
            </button>
            <button className="side-close" onClick={onClose} aria-label="close">
              ✕
            </button>
          </div>

          {/* 添加题目弹出卡片 */}
          {showAdd && (
            <div className="add-pop">
              <div className="add-problem">
                <div className="tut-label">➕ {t('addProblem')}</div>
                <input
                  value={pEn}
                  onChange={(e) => setPEn(e.target.value)}
                  placeholder={t('phTitleEn')}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && submitProblem()}
                />
                <input
                  value={pZh}
                  onChange={(e) => setPZh(e.target.value)}
                  placeholder={t('phTitleZh')}
                  onKeyDown={(e) => e.key === 'Enter' && submitProblem()}
                />
                <div className="add-problem-row">
                  <select value={pDiff} onChange={(e) => setPDiff(e.target.value)}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <input
                    className="url-input"
                    value={pUrl}
                    onChange={(e) => setPUrl(e.target.value)}
                    placeholder={t('phSlug')}
                    onKeyDown={(e) => e.key === 'Enter' && submitProblem()}
                  />
                  <button className="pne-add" onClick={submitProblem}>{t('add')}</button>
                </div>
              </div>
            </div>
          )}
        </div>

      <div className="side-scroll">
        {/* 基础教程链接(节点带 tutorials 字段时显示) */}
        {node.tutorials?.length > 0 && (
          <div className="tut-box">
            <div className="tut-label">📖 {t('tutorials')}</div>
            <ul className="tut-list">
              {node.tutorials.map((tu, i) => (
                <li key={i}>
                  <a href={tu.url} target="_blank" rel="noreferrer">
                    <span className="pt-en">{pick(lang, tu)}</span>
                    <span className="pt-zh">{pick2(lang, tu)}</span>
                  </a>
                  <span className="tut-arrow">↗</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 代码模板(节点带 templates 字段时显示) */}
        {node.templates?.length > 0 && (
          <div className="tpl-box">
            <div className="tut-label">💻 {t('codeTemplates')}</div>
            {node.templates.map((tp, i) => (
              <TemplateBlock key={i} tp={tp} />
            ))}
          </div>
        )}

        {merged.length === 0 && !node.tutorials?.length && !node.templates?.length && (
          <p className="side-empty">{t('emptyNode')}</p>
        )}
        {merged.length > 0 && (
          <ul className="problem-list">
            {merged.map((item) => {
              const { pr, idx, custom } = item
              const key = `${node.id}#${idx}`
              const st = status[key]
              const cls = STATUS_CLS[st] || 'st-none'
              const diff = DIFF[pr.diff] || {}
              const hasNote = noteFilled(problemNotes[key])
              const open = openNotes.has(key)
              const title = (
                <>
                  <span className="pt-en">
                    {pick(lang, pr)}
                    {custom && <span className="custom-tag">{t('customTag')}</span>}
                  </span>
                  <span className="pt-zh">{pick2(lang, pr)}</span>
                </>
              )
              return (
                <li key={key} className={`${cls}${open ? ' open' : ''}`}>
                  <div className="problem-row">
                    <button
                      className={`status-btn ${cls}`}
                      onClick={() => onCycle(node.id, idx)}
                      title={t(st === 'solved' ? 'stSolved' : st === 'attempting' ? 'stTry' : 'stNone')}
                    >
                      {STATUS_ICON[st] || '○'}
                    </button>
                    {pr.url ? (
                      <a href={pr.url} target="_blank" rel="noreferrer" className="problem-title">
                        {title}
                      </a>
                    ) : (
                      <span className="problem-title">{title}</span>
                    )}
                    <span className="diff" style={{ color: diff.color || '#57606a' }} title={diff.zh}>
                      {pr.diff}
                    </span>
                    <button
                      className={`note-btn${hasNote ? ' has' : ''}${open ? ' open' : ''}`}
                      onClick={() => toggleNote(key)}
                      title="notes"
                    >
                      📝
                    </button>
                    {custom && (
                      <button
                        className={`del-problem${deletingKey === key ? ' confirming' : ''}`}
                        onClick={() => handleDelete(item)}
                        title={t('delNote')}
                      >
                        {deletingKey === key ? t('confirmDel') : '✕'}
                      </button>
                    )}
                  </div>
                  {open && (
                    <div className="problem-note">
                      <ProblemNoteEditor
                        value={problemNotes[key]}
                        onChange={(val) => onProblemNote(node.id, idx, val)}
                        onExpand={onExpandNote ? () => onExpandNote(node.id, idx) : undefined}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}


      </div>

      <p className="side-hint">{t('sideHint')}</p>
      </aside>
    </>
  )
}
