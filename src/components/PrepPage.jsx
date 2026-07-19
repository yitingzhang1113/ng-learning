import { useState } from 'react'
import { useLang, pick, pick2 } from '../i18n.js'
import ProblemNoteEditor, { noteFilled, noteSummary } from './ProblemNoteEditor.jsx'
import RealQuestionEditor from './RealQuestionEditor.jsx'
import OodIntro from './OodIntro.jsx'
import VideoEmbed from './VideoEmbed.jsx'

const STATUS_ICON = { undefined: '○', attempting: '◐', solved: '✓' }
const STATUS_CLS = { undefined: 'st-none', attempting: 'st-try', solved: 'st-done' }

// 系统设计 / OOD 页面:
//   模块介绍(intro)→ 学习资料(materials,视频可播)→ 分区题目列表(sections)
//   sections: [{ id, label, items, canAdd, mergeCustom }]
export default function PrepPage({
  title, subtitle, intro, introContent, desc,
  sections, sectionId,
  status, problemNotes, customProblems, materials,
  onCycle, onProblemNote, onExpandNote,
  onAddItem, onRemoveItem,
  onAddMaterial, onRemoveMaterial,
}) {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(() => new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [rZh, setRZh] = useState('')
  const [rEn, setREn] = useState('')
  const [rDesc, setRDesc] = useState('')
  const [vUrl, setVUrl] = useState('')
  const [vTitle, setVTitle] = useState('')
  const [deleting, setDeleting] = useState(null)

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const customs = (customProblems && customProblems[sectionId]) || []
  const mats = (materials && materials[sectionId]) || []
  const everyItem = sections.flatMap((s) => s.items).concat(customs)
  const done = everyItem.filter((it) => status[`${sectionId}#${it.id}`] === 'solved').length

  const submitReal = () => {
    const zh = rZh.trim()
    const en = rEn.trim()
    if (!zh && !en) return
    onAddItem?.(sectionId, { zh: zh || en, en: en || zh, desc: rDesc.trim() || undefined })
    setRZh(''); setREn(''); setRDesc(''); setShowAdd(false)
  }

  const submitMaterial = () => {
    const url = vUrl.trim()
    if (!url) return
    onAddMaterial?.(sectionId, { title: vTitle.trim() || 'Video', url })
    setVUrl(''); setVTitle('')
  }

  // 两步确认删除
  const twoStep = (key, fn) => {
    if (deleting !== key) {
      setDeleting(key)
      setTimeout(() => setDeleting((k) => (k === key ? null : k)), 2500)
      return
    }
    fn()
    setDeleting(null)
  }

  const renderItem = (it, custom, structured) => {
    const key = `${sectionId}#${it.id}`
    const st = status[key]
    const cls = STATUS_CLS[st] || 'st-none'
    const filled = noteFilled(problemNotes[key])
    const sum = noteSummary(problemNotes[key])
    const isOpen = open.has(it.id)
    return (
      <li key={it.id} className={`prep-item ${cls}${isOpen ? ' open' : ''}`}>
        <div className="prep-row">
          <button
            className={`status-btn ${cls}`}
            onClick={() => onCycle(sectionId, it.id)}
            title={t(st === 'solved' ? 'prepSolved' : st === 'attempting' ? 'prepTry' : 'stNone')}
          >
            {STATUS_ICON[st] || '○'}
          </button>
          <div className="prep-title" onClick={() => toggle(it.id)}>
            <span className="pt-en">
              {pick(lang, it)}
              {custom && <span className="custom-tag">{t('customTag')}</span>}
            </span>
            <span className="pt-zh">{pick2(lang, it)}</span>
          </div>
          <div className="prep-badges">
            {sum.hasText && <span title="text">📝</span>}
            {sum.codeCount > 0 && <span title="code">💻{sum.codeCount}</span>}
            {sum.videoCount > 0 && <span title="video">🎬{sum.videoCount}</span>}
            {sum.imageCount > 0 && <span title="image">🖼️{sum.imageCount}</span>}
          </div>
          {custom && (
            <button
              className={`del-problem${deleting === key ? ' confirming' : ''}`}
              onClick={() => twoStep(key, () => onRemoveItem?.(sectionId, it.id))}
              title={t('delNote')}
            >
              {deleting === key ? t('confirmDel') : '✕'}
            </button>
          )}
          <button
            className={`note-btn${filled ? ' has' : ''}${isOpen ? ' open' : ''}`}
            onClick={() => toggle(it.id)}
            title="notes"
          >
            {isOpen ? t('collapse') : t('expand')}
          </button>
        </div>
        {isOpen && structured && (
          <RealQuestionEditor
            sectionId={sectionId}
            item={it}
            problemNotes={problemNotes}
            onProblemNote={onProblemNote}
          />
        )}
        {isOpen && !structured && (
          <>
            {it.desc && <p className="prep-desc-text">{it.desc}</p>}
            {it.video && (
              <div className="prep-video">
                <VideoEmbed url={it.video} />
              </div>
            )}
            <div className="problem-note">
              <ProblemNoteEditor
                value={problemNotes[key]}
                onChange={(val) => onProblemNote(sectionId, it.id, val)}
                onExpand={onExpandNote ? () => onExpandNote(sectionId, it.id) : undefined}
              />
            </div>
          </>
        )}
      </li>
    )
  }

  return (
    <div className="prep-page">
      <div className="prep-head">
        <h1>{title}</h1>
        <div className="prep-sub">{subtitle}</div>
        {desc && <p className="prep-desc">{desc}</p>}
        <div className="prep-count">{t('mastered', done, everyItem.length)}</div>
      </div>

      {/* ① 模块介绍(introContent 为结构化概念卡,intro 为纯文本) */}
      {introContent ? (
        <OodIntro data={introContent} />
      ) : (
        intro && (
          <div className="prep-intro">
            <div className="tut-label">📌 {t('introLabel')}</div>
            <p>{intro}</p>
          </div>
        )
      )}

      {/* ② 学习资料(视频) */}
      {onAddMaterial && (
        <div className="materials-box">
          <div className="tut-label">🎬 {t('materialsLabel')}</div>
          {mats.length === 0 && <p className="mat-empty">{t('materialsEmpty')}</p>}
          {mats.map((m) => (
            <div className="video-item" key={m.id}>
              <div className="video-item-head">
                <span className="video-title">{m.title}</span>
                <button
                  className={`mini danger${deleting === m.id ? ' confirming' : ''}`}
                  onClick={() => twoStep(m.id, () => onRemoveMaterial?.(sectionId, m.id))}
                >
                  {deleting === m.id ? t('confirmDel') : t('del')}
                </button>
              </div>
              <VideoEmbed url={m.url} />
            </div>
          ))}
          <div className="video-add">
            <input
              className="v-url"
              value={vUrl}
              onChange={(e) => setVUrl(e.target.value)}
              placeholder={t('phVideoUrl')}
              onKeyDown={(e) => e.key === 'Enter' && submitMaterial()}
            />
            <input
              className="v-title"
              value={vTitle}
              onChange={(e) => setVTitle(e.target.value)}
              placeholder={t('phVideoTitle')}
              onKeyDown={(e) => e.key === 'Enter' && submitMaterial()}
            />
            <button className="pne-add" onClick={submitMaterial}>{t('add')}</button>
          </div>
        </div>
      )}

      {/* ③④ 分区题目 */}
      {sections.map((sec) => (
        <div key={sec.id} className="prep-sec">
          {sec.label && <h2 className="prep-sec-label">{sec.label}</h2>}
          <ul className="prep-list">
            {sec.items.map((it) => renderItem(it, false, sec.structured))}
            {sec.mergeCustom && customs.map((it) => renderItem(it, true, sec.structured))}
          </ul>
          {sec.canAdd && onAddItem && (
            <div className="add-real">
              {!showAdd ? (
                <button className="pne-add wide" onClick={() => setShowAdd(true)}>
                  {t('addReal')}
                </button>
              ) : (
                <div className="add-problem">
                  <div className="tut-label">➕ {t('addReal')}</div>
                  <input
                    value={rZh}
                    onChange={(e) => setRZh(e.target.value)}
                    placeholder={t('phRealTitle')}
                    autoFocus
                  />
                  <input
                    value={rEn}
                    onChange={(e) => setREn(e.target.value)}
                    placeholder={t('phRealTitleEn')}
                  />
                  <textarea
                    value={rDesc}
                    onChange={(e) => setRDesc(e.target.value)}
                    placeholder={t('phRealDesc')}
                    rows={4}
                  />
                  <div className="add-problem-row">
                    <button className="mini danger" onClick={() => setShowAdd(false)}>{t('collapse')}</button>
                    <span style={{ flex: 1 }} />
                    <button className="pne-add" onClick={submitReal}>{t('add')}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
