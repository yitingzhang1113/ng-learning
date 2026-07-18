import { useState } from 'react'
import { useLang } from '../i18n.js'

// 仿 LeetCode 的打卡面板:圆环(已解决/总数)+ 尝试中 + Easy/Med/Hard 分档。
// 可折叠;重置为两步确认,避免误触清空。
const R = 54
const STROKE = 10
const CIRC = 2 * Math.PI * R

export default function ProgressPanel({ stats, onReset }) {
  const { t } = useLang()
  const [open, setOpen] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const { solved, attempting, total, buckets } = stats
  const frac = total ? solved / total : 0

  return (
    <div className={`progress-panel${open ? '' : ' collapsed'}`}>
      <div className="pp-head">
        <span className="pp-title">Progress</span>
        <div className="pp-actions">
          {confirming ? (
            <button
              className="pp-reset confirming"
              onClick={() => {
                onReset()
                setConfirming(false)
              }}
              title={t('resetConfirm')}
            >
              {t('resetConfirm')}
            </button>
          ) : (
            <button
              className="pp-reset"
              onClick={() => setConfirming(true)}
              title="重置全部进度"
            >
              ↺
            </button>
          )}
          <button className="pp-toggle" onClick={() => setOpen((o) => !o)} title="折叠/展开">
            {open ? '–' : '+'}
          </button>
        </div>
      </div>

      {open && (
        <div className="pp-body">
          <div className="pp-ring-wrap">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={R} fill="none" stroke="#eceef0" strokeWidth={STROKE} />
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="#22a447"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - frac)}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset .4s ease' }}
              />
              <text x="70" y="66" textAnchor="middle" className="pp-ring-num">
                {solved}
                <tspan className="pp-ring-den">/{total}</tspan>
              </text>
              <text x="70" y="88" textAnchor="middle" className="pp-ring-label">
                ✓ Solved
              </text>
            </svg>
            <div className="pp-attempting">
              <b>{attempting}</b> Attempting
            </div>
          </div>

          <div className="pp-tiles">
            {buckets.map((b) => (
              <div key={b.key} className="pp-tile">
                <div className="pp-tile-label" style={{ color: b.color }}>
                  {b.key}
                </div>
                <div className="pp-tile-num">
                  {b.s}/{b.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
