import { useState, useCallback, useMemo } from 'react'
import { useStore } from './hooks/useStore.js'
import { SYSTEM_DESIGN, OOD_EXAMPLES, OOD_REAL, OOD_INTRO, SD_ID, OOD_ID } from './data/prep.js'
import { LangContext, makeT } from './i18n.js'
import RoadmapView from './components/RoadmapView.jsx'
import NotesPage from './components/NotesPage.jsx'
import PrepPage from './components/PrepPage.jsx'
import NotePage from './components/NotePage.jsx'
import logo from './assets/logo.png'
import './App.css'

export default function App() {
  const store = useStore()
  const {
    status, notes, problemNotes, customProblems, materials, lang,
    setLang, cycleStatus, setNote, setProblemNote, addProblem, removeProblem,
    addMaterial, removeMaterial, resetProgress,
  } = store
  const [view, setView] = useState('roadmap')
  const [focusId, setFocusId] = useState(null)
  // 独立笔记页:记录目标题目 + 从哪个页面进来(返回时回去)
  const [noteRef, setNoteRef] = useState(null)
  const [noteFrom, setNoteFrom] = useState('roadmap')

  const t = useMemo(() => makeT(lang), [lang])
  const langCtx = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])

  const openInRoadmap = useCallback((nodeId) => {
    setFocusId(nodeId)
    setView('roadmap')
  }, [])

  const openNotePage = useCallback((sectionId, index) => {
    setNoteRef({ sectionId, index })
    setView((v) => {
      setNoteFrom(v === 'note' ? 'roadmap' : v)
      return 'note'
    })
  }, [])

  const closeNotePage = useCallback(() => {
    setNoteRef(null)
    setView(noteFrom || 'roadmap')
  }, [noteFrom])

  const NAV = [
    { id: 'roadmap', label: t('roadmap') },
    { id: 'notes', label: t('notes') },
    { id: 'sysdesign', label: t('sysdesign') },
    { id: 'ood', label: t('ood') },
  ]

  return (
    <LangContext.Provider value={langCtx}>
      <div className="app">
        <header className="topbar">
          <div className="brand"><img src={logo} className="brand-logo" alt="" /> {t('brand')}</div>
          <div className="topbar-right">
            <nav className="nav">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  className={`nav-item${view === n.id ? ' active' : ''}`}
                  onClick={() => {
                    if (n.id === 'roadmap') setFocusId(null)
                    setView(n.id)
                  }}
                >
                  {n.label}
                </button>
              ))}
            </nav>
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              title="中文 / English"
            >
              {lang === 'zh' ? 'EN' : '中'}
            </button>
          </div>
        </header>

        <div className="view">
          {view === 'roadmap' && (
            <RoadmapView
              status={status}
              notes={notes}
              problemNotes={problemNotes}
              customProblems={customProblems}
              cycleStatus={cycleStatus}
              setNote={setNote}
              setProblemNote={setProblemNote}
              addProblem={addProblem}
              removeProblem={removeProblem}
              resetProgress={resetProgress}
              focusId={focusId}
              onExpandNote={openNotePage}
            />
          )}

          {view === 'notes' && (
            <div className="scroll-page">
              <NotesPage
                problemNotes={problemNotes}
                customProblems={customProblems}
                onProblemNote={setProblemNote}
                onOpenInRoadmap={openInRoadmap}
                onExpandNote={openNotePage}
              />
            </div>
          )}

          {view === 'note' && (
            <div className="scroll-page">
              <NotePage
                target={noteRef}
                status={status}
                notes={notes}
                problemNotes={problemNotes}
                customProblems={customProblems}
                onCycle={cycleStatus}
                onProblemNote={setProblemNote}
                onNote={setNote}
                onBack={closeNotePage}
              />
            </div>
          )}

          {view === 'sysdesign' && (
            <div className="scroll-page">
              <PrepPage
                title={t('sdTitle')}
                subtitle={t('sdSub')}
                desc={t('sdDesc')}
                sections={[{ id: 'all', items: SYSTEM_DESIGN }]}
                sectionId={SD_ID}
                status={status}
                problemNotes={problemNotes}
                onCycle={cycleStatus}
                onProblemNote={setProblemNote}
                onExpandNote={openNotePage}
              />
            </div>
          )}

          {view === 'ood' && (
            <div className="scroll-page">
              <PrepPage
                title={t('oodTitle')}
                subtitle={t('oodSub')}
                introContent={OOD_INTRO}
                desc={t('oodDesc')}
                sections={[
                  { id: 'examples', label: t('examplesQ'), items: OOD_EXAMPLES },
                  { id: 'real', label: t('realQ'), items: OOD_REAL, canAdd: true, mergeCustom: true, structured: true },
                ]}
                sectionId={OOD_ID}
                status={status}
                problemNotes={problemNotes}
                customProblems={customProblems}
                materials={materials}
                onCycle={cycleStatus}
                onProblemNote={setProblemNote}
                onAddItem={addProblem}
                onRemoveItem={removeProblem}
                onAddMaterial={addMaterial}
                onRemoveMaterial={removeMaterial}
                onExpandNote={openNotePage}
              />
            </div>
          )}
        </div>
      </div>
    </LangContext.Provider>
  )
}
