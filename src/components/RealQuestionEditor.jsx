import { useState } from 'react'
import { useLang, pick } from '../i18n.js'
import { normalizeNote } from './ProblemNoteEditor.jsx'
import VideoEmbed from './VideoEmbed.jsx'

const LANGS = ['python', 'java', 'cpp', 'javascript', 'go', 'text']

// 单个 part(原题 / follow-up):描述 + 思路 + 代码,内容自动保存
function PartEditor({ sectionId, itemId, part, problemNotes, onProblemNote }) {
  const { lang, t } = useLang()
  const [copied, setCopied] = useState(false)
  const idx = `${itemId}:${part.id}`
  const note = normalizeNote(problemNotes[`${sectionId}#${idx}`])
  const code = note.codes[0] || { lang: 'python', code: '' }
  const patch = (p) => onProblemNote(sectionId, idx, { text: note.text, codes: note.codes, videos: [], ...p })
  const setCode = (c) => patch({ codes: [{ ...code, ...c }] })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rq-part">
      <div className="rq-part-label">{pick(lang, part.label || { zh: '原题', en: 'Question' })}</div>
      {part.desc && <p className="prep-desc-text rq-desc">{part.desc}</p>}

      <div className="rq-block">
        <label className="pne-label">💡 {t('rqIdea')}</label>
        <textarea
          className="pne-text"
          value={note.text}
          onChange={(e) => patch({ text: e.target.value })}
          placeholder={t('phText')}
          rows={3}
        />
      </div>

      <div className="rq-block">
        <label className="pne-label">💻 {t('rqCode')}</label>
        <div className="code-block">
          <div className="code-bar">
            <select value={code.lang} onChange={(e) => setCode({ lang: e.target.value })}>
              {LANGS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <div className="code-bar-right">
              <button className="mini" onClick={copy}>{copied ? t('copied') : t('copy')}</button>
            </div>
          </div>
          <textarea
            className="code-area"
            value={code.code}
            onChange={(e) => setCode({ code: e.target.value })}
            placeholder={t('phCode')}
            spellCheck={false}
            rows={Math.min(24, Math.max(6, (code.code.match(/\n/g)?.length || 0) + 2))}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                const el = e.target
                const s = el.selectionStart
                const val = code.code.slice(0, s) + '    ' + code.code.slice(el.selectionEnd)
                setCode({ code: val })
                requestAnimationFrame(() => (el.selectionStart = el.selectionEnd = s + 4))
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

// 大厂真题的结构化编辑器:原题(思路+代码)→ Follow-up(思路+代码)→ 视频链接
export default function RealQuestionEditor({ sectionId, item, problemNotes, onProblemNote }) {
  const { t } = useLang()
  const [vurl, setVurl] = useState('')
  const [vtitle, setVtitle] = useState('')
  // 自定义真题只有 desc,自动当作单个 part
  const parts = item.parts || [{ id: 'main', label: { zh: '原题', en: 'Question' }, desc: item.desc }]
  // 视频挂在题目级别(key 就是题目 id)
  const qNote = normalizeNote(problemNotes[`${sectionId}#${item.id}`])
  const saveQ = (p) => onProblemNote(sectionId, item.id, { ...qNote, ...p })

  const addVideo = () => {
    const url = vurl.trim()
    if (!url) return
    saveQ({ videos: [...qNote.videos, { title: vtitle.trim() || 'Video', url }] })
    setVurl('')
    setVtitle('')
  }
  const removeVideo = (i) => saveQ({ videos: qNote.videos.filter((_, x) => x !== i) })

  return (
    <div className="rq">
      {parts.map((part) => (
        <PartEditor
          key={part.id}
          sectionId={sectionId}
          itemId={item.id}
          part={part}
          problemNotes={problemNotes}
          onProblemNote={onProblemNote}
        />
      ))}

      {/* 视频链接 */}
      <div className="rq-part rq-videos">
        <div className="rq-part-label">🎬 {t('rqVideos')}</div>
        {/* 题目自带的讲解视频(数据里预置) */}
        {item.video && (
          <div className="video-item">
            <div className="video-item-head">
              <span className="video-title">{item.videoTitle || '讲解视频'}</span>
            </div>
            <VideoEmbed url={item.video} />
          </div>
        )}
        {qNote.videos.map((v, i) => (
          <div className="video-item" key={i}>
            <div className="video-item-head">
              <span className="video-title">{v.title}</span>
              <button className="mini danger" onClick={() => removeVideo(i)}>{t('del')}</button>
            </div>
            <VideoEmbed url={v.url} />
          </div>
        ))}
        <div className="video-add">
          <input
            className="v-url"
            value={vurl}
            onChange={(e) => setVurl(e.target.value)}
            placeholder={t('phVideoUrl')}
            onKeyDown={(e) => e.key === 'Enter' && addVideo()}
          />
          <input
            className="v-title"
            value={vtitle}
            onChange={(e) => setVtitle(e.target.value)}
            placeholder={t('phVideoTitle')}
            onKeyDown={(e) => e.key === 'Enter' && addVideo()}
          />
          <button className="pne-add" onClick={addVideo}>{t('add')}</button>
        </div>
      </div>
    </div>
  )
}
