import { useCallback, useEffect, useRef, useState } from 'react'

// 数据主存后端(server/,SQLite),localStorage 只作为离线缓存/快速首屏:
//   status:        每题状态     key「板块id#题序」-> 'attempting' | 'solved'
//   notes:         每板块笔记   key「板块id」      -> 文本
//   problemNotes:  每题笔记     key「板块id#题序」 -> 文本
//   customProblems:用户自建真题 key「sectionId」   -> [{id,zh,en,desc}]
//   materials:     学习资料视频 key「sectionId」   -> [{id,title,url}]
// 后端不可用时(没启动 / 网络断开)会继续用本地缓存,并把 syncStatus 置为 'error'。
const STATUS_KEY = 'algo-roadmap-status'
const NOTES_KEY = 'algo-roadmap-notes'
const PNOTES_KEY = 'algo-roadmap-problem-notes'
const CUSTOM_KEY = 'algo-roadmap-custom-problems'
const MATERIALS_KEY = 'algo-roadmap-materials'
const LANG_KEY = 'algo-roadmap-lang'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'
const API_TOKEN = import.meta.env.VITE_API_TOKEN || ''
const SYNC_DEBOUNCE_MS = 600

// 点击循环顺序:未开始 → 尝试中 → 已解决 → 未开始
export const STATUS_CYCLE = [undefined, 'attempting', 'solved']

function loadJSON(k) {
  try {
    return JSON.parse(localStorage.getItem(k)) || {}
  } catch {
    return {}
  }
}
function save(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* 无痕模式等写入失败,忽略 */
  }
}

function authHeaders() {
  const h = { 'Content-Type': 'application/json' }
  if (API_TOKEN) h.Authorization = `Bearer ${API_TOKEN}`
  return h
}

async function fetchRemoteState() {
  const res = await fetch(`${API_BASE}/api/state`, { headers: authHeaders() })
  if (!res.ok) throw new Error(`GET /api/state -> ${res.status}`)
  return res.json()
}

async function pushRemoteState(key, value) {
  const res = await fetch(`${API_BASE}/api/state/${key}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ value }),
  })
  if (!res.ok) throw new Error(`PUT /api/state/${key} -> ${res.status}`)
}

export function useStore() {
  const [status, setStatus] = useState(() => loadJSON(STATUS_KEY))
  const [notes, setNotes] = useState(() => loadJSON(NOTES_KEY))
  const [problemNotes, setProblemNotes] = useState(() => loadJSON(PNOTES_KEY))
  // 用户自己添加的题目:{ 板块id: [ { id, en, zh, diff, url } ] }
  const [customProblems, setCustomProblems] = useState(() => loadJSON(CUSTOM_KEY))
  // 学习资料(视频链接):{ 板块id: [ { id, title, url } ] }
  const [materials, setMaterials] = useState(() => loadJSON(MATERIALS_KEY))
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'zh'
    } catch {
      return 'zh'
    }
  })
  // 'syncing' | 'synced' | 'error':用于在 UI 上给个小提示,后端存不存在都不影响本地使用
  const [syncStatus, setSyncStatus] = useState('syncing')
  const timers = useRef({})

  // 首次加载:尝试从后端拉取最新数据覆盖本地缓存(后端是权威数据源)
  useEffect(() => {
    let cancelled = false
    fetchRemoteState()
      .then((remote) => {
        if (cancelled) return
        setStatus(remote.status || {})
        setNotes(remote.notes || {})
        setProblemNotes(remote.problemNotes || {})
        setCustomProblems(remote.customProblems || {})
        setMaterials(remote.materials || {})
        setLangState(remote.lang === 'en' ? 'en' : 'zh')
        save(STATUS_KEY, remote.status || {})
        save(NOTES_KEY, remote.notes || {})
        save(PNOTES_KEY, remote.problemNotes || {})
        save(CUSTOM_KEY, remote.customProblems || {})
        save(MATERIALS_KEY, remote.materials || {})
        save(LANG_KEY, remote.lang === 'en' ? 'en' : 'zh')
        setSyncStatus('synced')
      })
      .catch(() => {
        if (!cancelled) setSyncStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 防抖同步到后端,同一个 key 短时间内多次改动只发最后一次
  const scheduleSync = useCallback((key, value) => {
    clearTimeout(timers.current[key])
    timers.current[key] = setTimeout(() => {
      setSyncStatus('syncing')
      pushRemoteState(key, value)
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('error'))
    }, SYNC_DEBOUNCE_MS)
  }, [])

  const setLang = useCallback(
    (l) => {
      setLangState(l)
      save(LANG_KEY, l)
      scheduleSync('lang', l)
    },
    [scheduleSync],
  )

  const cycleStatus = useCallback(
    (sectionId, index) => {
      setStatus((prev) => {
        const key = `${sectionId}#${index}`
        const idx = STATUS_CYCLE.indexOf(prev[key])
        const nextVal = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
        const next = { ...prev }
        if (nextVal) next[key] = nextVal
        else delete next[key]
        save(STATUS_KEY, next)
        scheduleSync('status', next)
        return next
      })
    },
    [scheduleSync],
  )

  // 板块笔记:兼容旧的纯文本,也支持富笔记对象 { text, codes, videos }
  const setNote = useCallback(
    (sectionId, value) => {
      setNotes((prev) => {
        const next = { ...prev }
        const empty =
          !value ||
          (typeof value === 'string'
            ? !value.trim()
            : !(value.text && value.text.trim()) &&
              !(value.codes && value.codes.length) &&
              !(value.videos && value.videos.length))
        if (empty) delete next[sectionId]
        else next[sectionId] = value
        save(NOTES_KEY, next)
        scheduleSync('notes', next)
        return next
      })
    },
    [scheduleSync],
  )

  // value 是一个对象 { text, codes:[{lang,code}], videos:[{title,url}] }
  const setProblemNote = useCallback(
    (sectionId, index, value) => {
      setProblemNotes((prev) => {
        const key = `${sectionId}#${index}`
        const next = { ...prev }
        const empty =
          !value ||
          (!(value.text && value.text.trim()) &&
            !(value.codes && value.codes.length) &&
            !(value.videos && value.videos.length))
        if (empty) delete next[key]
        else next[key] = value
        save(PNOTES_KEY, next)
        scheduleSync('problemNotes', next)
        return next
      })
    },
    [scheduleSync],
  )

  // 添加自定义题目(自动生成唯一 id 并持久化)
  const addProblem = useCallback(
    (sectionId, prob) => {
      setCustomProblems((prev) => {
        const id = 'c' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36)
        const list = prev[sectionId] ? [...prev[sectionId]] : []
        list.push({ id, ...prob })
        const next = { ...prev, [sectionId]: list }
        save(CUSTOM_KEY, next)
        scheduleSync('customProblems', next)
        return next
      })
    },
    [scheduleSync],
  )

  // 删除自定义题目(同时清掉它的打卡和笔记)
  const removeProblem = useCallback(
    (sectionId, id) => {
      const key = `${sectionId}#${id}`
      setCustomProblems((prev) => {
        const list = (prev[sectionId] || []).filter((p) => p.id !== id)
        const next = { ...prev }
        if (list.length) next[sectionId] = list
        else delete next[sectionId]
        save(CUSTOM_KEY, next)
        scheduleSync('customProblems', next)
        return next
      })
      setStatus((prev) => {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        save(STATUS_KEY, next)
        scheduleSync('status', next)
        return next
      })
      setProblemNotes((prev) => {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        save(PNOTES_KEY, next)
        scheduleSync('problemNotes', next)
        return next
      })
    },
    [scheduleSync],
  )

  // 添加 / 删除学习资料
  const addMaterial = useCallback(
    (sectionId, mat) => {
      setMaterials((prev) => {
        const id = 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36)
        const list = prev[sectionId] ? [...prev[sectionId]] : []
        list.push({ id, ...mat })
        const next = { ...prev, [sectionId]: list }
        save(MATERIALS_KEY, next)
        scheduleSync('materials', next)
        return next
      })
    },
    [scheduleSync],
  )

  const removeMaterial = useCallback(
    (sectionId, id) => {
      setMaterials((prev) => {
        const list = (prev[sectionId] || []).filter((m) => m.id !== id)
        const next = { ...prev }
        if (list.length) next[sectionId] = list
        else delete next[sectionId]
        save(MATERIALS_KEY, next)
        scheduleSync('materials', next)
        return next
      })
    },
    [scheduleSync],
  )

  const resetProgress = useCallback(() => {
    setStatus(() => {
      save(STATUS_KEY, {})
      scheduleSync('status', {})
      return {}
    })
  }, [scheduleSync])

  return {
    status, notes, problemNotes, customProblems, materials, lang, syncStatus,
    setLang, cycleStatus, setNote, setProblemNote, addProblem, removeProblem,
    addMaterial, removeMaterial, resetProgress,
  }
}
