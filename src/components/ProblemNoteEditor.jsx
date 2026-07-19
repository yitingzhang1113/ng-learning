import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import VideoEmbed from './VideoEmbed.jsx'
import { useLang } from '../i18n.js'

const LANGS = ['python', 'java', 'cpp', 'c', 'javascript', 'typescript', 'go', 'csharp', 'kotlin', 'swift', 'rust', 'sql', 'text']

const IMG_MIN_SIZE = 40 // px
const IMG_DEFAULT_MAX_W = 220 // px,新图片的默认展示宽度上限
const FALLBACK_CANVAS_W = 300 // px,画布宽度还没测出来之前的兜底值
const TEXT_MAX_H = 560 // px,文字笔记自动长高的上限,超过后内部滚动
const TEXT_MIN_H = 76 // px

// 图片位置/大小一律存成「相对画布宽度的比例」(0~1),这样窗口/侧栏宽度变化时
// 图片能跟着等比缩放、不会跑出笔记框。旧版本存的是像素值,这里按经验阈值识别并折算。
function normalizeImage(im) {
  const legacyPx = im.x > 3 || im.y > 3 || im.w > 3 || im.h > 3
  if (!legacyPx) return im
  const ref = 320
  return { ...im, x: im.x / ref, y: im.y / ref, w: im.w / ref, h: im.h / ref }
}

// 把旧的「纯文本笔记」或空值,规整成统一的对象结构
export function normalizeNote(raw) {
  if (!raw) return { text: '', codes: [], videos: [], images: [] }
  if (typeof raw === 'string') return { text: raw, codes: [], videos: [], images: [] }
  return {
    text: raw.text || '',
    codes: raw.codes || [],
    videos: raw.videos || [],
    images: (raw.images || []).map(normalizeImage),
  }
}

// 是否已有笔记(文字 / 代码 / 视频 / 图片 任一)
export function noteFilled(raw) {
  const n = normalizeNote(raw)
  return !!(n.text.trim() || n.codes.length || n.videos.length || n.images.length)
}

// 笔记内容摘要(用于列表小标签)
export function noteSummary(raw) {
  const n = normalizeNote(raw)
  return {
    hasText: !!n.text.trim(),
    codeCount: n.codes.filter((c) => c.code && c.code.trim()).length,
    videoCount: n.videos.length,
    imageCount: n.images.length,
  }
}

// 把一个图片文件读成 dataURL(过大的图按最长边 1000px 压缩,减小存储体积),
// 同时算出宽高比,方便按当前画布宽度换算成比例单位
function fileToImageEntry(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('not an image'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const maxSide = 1000
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
      const w = Math.round(img.naturalWidth * scale)
      const h = Math.round(img.naturalHeight * scale)
      const ratio = h / w || 1
      let src
      if (scale < 1 || file.size > 400 * 1024) {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        src = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85)
      }
      URL.revokeObjectURL(url)
      if (!src) {
        // 小文件直接用原图,避免不必要的重新编码
        const reader = new FileReader()
        reader.onload = () => resolve({ src: reader.result, ratio })
        reader.onerror = reject
        reader.readAsDataURL(file)
        return
      }
      resolve({ src, ratio })
    }
    img.onerror = reject
    img.src = url
  })
}

// 每题笔记编辑器:文字笔记(自动长高)+ 多个代码块(可复制)+ 多个视频(可内嵌播放)
// + 可自由拖动/缩放的图片(按画布宽度比例存储,随窗口宽度自适应)
// onExpand 传入时显示「全屏」按钮,跳到独立笔记页编辑。
export default function ProblemNoteEditor({ value, onChange, onExpand }) {
  const { t } = useLang()
  const note = normalizeNote(value)
  const [vurl, setVurl] = useState('')
  const [vtitle, setVtitle] = useState('')
  const [copied, setCopied] = useState(-1)
  const [saved, setSaved] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [canvasW, setCanvasW] = useState(0)
  const canvasRef = useRef(null)
  const textRef = useRef(null)
  const fileInputRef = useRef(null)

  // 画布随容器宽度变化(窗口缩放 / 侧栏切换)实时更新,图片按比例跟着缩放
  useEffect(() => {
    const el = canvasRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width
      if (w) setCanvasW(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 文字笔记自动长高,不用手动拖角落
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(TEXT_MAX_H, Math.max(TEXT_MIN_H, el.scrollHeight))}px`
  }, [note.text])

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

  // 图片:位置/大小都是「画布宽度的比例」,拖动/缩放时按当前画布宽度换算
  const cw = canvasW || FALLBACK_CANVAS_W

  const addImageFiles = async (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    const entries = await Promise.all(list.map((f) => fileToImageEntry(f).catch(() => null)))
    const base = note.images.length
    // 新图片默认放在已输入文字的下方,不会一上来就盖住正在写的笔记;
    // 用户仍可以随手把它拖到想要的位置,和文字自由叠放。
    const textBottom = (textRef.current?.offsetHeight || TEXT_MIN_H) + 12
    const added = entries
      .filter(Boolean)
      .map((e, i) => {
        const wPx = Math.min(IMG_DEFAULT_MAX_W, cw * 0.6)
        const w = wPx / cw
        const h = (wPx * e.ratio) / cw
        return {
          id: `${Date.now()}-${base + i}`,
          src: e.src,
          x: (16 + ((base + i) % 5) * 22) / cw,
          y: (textBottom + ((base + i) % 5) * 22) / cw,
          w,
          h,
        }
      })
    if (added.length) patch({ images: [...note.images, ...added] })
  }
  const updateImage = (id, p) =>
    patch({ images: note.images.map((im) => (im.id === id ? { ...im, ...p } : im)) })
  const removeImage = (id) => patch({ images: note.images.filter((im) => im.id !== id) })

  const onPickImages = (e) => {
    addImageFiles(e.target.files)
    e.target.value = ''
  }
  const onDropImages = (e) => {
    e.preventDefault()
    addImageFiles(e.dataTransfer.files)
  }
  const onPasteImages = (e) => {
    const items = Array.from(e.clipboardData?.items || [])
    const files = items.filter((it) => it.kind === 'file' && it.type.startsWith('image/')).map((it) => it.getAsFile())
    if (files.length) addImageFiles(files)
  }

  const dragImage = (id, e) => {
    e.preventDefault()
    const img = note.images.find((im) => im.id === id)
    if (!img) return
    const pxW = img.w * cw
    const maxX = Math.max(0, cw - pxW)
    const startX = e.clientX
    const startY = e.clientY
    const origX = img.x * cw
    const origY = img.y * cw
    const onMove = (ev) => {
      const x = Math.min(Math.max(0, origX + (ev.clientX - startX)), maxX)
      const y = Math.max(0, origY + (ev.clientY - startY))
      updateImage(id, { x: x / cw, y: y / cw })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const resizeImage = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    const img = note.images.find((im) => im.id === id)
    if (!img) return
    const maxW = Math.max(IMG_MIN_SIZE, cw - img.x * cw)
    const startX = e.clientX
    const startY = e.clientY
    const origW = img.w * cw
    const origH = img.h * cw
    const onMove = (ev) => {
      const w = Math.min(Math.max(IMG_MIN_SIZE, origW + (ev.clientX - startX)), maxW)
      const h = Math.max(IMG_MIN_SIZE, origH + (ev.clientY - startY))
      updateImage(id, { w: w / cw, h: h / cw })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const canvasMinHeight = Math.max(TEXT_MIN_H, ...note.images.map((im) => im.y * cw + im.h * cw + 16))

  return (
    <div className="pne">
      {/* 文字笔记 + 图片:同一块画布,图片可叠加、可自由拖动,并随画布宽度等比缩放 */}
      <div className="pne-head">
        <label className="pne-label">📝 {t('noteText')}</label>
        <div className="pne-head-right">
          <label className="pne-label img-label">🖼️ {t('image')}</label>
          <button className="pne-add" onClick={() => fileInputRef.current?.click()}>{t('addImage')}</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onPickImages}
          />
        </div>
      </div>
      <div
        className="pne-canvas"
        ref={canvasRef}
        style={{ minHeight: canvasMinHeight }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropImages}
      >
        <textarea
          ref={textRef}
          className="pne-text"
          value={note.text}
          onChange={(e) => patch({ text: e.target.value })}
          onPaste={onPasteImages}
          placeholder={t('phText')}
          rows={3}
        />
        <div className="pne-image-layer">
          {note.images.map((im) => (
            <div
              key={im.id}
              className="pne-image"
              style={{ left: im.x * cw, top: im.y * cw, width: im.w * cw, height: im.h * cw }}
              onPointerDown={(e) => dragImage(im.id, e)}
              title={t('dragImageHint')}
            >
              <img src={im.src} alt="" draggable={false} />
              <button
                className="img-del"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(im.id)
                }}
                title={t('del')}
              >
                ×
              </button>
              <span className="img-resize" onPointerDown={(e) => resizeImage(im.id, e)} />
            </div>
          ))}
        </div>
      </div>

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
