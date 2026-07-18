import { useLang } from '../i18n.js'
import VideoEmbed from './VideoEmbed.jsx'

// OOD 模块介绍卡:OOP 四大概念 + 答题六步 + OOD vs 系统设计 + 核心要点 + 参考视频
export default function OodIntro({ data }) {
  const { t } = useLang()
  return (
    <div className="prep-intro ood-intro">
      <div className="tut-label">📌 {t('introLabel')}</div>

      {/* OOP 四大概念 */}
      <div className="oi-sec-title">一、OOP 四大概念</div>
      <div className="oi-concepts">
        {data.concepts.map((c) => (
          <div className="oi-concept" key={c.name}>
            <div className="oi-concept-name">{c.name}</div>
            <div className="oi-concept-text">{c.text}</div>
          </div>
        ))}
      </div>

      {/* 答题六步 */}
      <div className="oi-sec-title">二、OOD 答题六步</div>
      <ol className="oi-steps">
        {data.steps.map((s, i) =>
          s.divider ? (
            <li key={i} className="oi-divider">{s.divider}</li>
          ) : (
            <li key={i}>
              <b>{s.n}. {s.en}</b>
              <span>{s.zh}</span>
            </li>
          ),
        )}
      </ol>

      {/* OOD vs 系统设计 */}
      <div className="oi-sec-title">三、OOD vs 系统设计</div>
      <table className="oi-table">
        <thead>
          <tr>
            {data.compare.cols.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.compare.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 核心要点 */}
      <div className="oi-sec-title">四、核心要点</div>
      <ul className="oi-keys">
        {data.keys.map((k, i) => (
          <li key={i}>{k}</li>
        ))}
      </ul>

      {/* Python 类语法要点 */}
      {data.pySyntax && (
        <>
          <div className="oi-sec-title">
            五、Python 类语法要点
            {data.pyDocUrl && (
              <a className="oi-src" href={data.pyDocUrl} target="_blank" rel="noreferrer">
                官方教程 ↗
              </a>
            )}
          </div>
          <div className="oi-concepts">
            {data.pySyntax.map((c) => (
              <div className="oi-concept" key={c.name}>
                <div className="oi-concept-name">{c.name}</div>
                <div className="oi-concept-text">{c.text}</div>
              </div>
            ))}
          </div>
          {data.pyCode && <pre className="tpl-code oi-pre">{data.pyCode}</pre>}
        </>
      )}

      {/* 高频设计模式 */}
      {data.patterns && (
        <>
          <div className="oi-sec-title">
            六、高频设计模式
            {data.patternsUrl && (
              <a className="oi-src" href={data.patternsUrl} target="_blank" rel="noreferrer">
                Refactoring Guru 全目录 ↗
              </a>
            )}
          </div>
          <div className="oi-concepts">
            {data.patterns.map((p) => (
              <div className="oi-concept" key={p.name}>
                <div className="oi-concept-name">
                  <a href={p.url} target="_blank" rel="noreferrer">{p.name} ↗</a>
                </div>
                <div className="oi-concept-text">{p.text}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 参考视频 */}
      {data.video && (
        <>
          <div className="oi-sec-title">🎬 {data.videoTitle || '参考视频'}</div>
          <div className="oi-video">
            <VideoEmbed url={data.video} />
          </div>
        </>
      )}
    </div>
  )
}
