import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock, Zap, BarChart3, BookOpen, Award, ChevronRight,
  CheckCircle, XCircle, Bookmark, BookmarkCheck, LogOut,
  Target, TrendingUp, Shield, Globe, Cpu, Wifi, AlertTriangle, Wrench
} from "lucide-react";
import { questionBank, getRandomQuestions, getQuestionsForDomain } from "../data/networkQuestions";

// ─── Types ────────────────────────────────────────────────────────────────────
type DomainId = 1 | 2 | 3 | 4 | 5;
type ViewMode = "dashboard" | "practice" | "exam" | "results";

interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  wrongExplanations: (string | null)[];
  topic: string;
}

interface UserAnswer {
  questionIndex: number;
  questionId: number;
  selected: number;
  correct: boolean;
  domain: DomainId;
}

interface DomainStat {
  attempts: number;
  bestScore: number;
  lastScore: number;
  passed: boolean;
  weakQuestionIds: number[];
}

interface SessionResult {
  type: "practice" | "exam";
  domain?: DomainId;
  score: number;
  total: number;
  duration: number;
  passed: boolean;
  answers: UserAnswer[];
  date: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DOMAIN_META: Record<DomainId, { name: string; short: string; color: string; icon: React.ReactNode; pct: number }> = {
  1: { name: "Networking Fundamentals",      short: "Fundamentals", color: "#00e5ff", icon: <Globe className="w-5 h-5" />,   pct: 24 },
  2: { name: "Network Implementations",      short: "Implementations", color: "#b344ff", icon: <Wifi className="w-5 h-5" />,   pct: 19 },
  3: { name: "Network Operations",           short: "Operations",   color: "#ffd600", icon: <Cpu className="w-5 h-5" />,    pct: 16 },
  4: { name: "Network Security",             short: "Security",     color: "#ff3c6e", icon: <Shield className="w-5 h-5" />, pct: 19 },
  5: { name: "Network Troubleshooting",      short: "Troubleshooting", color: "#00ff9d", icon: <Wrench className="w-5 h-5" />, pct: 22 },
};

const EXAM_TIME = 5400; // 90 min in seconds
const PRACTICE_COUNT = 50;
const EXAM_COUNT = 90;
const PASS_THRESHOLD = 0.70;

const EMPTY_STATS: DomainStat = { attempts: 0, bestScore: 0, lastScore: 0, passed: false, weakQuestionIds: [] };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const loadStats = (): Record<DomainId, DomainStat> => {
  try {
    const saved = localStorage.getItem("netpro-domain-stats");
    return saved ? JSON.parse(saved) : { 1: { ...EMPTY_STATS }, 2: { ...EMPTY_STATS }, 3: { ...EMPTY_STATS }, 4: { ...EMPTY_STATS }, 5: { ...EMPTY_STATS } };
  } catch { return { 1: { ...EMPTY_STATS }, 2: { ...EMPTY_STATS }, 3: { ...EMPTY_STATS }, 4: { ...EMPTY_STATS }, 5: { ...EMPTY_STATS } }; }
};

const saveStats = (stats: Record<DomainId, DomainStat>) => {
  try { localStorage.setItem("netpro-domain-stats", JSON.stringify(stats)); } catch {}
};

const loadBookmarks = (): number[] => {
  try { const s = localStorage.getItem("netpro-bookmarks"); return s ? JSON.parse(s) : []; } catch { return []; }
};

const saveBookmarks = (bm: number[]) => {
  try { localStorage.setItem("netpro-bookmarks", JSON.stringify(bm)); } catch {}
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const proEmail = sessionStorage.getItem("pro_email") || "pro user";

  // ── Core state
  const [view, setView] = useState<ViewMode>("dashboard");
  const [sessionType, setSessionType] = useState<"practice" | "exam">("practice");
  const [currentDomain, setCurrentDomain] = useState<DomainId>(1);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME);
  const [sessionActive, setSessionActive] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [domainStats, setDomainStats] = useState<Record<DomainId, DomainStat>>(loadStats);
  const [bookmarks, setBookmarks] = useState<number[]>(loadBookmarks);
  const [showBookmarkOnly, setShowBookmarkOnly] = useState(false);
  const [showExamConfirm, setShowExamConfirm] = useState(false);

  // ── Timer
  useEffect(() => {
    if (!sessionActive) return;
    const id = setInterval(() => {
      if (sessionType === "exam") {
        setTimeRemaining(prev => {
          if (prev <= 1) { clearInterval(id); finishSession(userAnswers, score); return 0; }
          return prev - 1;
        });
      } else {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sessionActive, sessionType]);

  // ── Adaptive question builder for practice
  const buildPracticeQuestions = useCallback((domain: DomainId): Question[] => {
    const all = getQuestionsForDomain(domain) as Question[];
    const weakIds = domainStats[domain]?.weakQuestionIds || [];
    const weak = all.filter(q => weakIds.includes(q.id));
    const rest = all.filter(q => !weakIds.includes(q.id));
    const shuffleArr = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    // Fill up to PRACTICE_COUNT, prioritising weak questions
    const picked = [...shuffleArr(weak), ...shuffleArr(rest)].slice(0, PRACTICE_COUNT);
    return picked;
  }, [domainStats]);

  // ── Build exam questions (mix across all domains)
  const buildExamQuestions = (): Question[] => {
    const perDomain = Math.floor(EXAM_COUNT / 5);
    const all: Question[] = [];
    ([1, 2, 3, 4, 5] as DomainId[]).forEach(d => {
      const qs = getRandomQuestions(d, perDomain) as Question[];
      all.push(...qs);
    });
    return [...all].sort(() => Math.random() - 0.5);
  };

  // ── Start practice
  const startPractice = (domain: DomainId) => {
    setCurrentDomain(domain);
    setSessionType("practice");
    const qs = buildPracticeQuestions(domain);
    setCurrentQuestions(qs);
    setCurrentQ(0); setScore(0); setTimeElapsed(0); setUserAnswers([]); setSelectedAnswer(-1);
    setSessionActive(true);
    setView("practice");
  };

  // ── Start timed exam
  const startExam = () => {
    setSessionType("exam");
    const qs = buildExamQuestions();
    setCurrentQuestions(qs);
    setCurrentQ(0); setScore(0); setTimeElapsed(0); setTimeRemaining(EXAM_TIME);
    setUserAnswers([]); setSelectedAnswer(-1);
    setSessionActive(true);
    setShowExamConfirm(false);
    setView("exam");
  };

  // ── Next question
  const nextQuestion = () => {
    if (selectedAnswer === -1) return;
    const q = currentQuestions[currentQ];
    const isCorrect = selectedAnswer === q.correct;
    const newScore = isCorrect ? score + 1 : score;
    const answer: UserAnswer = {
      questionIndex: currentQ,
      questionId: q.id,
      selected: selectedAnswer,
      correct: isCorrect,
      domain: (sessionType === "practice" ? currentDomain : 1) as DomainId,
    };
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    setScore(newScore);
    if (currentQ + 1 < currentQuestions.length) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(-1);
    } else {
      finishSession(newAnswers, newScore);
    }
  };

  // ── Finish session
  const finishSession = (answers: UserAnswer[], finalScore: number) => {
    setSessionActive(false);
    const total = currentQuestions.length;
    const passed = finalScore / total >= PASS_THRESHOLD;
    const duration = sessionType === "exam" ? EXAM_TIME - timeRemaining : timeElapsed;

    // Update domain stats
    if (sessionType === "practice") {
      const wrongIds = answers.filter(a => !a.correct).map(a => a.questionId);
      const prev = domainStats[currentDomain];
      const updated: DomainStat = {
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, Math.round((finalScore / total) * 100)),
        lastScore: Math.round((finalScore / total) * 100),
        passed: prev.passed || passed,
        weakQuestionIds: [...new Set([...prev.weakQuestionIds, ...wrongIds])].filter(
          id => !answers.find(a => a.questionId === id && a.correct)
        ),
      };
      const newStats = { ...domainStats, [currentDomain]: updated };
      setDomainStats(newStats);
      saveStats(newStats);
    }

    const result: SessionResult = {
      type: sessionType,
      domain: sessionType === "practice" ? currentDomain : undefined,
      score: finalScore,
      total,
      duration,
      passed,
      answers,
      date: new Date().toLocaleString(),
    };
    setLastResult(result);
    setView("results");
  };

  // ── Bookmark toggle
  const toggleBookmark = (questionId: number) => {
    const updated = bookmarks.includes(questionId)
      ? bookmarks.filter(id => id !== questionId)
      : [...bookmarks, questionId];
    setBookmarks(updated);
    saveBookmarks(updated);
  };

  // ── Logout
  const handleLogout = () => {
    sessionStorage.removeItem("pro_email");
    navigate("/");
  };

  const totalPassed = ([1, 2, 3, 4, 5] as DomainId[]).filter(d => domainStats[d].passed).length;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  // ── DASHBOARD ───────────────────────────────────────────────────────────────
  if (view === "dashboard") {
    return (
      <div className="min-h-screen text-white" style={{ background: "#07070f", fontFamily: "'Rajdhani', sans-serif" }}>
        {/* Grid background */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-cyan-500/20" style={{ background: "rgba(7,7,15,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: "#00e5ff", letterSpacing: 2 }}>
              Digital<span style={{ color: "#b344ff" }}>Edge</span> <span style={{ color: "rgba(224,224,255,0.4)", fontSize: 13, fontWeight: 400 }}>N+ PRO</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-cyan-400/60" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{proEmail}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

          {/* Hero bar */}
          <div className="rounded-xl p-6 mb-8 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.06), rgba(179,68,255,0.06))" }}>
            <div>
              <div className="text-xs tracking-widest text-cyan-400 mb-1" style={{ fontFamily: "'Share Tech Mono', monospace" }}>// COMPTIA N10-009 — PRO ACCESS</div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>Network+ Mastery Pro</h1>
              <p className="text-gray-400">450+ adaptive questions across 5 exam domains</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>{totalPassed}/5</div>
                <div className="text-xs text-gray-500">DOMAINS PASSED</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {([1,2,3,4,5] as DomainId[]).reduce((s, d) => s + domainStats[d].attempts, 0)}
                </div>
                <div className="text-xs text-gray-500">TOTAL ATTEMPTS</div>
              </div>
              <button
                onClick={() => setShowExamConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-1"
                style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #b344ff, #00e5ff)", color: "#000", letterSpacing: 1 }}>
                <Zap className="w-4 h-4" /> TIMED EXAM
              </button>
            </div>
          </div>

          {/* Exam confirm modal */}
          {showExamConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
              <div className="rounded-xl p-8 max-w-md w-full mx-4 border border-purple-500/30" style={{ background: "#12122a" }}>
                <Target className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-center mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>START TIMED EXAM</h2>
                <p className="text-gray-400 text-center text-sm mb-6">90 minutes · {EXAM_COUNT} questions · All 5 domains · 70% to pass</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowExamConfirm(false)} className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold">Cancel</button>
                  <button onClick={startExam} className="flex-1 py-3 rounded-lg font-bold text-black transition-all"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #b344ff, #00e5ff)" }}>BEGIN</button>
                </div>
              </div>
            </div>
          )}

          {/* Domain cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {([1, 2, 3, 4, 5] as DomainId[]).map(d => {
              const meta = DOMAIN_META[d];
              const stat = domainStats[d];
              const qCount = questionBank[d]?.length || 0;
              return (
                <div key={d} className="rounded-xl border p-5 transition-all hover:-translate-y-1 cursor-pointer group"
                  style={{ background: "#12122a", borderColor: stat.passed ? meta.color + "66" : "rgba(0,229,255,0.12)" }}
                  onClick={() => startPractice(d)}>
                  {/* Top bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, transparent)`, borderRadius: 2, marginBottom: 16 }} />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs font-bold tracking-widest mb-1" style={{ fontFamily: "'Orbitron', sans-serif", color: meta.color }}>DOMAIN {d}</div>
                      <div className="text-white font-semibold text-sm">{meta.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{meta.pct}% of exam</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div style={{ color: meta.color }}>{meta.icon}</div>
                      {stat.passed && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: meta.color }}>{stat.attempts}</div>
                      <div className="text-xs text-gray-500">ATTEMPTS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: stat.bestScore >= 70 ? "#00ff9d" : stat.bestScore > 0 ? "#ffd600" : "#666" }}>{stat.bestScore > 0 ? stat.bestScore + "%" : "—"}</div>
                      <div className="text-xs text-gray-500">BEST</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>{qCount}</div>
                      <div className="text-xs text-gray-500">QUESTIONS</div>
                    </div>
                  </div>
                  {/* Weak question callout */}
                  {stat.weakQuestionIds.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-orange-400 mb-3">
                      <AlertTriangle className="w-3 h-3" /> {stat.weakQuestionIds.length} weak questions targeted
                    </div>
                  )}
                  <button className="w-full py-2 rounded-lg text-xs font-bold tracking-widest transition-all group-hover:opacity-100 opacity-70"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: meta.color + "22", border: `1px solid ${meta.color}55`, color: meta.color }}>
                    PRACTICE DOMAIN {d} →
                  </button>
                </div>
              );
            })}

            {/* Bookmarks card */}
            <div className="rounded-xl border p-5 cursor-pointer transition-all hover:-translate-y-1"
              style={{ background: "#12122a", borderColor: "rgba(255,214,0,0.2)" }}
              onClick={() => { setShowBookmarkOnly(true); }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #ffd600, transparent)", borderRadius: 2, marginBottom: 16 }} />
              <div className="flex items-center gap-3 mb-3">
                <Bookmark className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-xs font-bold tracking-widest text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>BOOKMARKS</div>
                  <div className="text-white text-sm font-semibold">Saved Questions</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>{bookmarks.length}</div>
              <div className="text-xs text-gray-500">questions bookmarked for review</div>
            </div>
          </div>

          {/* Bookmark review modal */}
          {showBookmarkOnly && (
            <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(4px)" }}>
              <div className="max-w-3xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>BOOKMARKED QUESTIONS</h2>
                  <button onClick={() => setShowBookmarkOnly(false)} className="text-gray-400 hover:text-white text-sm">✕ Close</button>
                </div>
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No bookmarks yet. Bookmark questions during practice.</div>
                ) : (
                  <div className="space-y-4">
                    {([1,2,3,4,5] as DomainId[]).flatMap(d =>
                      (questionBank[d] as Question[]).filter(q => bookmarks.includes(q.id))
                        .map(q => (
                          <div key={q.id} className="rounded-lg p-4 border border-yellow-400/20" style={{ background: "#12122a" }}>
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs text-yellow-400" style={{ fontFamily: "'Share Tech Mono', monospace" }}>{q.topic}</div>
                              <button onClick={() => toggleBookmark(q.id)} className="text-yellow-400 hover:text-gray-400"><BookmarkCheck className="w-4 h-4" /></button>
                            </div>
                            <p className="text-white mb-3">{q.question}</p>
                            <p className="text-green-400 text-sm">✓ {q.choices[q.correct]}</p>
                            <p className="text-gray-400 text-xs mt-2">{q.explanation}</p>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="rounded-xl border border-cyan-500/20 p-6" style={{ background: "#12122a" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14 }}>EXAM READINESS</h3>
            </div>
            <div className="space-y-3">
              {([1,2,3,4,5] as DomainId[]).map(d => {
                const stat = domainStats[d];
                const meta = DOMAIN_META[d];
                const pct = stat.bestScore;
                return (
                  <div key={d} className="flex items-center gap-4">
                    <div className="text-xs w-32 text-gray-400 truncate">{meta.short}</div>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: pct >= 70 ? "#00ff9d" : pct > 0 ? meta.color : "#333" }} />
                    </div>
                    <div className="text-xs w-10 text-right" style={{ color: pct >= 70 ? "#00ff9d" : meta.color }}>{pct > 0 ? pct + "%" : "—"}</div>
                    {stat.passed && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
            {totalPassed === 5 && (
              <div className="mt-6 p-4 rounded-lg text-center border border-yellow-400/30" style={{ background: "rgba(255,214,0,0.05)" }}>
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>ALL DOMAINS PASSED — EXAM READY!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PRACTICE / EXAM QUIZ VIEW ──────────────────────────────────────────────
  if (view === "practice" || view === "exam") {
    const q = currentQuestions[currentQ];
    const isExam = view === "exam";
    const accentColor = isExam ? "#b344ff" : DOMAIN_META[currentDomain].color;
    const timeWarning = isExam && timeRemaining < 600;
    const isBookmarked = q ? bookmarks.includes(q.id) : false;

    return (
      <div className="min-h-screen text-white" style={{ background: "#07070f", fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* Top bar */}
        <div className="sticky top-0 z-50 border-b" style={{ background: "rgba(7,7,15,0.97)", borderColor: accentColor + "30", backdropFilter: "blur(12px)" }}>
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif", color: accentColor }}>
                {isExam ? "TIMED EXAM" : `DOMAIN ${currentDomain}`}
              </span>
              <span className="text-gray-500 text-xs">{currentQ + 1} / {currentQuestions.length}</span>
            </div>
            <div className="flex-1 max-w-xs bg-gray-800 rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQ + 1) / currentQuestions.length) * 100}%`, background: accentColor }} />
            </div>
            <div className="flex items-center gap-4">
              {isExam ? (
                <div className={`flex items-center gap-1 text-sm font-mono font-bold ${timeWarning ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>
                  <Clock className="w-4 h-4" /> {fmt(timeRemaining)}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" /> {fmt(timeElapsed)}
                </div>
              )}
              <div className="text-sm" style={{ color: accentColor }}>
                {score} correct
              </div>
              <button
                onClick={() => { setSessionActive(false); setView("dashboard"); }}
                className="text-xs text-gray-500 hover:text-white transition-colors">
                Exit
              </button>
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          {q && (
            <div className="rounded-xl border p-8" style={{ background: "#12122a", borderColor: accentColor + "33" }}>
              {/* Domain tag + bookmark */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs px-3 py-1 rounded-full" style={{ fontFamily: "'Share Tech Mono', monospace", background: accentColor + "22", color: accentColor, border: `1px solid ${accentColor}44` }}>
                  {q.topic}
                </span>
                <button onClick={() => toggleBookmark(q.id)} className="transition-colors hover:scale-110 transform"
                  style={{ color: isBookmarked ? "#ffd600" : "#555" }}>
                  {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>

              <h2 className="text-xl font-semibold text-white mb-8 leading-relaxed">{q.question}</h2>

              {/* Choices */}
              <div className="space-y-3 mb-8">
                {q.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className="w-full text-left p-4 rounded-lg border transition-all hover:-translate-y-0.5"
                    style={{
                      background: selectedAnswer === i ? accentColor + "22" : "rgba(255,255,255,0.03)",
                      borderColor: selectedAnswer === i ? accentColor : "rgba(255,255,255,0.1)",
                      color: selectedAnswer === i ? "#fff" : "#ccc",
                    }}>
                    <span className="font-bold mr-3 text-xs" style={{ color: selectedAnswer === i ? accentColor : "#555" }}>
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {choice}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => { setSessionActive(false); finishSession(userAnswers, score); }}
                  className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2">
                  Finish & Review
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={selectedAnswer === -1}
                  className="px-8 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-1"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: selectedAnswer !== -1 ? `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` : "#333",
                    color: selectedAnswer !== -1 ? "#000" : "#666",
                    letterSpacing: 1,
                  }}>
                  {currentQ + 1 === currentQuestions.length ? "FINISH →" : "NEXT →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS VIEW ──────────────────────────────────────────────────────────
  if (view === "results" && lastResult) {
    const { score: finalScore, total, passed, duration, type, answers, domain } = lastResult;
    const pct = Math.round((finalScore / total) * 100);
    const wrongAnswers = answers.filter(a => !a.correct);

    return (
      <div className="min-h-screen text-white" style={{ background: "#07070f", fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
          {/* Result header */}
          <div className="rounded-xl border p-8 mb-6 text-center"
            style={{ background: "#12122a", borderColor: passed ? "rgba(0,255,157,0.3)" : "rgba(255,60,110,0.3)" }}>
            {passed ? (
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif", color: passed ? "#00ff9d" : "#ff3c6e" }}>
              {passed ? "DOMAIN PASSED!" : "KEEP STUDYING"}
            </h2>
            <p className="text-gray-400 mb-8">
              {type === "exam" ? "Full Exam" : `Domain ${domain} — ${DOMAIN_META[domain!].name}`}
            </p>

            {/* Score stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg p-4" style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)" }}>
                <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>{finalScore}/{total}</div>
                <div className="text-xs text-gray-500 mt-1">CORRECT</div>
              </div>
              <div className="rounded-lg p-4" style={{ background: passed ? "rgba(0,255,157,0.06)" : "rgba(255,60,110,0.06)", border: `1px solid ${passed ? "rgba(0,255,157,0.2)" : "rgba(255,60,110,0.2)"}` }}>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: passed ? "#00ff9d" : "#ff3c6e" }}>{pct}%</div>
                <div className="text-xs text-gray-500 mt-1">SCORE</div>
              </div>
              <div className="rounded-lg p-4" style={{ background: "rgba(179,68,255,0.06)", border: "1px solid rgba(179,68,255,0.2)" }}>
                <div className="text-2xl font-bold text-purple-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>{fmt(duration)}</div>
                <div className="text-xs text-gray-500 mt-1">TIME</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 flex-wrap">
              {passed ? (
                type === "practice" && domain && domain < 5 ? (
                  <button onClick={() => startPractice((domain + 1) as DomainId)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #00ff9d, #00e5ff)", color: "#000" }}>
                    DOMAIN {domain + 1} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null
              ) : (
                type === "practice" && domain ? (
                  <button onClick={() => startPractice(domain)}
                    className="px-6 py-3 rounded-lg font-bold text-sm"
                    style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #ff3c6e, #b344ff)", color: "#fff" }}>
                    RETRY DOMAIN {domain}
                  </button>
                ) : null
              )}
              <button onClick={() => setView("dashboard")}
                className="px-6 py-3 rounded-lg font-bold text-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DASHBOARD
              </button>
              {type === "practice" && (
                <button onClick={() => setShowExamConfirm(true)}
                  className="px-6 py-3 rounded-lg font-bold text-sm"
                  style={{ fontFamily: "'Orbitron', sans-serif", background: "linear-gradient(135deg, #b344ff, #00e5ff)", color: "#000" }}>
                  TIMED EXAM
                </button>
              )}
            </div>
          </div>

          {/* Adaptive note */}
          {wrongAnswers.length > 0 && (
            <div className="rounded-lg p-4 mb-6 border border-orange-400/20 flex items-center gap-3"
              style={{ background: "rgba(255,149,0,0.05)" }}>
              <Zap className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                <span className="text-orange-400 font-semibold">Adaptive engine updated:</span> {wrongAnswers.length} missed question{wrongAnswers.length > 1 ? "s" : ""} will appear more frequently in your next practice session.
              </p>
            </div>
          )}

          {/* Wrong answers review */}
          {wrongAnswers.length > 0 && (
            <div className="rounded-xl border border-red-500/20 p-6" style={{ background: "#12122a" }}>
              <div className="flex items-center gap-2 mb-6">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-red-400" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14 }}>
                  REVIEW — {wrongAnswers.length} INCORRECT
                </h3>
              </div>
              <div className="space-y-5">
                {wrongAnswers.map((ans, i) => {
                  const q = currentQuestions[ans.questionIndex];
                  if (!q) return null;
                  const wrongExpl = q.wrongExplanations?.[ans.selected];
                  return (
                    <div key={i} className="rounded-lg p-5 border border-red-500/15" style={{ background: "rgba(255,60,110,0.04)" }}>
                      <div className="text-xs mb-2" style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff3c6e" }}>{q.topic}</div>
                      <p className="font-semibold text-white mb-3">{q.question}</p>
                      <p className="text-sm text-red-400 mb-1">✗ Your answer: {q.choices[ans.selected]}</p>
                      {wrongExpl && <p className="text-xs text-gray-500 mb-3 italic">{wrongExpl}</p>}
                      <p className="text-sm text-green-400 mb-1">✓ Correct: {q.choices[q.correct]}</p>
                      <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.15)" }}>
                        <p className="text-xs text-cyan-300">{q.explanation}</p>
                      </div>
                      <button onClick={() => toggleBookmark(q.id)}
                        className="mt-3 flex items-center gap-1 text-xs transition-colors"
                        style={{ color: bookmarks.includes(q.id) ? "#ffd600" : "#555" }}>
                        {bookmarks.includes(q.id) ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                        {bookmarks.includes(q.id) ? "Bookmarked" : "Bookmark for review"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {wrongAnswers.length === 0 && (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-yellow-400 font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>PERFECT SCORE!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Home;
