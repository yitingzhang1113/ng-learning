import { useLang } from '../i18n.js'

// 把各种视频链接解析成「可内嵌播放」的形式:
//   YouTube / Bilibili / Loom / Vimeo → iframe 播放器
//   .mp4/.webm/.ogg 直链           → <video> 播放器
//   其它                            → 给个「在新标签打开」的按钮
export function parseVideo(url) {
  if (!url) return null
  const u = url.trim()

  // YouTube
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (m) return { type: 'iframe', src: `https://www.youtube.com/embed/${m[1]}` }

  // Bilibili(BV 号)
  m = u.match(/bilibili\.com\/video\/(BV[\w]+)/i) || u.match(/^(BV[\w]+)$/i)
  if (m) return { type: 'iframe', src: `https://player.bilibili.com/player.html?bvid=${m[1]}&page=1&high_quality=1&danmaku=0` }

  // Loom
  m = u.match(/loom\.com\/(?:share|embed)\/([\w-]+)/)
  if (m) return { type: 'iframe', src: `https://www.loom.com/embed/${m[1]}` }

  // Vimeo
  m = u.match(/vimeo\.com\/(\d+)/)
  if (m) return { type: 'iframe', src: `https://player.vimeo.com/video/${m[1]}` }

  // 直链视频文件
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u)) return { type: 'video', src: u }

  return { type: 'link', src: u }
}

export default function VideoEmbed({ url }) {
  const { t } = useLang()
  const info = parseVideo(url)
  if (!info) return null

  if (info.type === 'iframe') {
    return (
      <div className="video-frame">
        <iframe
          src={info.src}
          title="video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          scrolling="no"
        />
      </div>
    )
  }
  if (info.type === 'video') {
    return (
      <div className="video-frame">
        <video src={info.src} controls preload="metadata" />
      </div>
    )
  }
  return (
    <a className="video-fallback" href={info.src} target="_blank" rel="noreferrer">
      {t('videoFallback')}
    </a>
  )
}
