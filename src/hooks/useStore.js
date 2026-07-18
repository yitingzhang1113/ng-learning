import { useCallback, useState } from 'react'

// 全部数据都存在浏览器 localStorage 里:
//   status:      每题状态   key「板块id#题序」-> 'attempting' | 'solved'
//   notes:       每板块笔记 key「板块id」      -> 文本
//   problemNotes:每题笔记   key「板块id#题序」 -> 文本
// 换电脑 / 清缓存会丢;要跨设备同步可以之后接后端。
const STATUS_KEY = 'algo-roadmap-status'
const NOTES_KEY = 'algo-roadmap-notes'
const PNOTES_KEY = 'algo-roadmap-problem-notes'
const LANG_KEY = 'algo-roadmap-lang'
const CUSTOM_KEY = 'algo-roadmap-custom-problems'
const MATERIALS_KEY = 'algo-roadmap-materials'

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
  const setLang = useCallback((l) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const cycleStatus = useCallback((sectionId, index) => {
    setStatus((prev) => {
      const key = `${sectionId}#${index}`
      const idx = STATUS_CYCLE.indexOf(prev[key])
      const nextVal = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      const next = { ...prev }
      if (nextVal) next[key] = nextVal
      else delete next[key]
      save(STATUS_KEY, next)
      return next
    })
  }, [])

  // 板块笔记:兼容旧的纯文本,也支持富笔记对象 { text, codes, videos }
  const setNote = useCallback((sectionId, value) => {
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
      return next
    })
  }, [])

  // value 是一个对象 { text, codes:[{lang,code}], videos:[{title,url}] }
  const setProblemNote = useCallback((sectionId, index, value) => {
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
      return next
    })
  }, [])

  // 添加自定义题目(自动生成唯一 id 并持久化)
  const addProblem = useCallback((sectionId, prob) => {
    setCustomProblems((prev) => {
      const id = 'c' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36)
      const list = prev[sectionId] ? [...prev[sectionId]] : []
      list.push({ id, ...prob })
      const next = { ...prev, [sectionId]: list }
      save(CUSTOM_KEY, next)
      return next
    })
  }, [])

  // 删除自定义题目(同时清掉它的打卡和笔记)
  const removeProblem = useCallback((sectionId, id) => {
    const key = `${sectionId}#${id}`
    setCustomProblems((prev) => {
      const list = (prev[sectionId] || []).filter((p) => p.id !== id)
      const next = { ...prev }
      if (list.length) next[sectionId] = list
      else delete next[sectionId]
      save(CUSTOM_KEY, next)
      return next
    })
    setStatus((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      save(STATUS_KEY, next)
      return next
    })
    setProblemNotes((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      save(PNOTES_KEY, next)
      return next
    })
  }, [])

  // 添加 / 删除学习资料
  const addMaterial = useCallback((sectionId, mat) => {
    setMaterials((prev) => {
      const id = 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36)
      const list = prev[sectionId] ? [...prev[sectionId]] : []
      list.push({ id, ...mat })
      const next = { ...prev, [sectionId]: list }
      save(MATERIALS_KEY, next)
      return next
    })
  }, [])

  const removeMaterial = useCallback((sectionId, id) => {
    setMaterials((prev) => {
      const list = (prev[sectionId] || []).filter((m) => m.id !== id)
      const next = { ...prev }
      if (list.length) next[sectionId] = list
      else delete next[sectionId]
      save(MATERIALS_KEY, next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    setStatus(() => {
      save(STATUS_KEY, {})
      return {}
    })
  }, [])

  return {
    status, notes, problemNotes, customProblems, materials, lang,
    setLang, cycleStatus, setNote, setProblemNote, addProblem, removeProblem,
    addMaterial, removeMaterial, resetProgress,
  }
}
