import { useState } from 'react'
import VideoEmbed from './VideoEmbed.jsx'
import { useLang } from '../i18n.js'

const LANGS = ['python', 'java', 'cpp', 'c', 'javascript', 'typescript', 'go', 'csharp', 'kotlin', 'swift', 'rust', 'sql', 'text']

// 把旧的「纯文本笔记」或空值,规整成统一的对象结构
export function normalizeNote(raw) {
  if (!raw) return { text: '', codes: [], videos: [] }
  if (typeof raw === 'string') return { text: raw, codes: [], videos: [] }
  return { text: raw.text || '', codes: raw.codes || [], videos: raw.videos || [] }
}

// 是否已有笔记(文字 / 代码 / 视频 任一)
export function noteFilled(raw) {
  const n = normalizeNote(raw)
  return !!(n.text.trim() || n.codes.length || n.videos.length)
}

// 笔记内容摘要(用于列表小标签)
export function noteSummary(raw) {
  const n = normalizeNote(raw)
  return {
    hasText: !!n.text.trim(),
    codeCount: n.codes.filter((c) => c.code && c.code.trim()).length,
    videoCount: n.videos.length,
  }
}

// 每题笔记编辑器:文字笔记 + 多个代码块(可复制)+ 多个视频(可内嵌播放)
// onExpand 传入时显示「全屏」按钮,跳到独立笔记页编辑。
export default function ProblemNoteEditor({ value, onChange, onExpand }) {
  const { t } = useLang()
  const note = normalizeNote(value)
  const [vurl, setVurl] = useState('')
  const [vtitle, setVtitle] = useState('')
  const [copied, setCopied] = useState(-1)
  const [saved, setSaved] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  // 内容随打随存;「保存」按钮再显式确认一次,给个安心的反馈
  const saveNow = () => {
    onChange({ ...note })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  // 删除整条笔记(两步确认)
  const deleteNote = () => {
    if (!confirmDel) {
      setConfirmDel(true)
      setTimeout(() => setConfirmDel(false), 2500)
      return
    }
    onChange(null)
    setConfirmDel(false)
  }

  const patch = (p) => onChange({ ...note, ...p })

  // 代码块
  const addCode = () => patch({ codes: [...note.codes, { lang: 'python', code: '' }] })
  const updateCode = (i, p) =>
    patch({ codes: note.codes.map((c, idx) => (idx === i ? { ...c, ...p } : c)) })
  const removeCode = (i) => patch({ codes: note.codes.filter((_, idx) => idx !== i) })
  const copyCode = async (i, code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(i)
      setTimeout(() => setCopied(-1), 1200)
    } catch {
      /* clipboard 不可用时忽略 */
    }
  }

  // 视频
  const addVideo = () => {
    if (!vurl.trim()) return
    patch({ videos: [...note.videos, { title: vtitle.trim() || '视频', url: vurl.trim() }] })
    setVurl('')
    setVtitle('')
  }
  const removeVideo = (i) => patch({ videos: note.videos.filter((_, idx) => idx !== i) })

  return (
    <div className="pne">
      {/* 文字笔记 */}
      <label className="pne-label">📝 {t('noteText')}</label>
      <textarea
        className="pne-text"
        value={note.text}
        onChange={(e) => patch({ text: e.target.value })}
        placeholder={t('phText')}
        rows={3}
      />

      {/* 代码块 */}
      <div className="pne-head">
        <label className="pne-label">💻 {t('code')}</label>
        <button className="pne-add" onClick={addCode}>{t('addCode')}</button>
      </div>
      {note.codes.map((c, i) => (
        <div className="code-block" key={i}>
          <div className="code-bar">
            <select value={c.lang} onChange={(e) => updateCode(i, { lang: e.target.value })}>
              {LANGS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <div className="code-bar-right">
              <button className="mini" onClick={() => copyCode(i, c.code)}>
                {copied === i ? t('copied') : t('copy')}
              </button>
              <button className="mini danger" onClick={() => removeCode(i)}>{t('del')}</button>
            </div>
          </div>
          <textarea
            className="code-area"
            value={c.code}
            onChange={(e) => updateCode(i, { code: e.target.value })}
            placeholder={t('phCode')}
            spellCheck={false}
            rows={Math.min(18, Math.max(4, (c.code.match(/\n/g)?.length || 0) + 2))}
            onKeyDown={(e) => {
              // 支持 Tab 缩进
              if (e.key === 'Tab') {
                e.preventDefault()
                const t = e.target
                const s = t.selectionStart
                const val = c.code.slice(0, s) + '    ' + c.code.slice(t.selectionEnd)
                updateCode(i, { code: val })
                requestAnimationFrame(() => (t.selectionStart = t.selectionEnd = s + 4))
              }
            }}
          />
        </div>
      ))}

      {/* 视频 */}
      <label className="pne-label">🎬 {t('video')}</label>
      {note.videos.map((v, i) => (
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

      {/* 底部操作栏:全屏 / 保存 / 删除 */}
      <div className="pne-footer">
        {onExpand && (
          <button className="pne-expand" onClick={onExpand} title={t('openFull')}>
            {t('openFull')}
          </button>
        )}
        <span className="pne-spacer" />
        <button className={`pne-save${saved ? ' ok' : ''}`} onClick={saveNow}>
          {saved ? t('saved') : t('save')}
        </button>
        <button className={`pne-del${confirmDel ? ' confirming' : ''}`} onClick={deleteNote}>
          {confirmDel ? t('confirmDel') : t('delNote')}
        </button>
      </div>
    </div>
  )
}
