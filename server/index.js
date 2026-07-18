import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 8787
const API_TOKEN = process.env.API_TOKEN || ''
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

// 单用户 key-value 存储:status / notes / problemNotes / lang,对应前端 useStore.js 的四份数据
const ALLOWED_KEYS = new Set(['status', 'notes', 'problemNotes', 'lang'])
const DEFAULTS = { status: {}, notes: {}, problemNotes: {}, lang: 'zh' }

const db = new Database(path.join(__dirname, 'data.sqlite'))
db.exec(`
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`)

const app = express()
app.use(express.json({ limit: '5mb' }))
app.use(cors({ origin: ALLOWED_ORIGIN }))

// 没配 API_TOKEN 时视为本地开发,不校验
app.use((req, res, next) => {
  if (!API_TOKEN) return next()
  const auth = req.get('authorization') || ''
  if (auth === `Bearer ${API_TOKEN}`) return next()
  res.status(401).json({ error: 'unauthorized' })
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.get('/api/state', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM kv').all()
  const state = { ...DEFAULTS }
  for (const row of rows) {
    if (ALLOWED_KEYS.has(row.key)) {
      try {
        state[row.key] = JSON.parse(row.value)
      } catch {
        /* 忽略损坏的记录,保留默认值 */
      }
    }
  }
  res.json(state)
})

app.put('/api/state/:key', (req, res) => {
  const { key } = req.params
  if (!ALLOWED_KEYS.has(key)) return res.status(400).json({ error: 'unknown key' })
  const value = JSON.stringify(req.body.value ?? DEFAULTS[key])
  db.prepare(
    'INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  ).run(key, value)
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`algo-roadmap-server listening on http://localhost:${PORT}`)
  if (!API_TOKEN) console.log('警告:未设置 API_TOKEN,当前不校验请求来源(仅建议本地开发使用)')
})
