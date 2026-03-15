import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Activity, Play, CheckCircle,
  X, Send, ChevronRight, ChevronDown, ExternalLink,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════ */
const TERMINAL_LOGS = [
  { text: "INITIALIZING AXIOM_UNIT_01...",        color: "#E2E2E2", t: 0    },
  { text: "ESTABLISHING SECURE CHANNEL...",       color: "#383838", t: 700  },
  { text: "DEPLOYING DETERMINISTIC WORKFLOW...",  color: "#E2E2E2", t: 1500 },
  { text: "RECURSIVE LOOP ACTIVE...",             color: "#383838", t: 2200 },
  { text: "SIGNAL CAPTURED: LEAD QUALIFIED...",   color: "#6ee7b7", t: 3100 },
  { text: "ROUTING TO REVENUE PIPELINE...",       color: "#383838", t: 3900 },
  { text: "EFFICIENCY GAIN: +42%...",             color: "#6ee7b7", t: 4700 },
  { text: "LABOR UNIT EXECUTING AUTONOMOUSLY...", color: "#383838", t: 5500 },
  { text: "DIGITAL LABOR UNIT ONLINE.",           color: "#E2E2E2", t: 6300 },
  { text: "AXIOM_UNIT_01 FULLY OPERATIONAL.",     color: "#E2E2E2", t: 7000 },
];

const SIM_LOGS = [
  { tag: "INIT",    text: "SYSTEM BOOT SEQUENCE TRIGGERED...",  c: "green"  },
  { tag: "AUTH",    text: "SECURE CHANNEL ESTABLISHED...",       c: "green"  },
  { tag: "KEY",     text: "AES-256 HANDSHAKE COMPLETE...",       c: "green"  },
  { tag: "PROC",    text: "NEURAL VECTOR MAPPING...",            c: "amber"  },
  { tag: "LOAD",    text: "DETERMINISTIC WORKFLOW LOADED...",    c: "white"  },
  { tag: "SCAN",    text: "LEAD DB INDEXED: 4,821 RECORDS...",  c: "amber"  },
  { tag: "CRM",     text: "CRM ENDPOINT SYNCHRONIZED...",        c: "green"  },
  { tag: "ROUTE",   text: "ROUTING TABLE COMPUTED...",           c: "white"  },
  { tag: "ACTION",  text: "EXECUTING RESPONSE PROTOCOL...",      c: "white"  },
  { tag: "VOICE",   text: "VOICE GATEWAY ONLINE...",             c: "green"  },
  { tag: "EXEC",    text: "WORKFLOW NODE [3/7] TRIGGERED...",    c: "white"  },
  { tag: "DATA",    text: "LEAD VECTOR INGESTED: QUALIFIED...",  c: "green"  },
  { tag: "VERIFY",  text: "OUTPUT VALIDATION: PASSED...",        c: "green"  },
  { tag: "LOOP",    text: "RECURSIVE EFFICIENCY CYCLE +1...",    c: "amber"  },
  { tag: "SUCCESS", text: "KPI ENHANCEMENT DETECTED.",           c: "green"  },
  { tag: "OPT",     text: "SELF-OPTIMIZATION ROUTINE ACTIVE...", c: "amber"  },
  { tag: "PKT",     text: "DATA PACKET TX: 0.3ms...",           c: "white"  },
  { tag: "ACK",     text: "ALL NODES ACKNOWLEDGED...",           c: "green"  },
];

const TICKER_ITEMS = [
  "TOTAL HUMAN HOURS RECLAIMED: 142,802",
  "AVG. SYSTEM UPTIME: 99.998%",
  "ACTIVE NEURAL WORKFLOWS: 1,204",
  "DATA PACKETS PROCESSED: 8,441,009",
  "LEADS QUALIFIED TODAY: 3,872",
  "RECURSIVE CYCLES COMPLETED: 29,110",
];

const NODE_DEFS = [
  { x: 0.50, y: 0.44, r: 18, label: "AX-01 CORE",   primary: true  },
  { x: 0.18, y: 0.20, r: 11, label: "CRM",           primary: false },
  { x: 0.82, y: 0.20, r: 11, label: "VOICE GATEWAY", primary: false },
  { x: 0.50, y: 0.82, r: 11, label: "LEAD DATABASE", primary: false },
];
const EDGE_DEFS = [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }];
const INIT_PACKETS = [
  { edge: 0, t: 0.00, speed: 0.0042 },
  { edge: 0, t: 0.55, speed: 0.0042 },
  { edge: 1, t: 0.25, speed: 0.0050 },
  { edge: 1, t: 0.80, speed: 0.0050 },
  { edge: 2, t: 0.10, speed: 0.0036 },
  { edge: 2, t: 0.65, speed: 0.0036 },
];

const AXIOMS = [
  { numeral: "I",   icon: Shield,   title: "PRECISION OVER\nPROLIFERATION",    body: "Scale built on noise is a liability. Every Digital Labor Unit is engineered with surgical specificity: defined inputs, governed logic, and measurable outputs. A system with no ambiguity in its architecture has no ambiguity in its results.", delay: 0    },
  { numeral: "II",  icon: Lock,     title: "SOVEREIGNTY IS\nNON-NEGOTIABLE",   body: "Operational Sovereignty means your firm's core functions execute at full capacity regardless of headcount, fatigue, or market volatility. We build infrastructure that reports to your strategy — not to the constraints of available labor.", delay: 0.15 },
  { numeral: "III", icon: Activity, title: "RECURSIVE EFFICIENCY\nOR NOTHING", body: "A static system decays. Every architecture we deploy is designed to self-optimize — learning from signal, tightening from feedback, and compounding in capability over time. We install a live operational asset, not a fixed product.", delay: 0.3  },
];

const METRICS = [
  { value: "99.97%", label: "SYSTEM UPTIME"        },
  { value: "<2ms",   label: "RESPONSE LATENCY"      },
  { value: "100%",   label: "DETERMINISTIC OUTPUT"  },
  { value: "∞",      label: "RECURSIVE LOOPS / DAY" },
];

const VALIDATIONS = [
  { quote: "Axiom's deterministic workflows reduced our lead response latency by 94%.",       author: "Managing Director", firm: "Private Equity",   metric: "−94% LATENCY"  },
  { quote: "The most sophisticated autonomous deployment we have seen in the 2026 cycle.",    author: "Head of Operations", firm: "Solar Logistics", metric: "CYCLE LEADER"   },
  { quote: "We replaced three manual intake roles with one AX-01 Unit. ROI was immediate.",  author: "Founder",           firm: "Vellum Legal",    metric: "3:1 UNIT RATIO" },
];

const TIERS = [
  {
    id: "alpha", label: "ALPHA INTAKE", tag: "FOUNDATIONAL PARTNER RATE",
    slots: "3 / 5 SLOTS REMAINING", deploy: "$750", monthly: "$250",
    deployLabel: "DEPLOYMENT", monthlyLabel: "MONTHLY RETAINER", highlight: false, glow: true, slotColor: "#6ee7b7",
    features: ["AX-01 Digital Labor Unit", "Deterministic Workflow Architecture", "Recursive Optimization Engine", "Foundational Partner SLA"],
    cta: "CLAIM ALPHA SLOT",
  },
  {
    id: "delta", label: "DELTA DEPLOYMENT", tag: "STANDARD ARCHITECTURE",
    slots: null, deploy: "$1,500", monthly: "$500",
    deployLabel: "DEPLOYMENT", monthlyLabel: "MONTHLY RETAINER", highlight: true, glow: false, slotColor: null,
    features: ["Full AX-01 Unit Suite", "Custom Workflow Engineering", "Priority Deployment Queue", "Dedicated Systems Architect"],
    cta: "REQUEST DELTA BRIEF",
  },
  {
    id: "sovereign", label: "SOVEREIGN TIER", tag: "CUSTOM ENTERPRISE",
    slots: null, deploy: "CUSTOM", monthly: "CUSTOM",
    deployLabel: "CAPITAL ALLOCATION", monthlyLabel: "OPERATIONAL RETAINER", highlight: false, glow: false, slotColor: null,
    features: ["Bespoke Infrastructure Design", "Multi-Unit Autonomous Fleet", "Board-Level Systems Integration", "Perpetual Optimization Mandate"],
    cta: "INITIATE SOVEREIGN BRIEF",
  },
];

const FOOTER_LINKS = [
  { label: "NEURAL GOVERNANCE (PRIVACY)", href: "#" },
  { label: "SERVICE LEVEL AGREEMENT",     href: "#" },
  { label: "API STATUS",                  href: "#" },
  { label: "ENCRYPTED PORTAL",            href: "#" },
];

const BOTTLENECK_OPTIONS = [
  { value: "",         label: "SELECT CATEGORY" },
  { value: "sales",    label: "SALES VELOCITY"  },
  { value: "intake",   label: "CLIENT INTAKE"   },
  { value: "data",     label: "DATA SYNTHESIS"  },
  { value: "logistics",label: "LOGISTICS OPS"   },
];

const VOLUME_OPTIONS = [
  { value: "",      label: "SELECT RANGE"      },
  { value: "0-50",  label: "0 – 50 / MONTH"   },
  { value: "50-200",label: "50 – 200 / MONTH"  },
  { value: "200-500",label:"200 – 500 / MONTH" },
  { value: "500+",  label: "500+ / MONTH"      },
];

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useTerminalLoop() {
  const [logs, setLogs] = useState([]);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    setLogs([]);
    const timers = TERMINAL_LOGS.map(({ text, color, t }) =>
      setTimeout(() => setLogs(p => [...p, { text, color }]), t)
    );
    const reset = setTimeout(() => setCycle(c => c + 1), 9200);
    timers.push(reset);
    return () => timers.forEach(clearTimeout);
  }, [cycle]);
  return logs;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

/* ═══════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════ */
function StatusDot({ color = "#4ade80", size = 5 }) {
  return (
    <motion.div
      animate={{ opacity: [1, 0.4, 1], boxShadow: [`0 0 0 0 ${color}40`, `0 0 5px 2px ${color}30`, `0 0 0 0 ${color}40`] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#282828", letterSpacing: "0.34em", textAlign: "center", marginBottom: 14 }}>
      {children}
    </motion.div>
  );
}

function SectionTitle({ children }) {
  return (
    <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 5vw, 62px)", letterSpacing: "0.1em", textAlign: "center", marginBottom: 56 }}>
      {children}
    </motion.h2>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#383838", letterSpacing: "0.24em", display: "block", marginBottom: 10 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", appearance: "none",
            background: "rgba(255,255,255,0.025)", border: "1px solid #1A1A1A",
            color: value ? "#E2E2E2" : "#383838",
            fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em",
            padding: "12px 36px 12px 16px", outline: "none", cursor: "crosshair",
          }}>
          {options.map(o => <option key={o.value} value={o.value} style={{ background: "#0A0A0A" }}>{o.label}</option>)}
        </select>
        <ChevronDown size={11} color="#2A2A2A" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GLOBAL TICKER
═══════════════════════════════════════════════ */
function GlobalTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: "hidden", width: "100%", maxWidth: 320 }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, whiteSpace: "nowrap" }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: "#2A2A2A", letterSpacing: "0.14em", paddingRight: 40 }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MULTI-STEP AUDIT MODAL
═══════════════════════════════════════════════ */
function AuditModal({ open, onClose }) {
  const [step, setStep]       = useState(1);
  const [bottleneck, setBn]   = useState("");
  const [volume, setVol]      = useState("");
  const [email, setEmail]     = useState("");
  const [analyzing, setAn]    = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone]       = useState(false);

  function reset() {
    setStep(1); setBn(""); setVol(""); setEmail("");
    setAn(false); setProgress(0); setDone(false);
  }

  function handleClose() { onClose(); setTimeout(reset, 400); }

  function next() {
    if (step === 1 && !bottleneck) return;
    if (step === 2 && !volume) return;
    if (step < 3) { setStep(s => s + 1); return; }
    if (!email || !email.includes("@")) return;
    setAn(true);
  }

  /* progress bar animation on analyzing */
  useEffect(() => {
    if (!analyzing) return;
    setProgress(0);
    const start = Date.now();
    const dur = 2800;
    const tick = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(p);
      if (p >= 100) { clearInterval(tick); setTimeout(() => setDone(true), 200); }
    }, 30);
    return () => clearInterval(tick);
  }, [analyzing]);

  const STEPS = [
    "OPERATIONAL BOTTLENECK",
    "LEAD VOLUME",
    "ORGANIZATION EMAIL",
  ];

  const canNext =
    (step === 1 && bottleneck) ||
    (step === 2 && volume) ||
    (step === 3 && email.includes("@"));

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onClick={handleClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 22 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 22 }} transition={{ duration: 0.36 }}
            onClick={e => e.stopPropagation()}
            style={{ background: "#080808", border: "1px solid #1C1C1C", width: "100%", maxWidth: 500, position: "relative" }}>

            {/* Header */}
            <div style={{ borderBottom: "1px solid #141414", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.16em" }}>AXIOM DIAGNOSTIC</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#2A2A2A", letterSpacing: "0.2em", marginTop: 4 }}>
                  INFRASTRUCTURE ANALYSIS PROTOCOL &nbsp;∙&nbsp; 2026
                </div>
              </div>
              <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "crosshair", padding: 4 }}>
                <X size={13} color="#2A2A2A" strokeWidth={1} />
              </button>
            </div>

            {/* Step progress bar */}
            {!done && (
              <div style={{ display: "flex", borderBottom: "1px solid #0E0E0E" }}>
                {STEPS.map((label, i) => {
                  const active = step === i + 1;
                  const complete = step > i + 1 || analyzing;
                  return (
                    <div key={i} style={{ flex: 1, padding: "10px 12px", borderRight: i < 2 ? "1px solid #0E0E0E" : "none", textAlign: "center" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: "0.18em", color: complete ? "#6ee7b7" : active ? "#E2E2E2" : "#1E1E1E", marginBottom: 5 }}>
                        {complete ? "✓" : `0${i + 1}`}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 6.5, letterSpacing: "0.14em", color: active ? "#383838" : "#1A1A1A" }}>
                        {label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Body */}
            <div style={{ padding: "32px 28px", minHeight: 220 }}>
              {done ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "12px 0 8px" }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <CheckCircle size={30} strokeWidth={1} color="#6ee7b7" style={{ display: "block", margin: "0 auto 18px" }} />
                  </motion.div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.14em", marginBottom: 10 }}>AUDIT SCHEDULED</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#383838", letterSpacing: "0.16em", lineHeight: 2.2 }}>
                    AN ARCHITECT WILL CONTACT YOU<br />WITHIN 24 OPERATIONAL HOURS.<br />SECURE CHANNEL CONFIRMED.
                  </div>
                </motion.div>
              ) : analyzing ? (
                <div style={{ padding: "16px 0" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#E2E2E2", letterSpacing: "0.22em", marginBottom: 22 }}>
                    ANALYZING INFRASTRUCTURE...
                  </div>
                  <div style={{ background: "#0D0D0D", border: "1px solid #181818", height: 3, marginBottom: 14, overflow: "hidden" }}>
                    <motion.div style={{ height: "100%", background: "linear-gradient(90deg, #6ee7b7, #4ade80)", width: `${progress}%`, transition: "width 0.05s linear" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: "#2A2A2A", letterSpacing: "0.16em" }}>
                      {progress < 35 ? "MAPPING WORKFLOW TOPOLOGY..." :
                       progress < 65 ? "IDENTIFYING BOTTLENECK VECTORS..." :
                       progress < 88 ? "COMPUTING EFFICIENCY DELTA..." :
                       "FINALIZING AUDIT REPORT..."}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: "#2A2A2A", letterSpacing: "0.16em" }}>
                      {Math.floor(progress)}%
                    </span>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
                    {step === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#2A2A2A", letterSpacing: "0.2em", marginBottom: 4 }}>
                          STEP 01 &nbsp;∙&nbsp; IDENTIFY OPERATIONAL BOTTLENECK
                        </div>
                        <SelectField label="PRIMARY BOTTLENECK CATEGORY" value={bottleneck} onChange={setBn} options={BOTTLENECK_OPTIONS} />
                        {bottleneck && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#6ee7b7", letterSpacing: "0.16em", borderLeft: "1px solid #1a3a2a", paddingLeft: 12 }}>
                            CATEGORY LOGGED: {BOTTLENECK_OPTIONS.find(o => o.value === bottleneck)?.label}
                          </motion.div>
                        )}
                      </div>
                    )}
                    {step === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#2A2A2A", letterSpacing: "0.2em", marginBottom: 4 }}>
                          STEP 02 &nbsp;∙&nbsp; CURRENT MONTHLY LEAD VOLUME
                        </div>
                        <SelectField label="INBOUND LEAD VOLUME" value={volume} onChange={setVol} options={VOLUME_OPTIONS} />
                        {volume && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#6ee7b7", letterSpacing: "0.16em", borderLeft: "1px solid #1a3a2a", paddingLeft: 12 }}>
                            VOLUME BRACKET CONFIRMED
                          </motion.div>
                        )}
                      </div>
                    )}
                    {step === 3 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#2A2A2A", letterSpacing: "0.2em", marginBottom: 4 }}>
                          STEP 03 &nbsp;∙&nbsp; ORGANIZATION EMAIL
                        </div>
                        <div>
                          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#383838", letterSpacing: "0.24em", display: "block", marginBottom: 10 }}>
                            SECURE CONTACT ADDRESS
                          </label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="name@organization.com"
                            style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: "1px solid #1A1A1A", color: "#E2E2E2", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.08em", padding: "12px 16px", outline: "none" }} />
                        </div>
                        {email.includes("@") && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#6ee7b7", letterSpacing: "0.16em", borderLeft: "1px solid #1a3a2a", paddingLeft: 12 }}>
                            CHANNEL AUTHENTICATED
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer actions */}
            {!done && !analyzing && (
              <div style={{ borderTop: "1px solid #0E0E0E", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => step > 1 && setStep(s => s - 1)}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: step > 1 ? "#2E2E2E" : "transparent", letterSpacing: "0.2em", background: "none", border: "none", cursor: step > 1 ? "crosshair" : "default", transition: "color 0.2s" }}>
                  ← BACK
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: "#1E1E1E", letterSpacing: "0.16em" }}>
                    {step} / 3
                  </span>
                  <motion.button onClick={next} whileTap={{ scale: 0.97 }}
                    className="btn-audit"
                    style={{ padding: "10px 24px", fontSize: 9, opacity: canNext ? 1 : 0.3, transition: "opacity 0.25s" }}>
                    {step === 3 ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>TRANSMIT &nbsp;<Send size={10} strokeWidth={1} /></span> : "NEXT →"}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   TERMINAL
═══════════════════════════════════════════════ */
function Terminal() {
  const logs    = useTerminalLoop();
  const ref     = useRef(null);
  const bodyRef = useRef(null);
  const inView  = useInView(ref, { once: true, amount: 0.35 });
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [logs]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
      style={{ border: "1px solid #181818", background: "rgba(6,6,6,0.88)", backdropFilter: "blur(20px)", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ borderBottom: "1px solid #141414", padding: "10px 18px", display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.015)" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1E1E1E" }} />)}
        <span style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#282828", letterSpacing: "0.22em" }}>
          AXIOM_TERMINAL v2.1.4 &nbsp;/&nbsp; UNIT: AX-001 &nbsp;/&nbsp; 2026
        </span>
      </div>
      <div ref={bodyRef} style={{ padding: "22px 28px", minHeight: 280, overflowY: "auto", maxHeight: 296 }} className="hide-scroll">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.05em", lineHeight: 2.1, display: "flex", gap: 14, color: log.color }}>
              <span style={{ color: "#282828" }}>&gt;</span><span>{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, lineHeight: 2.1, display: "flex", gap: 14 }}>
          <span style={{ color: "#222" }}>&gt;</span>
          <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 1.3, repeat: Infinity, ease: "steps(1)" }} style={{ color: "#444" }}>_</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   OBSERVABILITY / SIMULATION
═══════════════════════════════════════════════ */
function ObservabilitySection() {
  const [isActive, setIsActive]     = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [simLogs, setSimLogs]       = useState([]);
  const isMobile = useIsMobile();

  const cnvContRef  = useRef(null);
  const cnvRef      = useRef(null);
  const waveContRef = useRef(null);
  const waveCnvRef  = useRef(null);
  const logsRef     = useRef(null);
  const netRAF      = useRef(null);
  const waveRAF     = useRef(null);
  const packetsRef  = useRef(INIT_PACKETS.map(p => ({ ...p })));
  const logIdx      = useRef(0);

  useEffect(() => {
    const syncCanvas = (cont, cnv) => {
      if (!cont || !cnv) return () => {};
      const apply = () => { cnv.width = cont.clientWidth; cnv.height = cont.clientHeight; };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(cont);
      return () => ro.disconnect();
    };
    const c1 = syncCanvas(cnvContRef.current, cnvRef.current);
    const c2 = syncCanvas(waveContRef.current, waveCnvRef.current);
    return () => { c1(); c2(); };
  }, []);

  function handlePlay() {
    setIsScanning(true);
    packetsRef.current = INIT_PACKETS.map(p => ({ ...p }));
    setTimeout(() => { setIsScanning(false); setIsActive(true); }, 780);
  }

  function handleStop() {
    setIsActive(false); setSimLogs([]); logIdx.current = 0;
    [cnvRef, waveCnvRef].forEach(r => {
      const c = r.current;
      if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
    });
  }

  /* network canvas */
  useEffect(() => {
    if (!isActive) return;
    const canvas = cnvRef.current;
    if (!canvas) return;
    const getP = i => ({ x: NODE_DEFS[i].x * canvas.width, y: NODE_DEFS[i].y * canvas.height });
    function frame() {
      const ctx = canvas.getContext("2d");
      const [W, H] = [canvas.width, canvas.height];
      ctx.clearRect(0, 0, W, H);
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,0.018)"; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.restore();
      EDGE_DEFS.forEach(e => {
        const f = getP(e.from), t = getP(e.to);
        ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = "rgba(110,231,183,0.22)";
        ctx.strokeStyle = "rgba(110,231,183,0.1)"; ctx.lineWidth = 1;
        ctx.setLineDash([3,9]); ctx.lineDashOffset = -(Date.now()*0.018%12);
        ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(t.x,t.y); ctx.stroke(); ctx.restore();
      });
      packetsRef.current.forEach(pkt => {
        pkt.t = (pkt.t + pkt.speed) % 1;
        const e = EDGE_DEFS[pkt.edge], f = getP(e.from), t = getP(e.to);
        const px = f.x+(t.x-f.x)*pkt.t, py = f.y+(t.y-f.y)*pkt.t;
        const tx = f.x+(t.x-f.x)*Math.max(0,pkt.t-0.06), ty = f.y+(t.y-f.y)*Math.max(0,pkt.t-0.06);
        const g = ctx.createLinearGradient(tx,ty,px,py);
        g.addColorStop(0,"rgba(110,231,183,0)"); g.addColorStop(1,"rgba(110,231,183,0.5)");
        ctx.save(); ctx.strokeStyle=g; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(px,py); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.shadowBlur=18; ctx.shadowColor="#6ee7b7"; ctx.fillStyle="#6ee7b7";
        ctx.beginPath(); ctx.arc(px,py,2.8,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
      const pulse = Math.sin(Date.now()*0.0018)*0.5+0.5;
      NODE_DEFS.forEach((nd, i) => {
        const nx=nd.x*W, ny=nd.y*H, r=nd.r;
        ctx.save();
        if (nd.primary) {
          ctx.strokeStyle=`rgba(110,231,183,${0.04+pulse*0.05})`; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(nx,ny,r+22+pulse*5,0,Math.PI*2); ctx.stroke();
          ctx.strokeStyle=`rgba(110,231,183,${0.06+pulse*0.04})`;
          ctx.beginPath(); ctx.arc(nx,ny,r+12,0,Math.PI*2); ctx.stroke();
        }
        ctx.shadowBlur=nd.primary?28:14; ctx.shadowColor=nd.primary?"rgba(110,231,183,0.55)":"rgba(110,231,183,0.3)";
        const rg=ctx.createRadialGradient(nx,ny,0,nx,ny,r);
        rg.addColorStop(0,nd.primary?"rgba(110,231,183,0.16)":"rgba(110,231,183,0.07)"); rg.addColorStop(1,"rgba(110,231,183,0.01)");
        ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(nx,ny,r,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle=nd.primary?"rgba(110,231,183,0.72)":"rgba(110,231,183,0.38)"; ctx.lineWidth=nd.primary?1.5:1; ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(nx,ny,r,0,Math.PI*2); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.font=`${nd.primary?8:7}px 'DM Mono',monospace`;
        ctx.fillStyle=nd.primary?"rgba(226,226,226,0.82)":"rgba(226,226,226,0.38)"; ctx.textAlign="center";
        ctx.fillText(nd.label,nx,ny+r+14); ctx.restore();
      });
      netRAF.current = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(netRAF.current);
  }, [isActive]);

  /* waveform */
  useEffect(() => {
    if (!isActive) return;
    const canvas = waveCnvRef.current;
    if (!canvas) return;
    function frame() {
      const ctx = canvas.getContext("2d");
      const [W, H] = [canvas.width, canvas.height];
      const now = Date.now()/1000, bars = Math.floor(W/4);
      ctx.clearRect(0,0,W,H);
      for (let i=0;i<bars;i++) {
        const f = Math.sin(now*3.1+i*0.25)*0.28 + Math.sin(now*1.7+i*0.41)*0.22 + Math.sin(now*5.3+i*0.09)*0.12 + 0.32;
        const bH = Math.max(2, f*H*0.86);
        ctx.fillStyle = `rgba(110,231,183,${0.1+f*0.28})`;
        ctx.fillRect(i*4+0.5, (H-bH)/2, 2.5, bH);
      }
      waveRAF.current = requestAnimationFrame(frame);
    }
    frame();
    return () => cancelAnimationFrame(waveRAF.current);
  }, [isActive]);

  /* log feed */
  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => {
      const e = SIM_LOGS[logIdx.current % SIM_LOGS.length]; logIdx.current++;
      setSimLogs(p => [...p.slice(-30), { ...e, id: logIdx.current }]);
    }, 370);
    return () => clearInterval(iv);
  }, [isActive]);

  useEffect(() => { if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight; }, [simLogs]);

  const lc = c => c==="green"?"rgba(110,231,183,0.72)":c==="amber"?"rgba(232,184,75,0.65)":"rgba(226,226,226,0.38)";

  const canvasMinH = isMobile ? 240 : 380;

  return (
    <section style={{ padding: isMobile ? "72px 20px" : "100px 52px", borderTop: "1px solid #1A1A1A" }}>
      <SectionLabel>── SYSTEM OBSERVABILITY ──</SectionLabel>
      <SectionTitle>LIVE PROTOCOL SIMULATION</SectionTitle>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85 }}
        style={{ maxWidth: 1020, margin: "0 auto", border: "1px solid #1C1C1C", background: "#050505" }}>

        {/* title bar */}
        <div style={{ borderBottom: "1px solid #141414", padding: "10px 18px", display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.015)" }}>
          {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:"#1E1E1E" }} />)}
          <span style={{ marginLeft:10,fontFamily:"'DM Mono',monospace",fontSize:8,color:"#242424",letterSpacing:"0.2em" }}>[AX-01] INTAKE UNIT / PROTOCOL SIMULATION / 2026</span>
          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:18 }}>
            <AnimatePresence>
              {isActive && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <StatusDot color="#e84b4b" size={5} />
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:"#3A3A3A",letterSpacing:"0.2em" }}>LIVE</span>
                </motion.div>
              )}
            </AnimatePresence>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:"#222",letterSpacing:"0.18em" }}>{isActive?"EXECUTING":"STANDBY"}</span>
          </div>
        </div>

        {/* body */}
        <div style={{ display:"flex",flexDirection: isMobile ? "column" : "row", minHeight: canvasMinH }}>

          {/* canvas panel */}
          <div ref={cnvContRef} style={{ flex:1,position:"relative",borderRight: isMobile ? "none" : "1px solid #141414",borderBottom: isMobile ? "1px solid #141414" : "none",background:"#050505",overflow:"hidden",minHeight:canvasMinH }}>
            <canvas ref={cnvRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%" }} />
            <div style={{ position:"absolute",inset:0,zIndex:4,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.14) 2px,rgba(0,0,0,0.14) 4px)" }} />
            <div style={{ position:"absolute",inset:0,zIndex:4,pointerEvents:"none",background:"radial-gradient(ellipse at 50% 50%,transparent 48%,rgba(0,0,0,0.6) 100%)" }} />
            <div style={{ position:"absolute",left:0,right:0,height:24,zIndex:5,pointerEvents:"none",background:"linear-gradient(180deg,transparent,rgba(255,255,255,0.012),transparent)",animation:"scan 11s linear infinite" }} />
            {[{top:12,left:12,borderTop:"1px solid #1E1E1E",borderLeft:"1px solid #1E1E1E"},{top:12,right:12,borderTop:"1px solid #1E1E1E",borderRight:"1px solid #1E1E1E"},{bottom:12,left:12,borderBottom:"1px solid #1E1E1E",borderLeft:"1px solid #1E1E1E"},{bottom:12,right:12,borderBottom:"1px solid #1E1E1E",borderRight:"1px solid #1E1E1E"}].map((s,i)=>(
              <div key={i} style={{ position:"absolute",width:14,height:14,zIndex:6,...s }} />
            ))}

            <AnimatePresence>
              {isScanning && (
                <>
                  <motion.div initial={{ top:"-3px",opacity:0 }} animate={{ top:"104%",opacity:[0,1,1,0.6,0] }} exit={{}} transition={{ duration:0.75,ease:"easeInOut" }}
                    style={{ position:"absolute",left:0,right:0,height:2,zIndex:12,pointerEvents:"none",background:"linear-gradient(90deg,transparent,rgba(110,231,183,0.6) 20%,rgba(110,231,183,1) 50%,rgba(110,231,183,0.6) 80%,transparent)",boxShadow:"0 0 24px 5px rgba(110,231,183,0.35)" }} />
                  <motion.div initial={{ height:"0%",opacity:0.12 }} animate={{ height:"100%",opacity:[0.12,0.07,0] }} exit={{}} transition={{ duration:0.75,ease:"easeInOut" }}
                    style={{ position:"absolute",top:0,left:0,right:0,zIndex:11,pointerEvents:"none",background:"linear-gradient(180deg,rgba(110,231,183,0.06),transparent)" }} />
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isActive && !isScanning && (
                <motion.div initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}
                  style={{ position:"absolute",inset:0,zIndex:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,background:"rgba(5,5,5,0.72)",backdropFilter:"blur(2px)" }}>
                  <svg width="170" height="110" viewBox="0 0 200 130" style={{ opacity:0.16 }}>
                    <line x1="100" y1="62" x2="34"  y2="22"  stroke="#6ee7b7" strokeWidth="0.7" strokeDasharray="3,7"/>
                    <line x1="100" y1="62" x2="166" y2="22"  stroke="#6ee7b7" strokeWidth="0.7" strokeDasharray="3,7"/>
                    <line x1="100" y1="62" x2="100" y2="108" stroke="#6ee7b7" strokeWidth="0.7" strokeDasharray="3,7"/>
                    <circle cx="100" cy="62" r="14" fill="none" stroke="#6ee7b7" strokeWidth="1"/>
                    <circle cx="100" cy="62" r="22" fill="none" stroke="#6ee7b7" strokeWidth="0.4" strokeDasharray="2,5"/>
                    <circle cx="34"  cy="22" r="8"  fill="none" stroke="#6ee7b7" strokeWidth="0.6"/>
                    <circle cx="166" cy="22" r="8"  fill="none" stroke="#6ee7b7" strokeWidth="0.6"/>
                    <circle cx="100" cy="108" r="8" fill="none" stroke="#6ee7b7" strokeWidth="0.6"/>
                  </svg>
                  <motion.button whileHover={{ scale:1.06,borderColor:"rgba(110,231,183,0.5)" }} whileTap={{ scale:0.96 }} onClick={handlePlay}
                    style={{ width:62,height:62,borderRadius:"50%",cursor:"crosshair",border:"1px solid rgba(226,226,226,0.16)",background:"rgba(255,255,255,0.025)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Play size={19} strokeWidth={1} color="rgba(226,226,226,0.65)" fill="rgba(226,226,226,0.65)" style={{ marginLeft:3 }} />
                  </motion.button>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:"#262626",letterSpacing:"0.28em" }}>INITIATE SIMULATION</div>
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ position:"absolute",bottom:12,left:16,zIndex:7,fontFamily:"'DM Mono',monospace",fontSize:7,color:"#1C1C1C",letterSpacing:"0.14em" }}>
              {isActive?"SIM.STATE: ACTIVE":"SIM.STATE: STANDBY"}
            </div>
          </div>

          {/* log panel */}
          <div style={{ width: isMobile ? "100%" : 258, flexShrink:0, background:"#030303", display:"flex", flexDirection:"column", minHeight: isMobile ? 180 : undefined }}>
            <div style={{ borderBottom:"1px solid #0E0E0E",padding:"9px 13px",display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
              <div style={{ width:3,height:3,borderRadius:"50%",background:isActive?"rgba(110,231,183,0.7)":"#1A1A1A" }} />
              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#1C1C1C",letterSpacing:"0.22em" }}>REAL-TIME LOGIC FEED</span>
            </div>
            <div ref={logsRef} style={{ flex:1,overflowY:"auto",padding:"8px 0",maxHeight: isMobile ? 180 : 360 }} className="hide-scroll">
              {!isActive && !isScanning ? (
                <div style={{ padding:"28px 14px",textAlign:"center" }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#161616",letterSpacing:"0.2em",lineHeight:2.8 }}>AWAITING<br/>SIMULATION<br/>TRIGGER...</div>
                </div>
              ) : simLogs.slice(-20).map(log => (
                <motion.div key={log.id} initial={{ opacity:0,x:6 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.18 }}
                  style={{ padding:"2.5px 13px",display:"flex",gap:7,alignItems:"flex-start" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#2A2A2A",letterSpacing:"0.08em",flexShrink:0,lineHeight:1.9 }}>[{log.tag}]</span>
                  <span style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:lc(log.c),letterSpacing:"0.06em",lineHeight:1.9 }}>{log.text}</span>
                </motion.div>
              ))}
            </div>
            <div style={{ borderTop:"1px solid #0E0E0E",padding:"8px 13px",flexShrink:0 }}>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#1A1A1A",letterSpacing:"0.16em" }}>
                {isActive ? `EVENTS: ${logIdx.current}` : "EVENTS: 0"}
              </div>
            </div>
          </div>
        </div>

        {/* waveform */}
        <div style={{ borderTop:"1px solid #141414",height:56,display:"flex",alignItems:"center",padding:"0 18px",gap:14,background:"rgba(0,0,0,0.4)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:7,flexShrink:0 }}>
            <div style={{ width:3,height:3,borderRadius:"50%",background:isActive?"rgba(110,231,183,0.6)":"#181818" }} />
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#1C1C1C",letterSpacing:"0.22em" }}>STREAM</span>
          </div>
          <div ref={waveContRef} style={{ flex:1,height:34 }}>
            <canvas ref={waveCnvRef} style={{ width:"100%",height:"100%" }} />
          </div>
          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#1C1C1C",letterSpacing:"0.18em",flexShrink:0 }}>
            {isActive?"●● PROCESSING":"○○ STANDBY"}
          </span>
        </div>

        {/* caption */}
        <div style={{ borderTop:"1px solid #141414",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.008)",flexWrap:"wrap",gap:10 }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:"#E2E2E2",letterSpacing:"0.14em" }}>[AX-01] INTAKE UNIT: LIVE PROTOCOL SIMULATION</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:7,color:"#282828",letterSpacing:"0.18em",marginTop:3 }}>AXIOM SYSTEMS &nbsp;∙&nbsp; OBSERVABILITY SUITE &nbsp;∙&nbsp; 2026</div>
          </div>
          <AnimatePresence>
            {isActive && (
              <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={handleStop}
                whileHover={{ borderColor:"rgba(232,75,75,0.4)",color:"rgba(232,75,75,0.7)" }}
                style={{ fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.18em",color:"#3A3A3A",border:"1px solid #1A1A1A",background:"transparent",padding:"7px 14px",cursor:"crosshair",transition:"border-color 0.3s,color 0.3s" }}>
                TERMINATE
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   VALIDATION CARDS (staggered entrance)
═══════════════════════════════════════════════ */
function ValidationCard({ v, i }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ background: "rgba(255,255,255,0.018)", y: -2 }}
      style={{ background: "#080808", border: "1px solid #181818", padding: "40px 32px", display: "flex", flexDirection: "column", gap: 28, transition: "background 0.4s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <CheckCircle size={15} strokeWidth={1} color="#6ee7b7" />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#6ee7b7", letterSpacing: "0.2em", border: "1px solid #1a3a2a", padding: "4px 10px", background: "rgba(110,231,183,0.04)" }}>{v.metric}</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: "#686868", letterSpacing: "0.03em", flexGrow: 1, fontStyle: "italic" }}>"{v.quote}"</p>
      <div style={{ borderTop: "1px solid #141414", paddingTop: 18 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#E2E2E2", letterSpacing: "0.16em" }}>{v.author}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#2E2E2E", letterSpacing: "0.18em", marginTop: 5 }}>{v.firm} &nbsp;∙&nbsp; VERIFIED 2026</div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PRICING CARD (alpha glow)
═══════════════════════════════════════════════ */
function PricingCard({ tier, i, onAudit }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: i * 0.15 }}
      style={{ background: tier.highlight ? "rgba(255,255,255,0.022)" : "#080808", border: `1px solid ${tier.highlight ? "#2A2A2A" : "#181818"}`, padding: "44px 34px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {tier.highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#3A3A3A,transparent)" }} />}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: "0.22em", color: tier.highlight ? "#E2E2E2" : "#2E2E2E", border: `1px solid ${tier.highlight ? "#2A2A2A" : "#181818"}`, padding: "4px 10px", background: tier.highlight ? "rgba(255,255,255,0.04)" : "transparent" }}>{tier.tag}</span>
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.14em", marginBottom: 4 }}>{tier.label}</div>
      {tier.slots ? (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 28 }}>
          <StatusDot color={tier.slotColor} size={4} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#6ee7b7", letterSpacing: "0.18em" }}>{tier.slots}</span>
        </div>
      ) : <div style={{ marginBottom: 28 }} />}
      <div style={{ borderTop: "1px solid #141414", borderBottom: "1px solid #141414", padding: "24px 0", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.04em",
            ...(tier.glow ? { textShadow: "0 0 28px rgba(110,231,183,0.35), 0 0 8px rgba(110,231,183,0.2)" } : {}),
          }}>
            {tier.deploy}
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#383838", letterSpacing: "0.2em" }}>{tier.deployLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.04em", color: "#3A3A3A" }}>{tier.monthly}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#282828", letterSpacing: "0.2em" }}>{tier.monthlyLabel}</span>
        </div>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36, flexGrow: 1 }}>
        {tier.features.map((f, fi) => (
          <li key={fi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ChevronRight size={11} color="#2E2E2E" strokeWidth={1} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#484848", letterSpacing: "0.1em" }}>{f}</span>
          </li>
        ))}
      </ul>
      <button className="btn-audit" onClick={onAudit} style={{ width: "100%", textAlign: "center", fontSize: 10 }}>{tier.cta} &nbsp;→</button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   AXIOM CARD
═══════════════════════════════════════════════ */
function AxiomCard({ axiom, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const Icon   = axiom.icon;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: axiom.delay }}
      whileHover={{ background: "rgba(255,255,255,0.022)" }}
      style={{ background: "#080808", padding: "44px 34px", borderRight: index < 2 ? "1px solid #181818" : "none", transition: "background 0.4s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ width: 34, height: 34, border: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} strokeWidth={1} color="#2E2E2E" />
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 54, color: "#141414", letterSpacing: "0.1em", lineHeight: 1 }}>{axiom.numeral}</span>
      </div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.14em", color: "#E2E2E2", marginBottom: 18, lineHeight: 1.25, whiteSpace: "pre-line" }}>{axiom.title}</h3>
      <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.9, color: "#484848", letterSpacing: "0.025em" }}>{axiom.body}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   GOVERNANCE FOOTER
═══════════════════════════════════════════════ */
function GovernanceFooter() {
  return (
    <footer style={{ borderTop: "1px solid #1A1A1A", background: "#050505" }}>
      <div style={{ borderBottom: "1px solid #0E0E0E", padding: "36px 52px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "18px 40px" }}>
        {FOOTER_LINKS.map((link, i) => (
          <a key={i} href={link.href}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#262626", letterSpacing: "0.22em", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, transition: "color 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#3A3A3A"}
            onMouseLeave={e => e.currentTarget.style.color = "#262626"}>
            {link.label}
            <ExternalLink size={8} strokeWidth={1} color="currentColor" />
          </a>
        ))}
      </div>
      <div style={{ padding: "22px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 5, height: 5, background: "#1E1E1E", transform: "rotate(45deg)" }} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: "0.24em", color: "#1E1E1E" }}>AXIOM SYSTEMS</span>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: "#181818", letterSpacing: "0.16em", textAlign: "center" }}>
          © 2026 AXIOM SYSTEMS. ALL RIGHTS RESERVED. SECURE DEPLOYMENT PROTOCOL ACTIVE.
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#1E1E1E" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: "#181818", letterSpacing: "0.14em" }}>AX-SYS-2026</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════ */
export default function AxiomSystems() {
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const openModal = useCallback(() => setModalOpen(true), []);

  return (
    <div style={{ background: "#080808", color: "#E2E2E2", minHeight: "100vh", overflowX: "hidden", fontFamily: "'Barlow','Helvetica Neue',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@200;300;400;500&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { cursor: crosshair; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.017) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.017) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        .btn-audit {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.22em; color: #E2E2E2;
          border: 1px solid rgba(226,226,226,0.18); background: transparent; padding: 15px 38px;
          cursor: crosshair; position: relative; overflow: hidden; transition: border-color 0.35s ease; white-space: nowrap;
        }
        .btn-audit::after { content: ''; position: absolute; inset: 0; background: rgba(226,226,226,0.04); transform: translateX(-101%); transition: transform 0.35s ease; }
        .btn-audit:hover::after { transform: translateX(0); }
        .btn-audit:hover { border-color: rgba(226,226,226,0.44); }
        input, textarea, select { caret-color: #E2E2E2; }
        input::placeholder, textarea::placeholder { color: #282828; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { scrollbar-width: none; }
        @keyframes scan { from { top: -36px; } to { top: 100%; } }
      `}</style>

      <AuditModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── NAV ── */}
      <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid #1A1A1A", background: "rgba(8,8,8,0.93)", backdropFilter: "blur(16px)" }}>
        <div style={{ padding: "14px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, background: "#E2E2E2", transform: "rotate(45deg)" }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: "0.26em" }}>AXIOM SYSTEMS</span>
          </div>
          {!isMobile && (
            <div style={{ flex: 1, overflow: "hidden", maxWidth: 380, display: "flex", justifyContent: "center" }}>
              <GlobalTicker />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <StatusDot />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#2E2E2E", letterSpacing: "0.12em" }}>
              {isMobile ? "NOMINAL" : "SYSTEMS NOMINAL"}
            </span>
          </div>
        </div>
        {!isMobile && (
          <div style={{ borderTop: "1px solid #0E0E0E", padding: "5px 52px", display: "flex", justifyContent: "center" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#1C1C1C", letterSpacing: "0.16em" }}>
              SECURE CHANNEL: ENCRYPTED &nbsp;//&nbsp; REVISION: 2.0.1 &nbsp;//&nbsp; YEAR: 2026
            </span>
          </div>
        )}
      </motion.nav>

      {/* ── HERO ── */}
      <section className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: isMobile ? 80 : 96, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 36, pointerEvents: "none", background: "linear-gradient(180deg,transparent,rgba(255,255,255,0.012),transparent)", animation: "scan 9s linear infinite" }} />
        {!isMobile && [
          ["00.00N / 00.00W",            { top: 110, left: 52   }],
          ["UNIT: AX-001 / CLASS: ALPHA", { top: 110, right: 52  }],
          ["SYS.STATUS: ACTIVE",          { bottom: 52, left: 52  }],
          ["UPTIME: 99.97%",              { bottom: 52, right: 52 }],
        ].map(([label, pos]) => (
          <span key={label} style={{ position: "absolute", ...pos, fontFamily: "'DM Mono', monospace", fontSize: 8, color: "#1E1E1E", letterSpacing: "0.1em" }}>{label}</span>
        ))}
        <div style={{ textAlign: "center", maxWidth: 960, padding: "0 24px", zIndex: 2, position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? 8 : 9, letterSpacing: "0.28em", color: "#2E2E2E", borderBottom: "1px solid #1A1A1A", paddingBottom: 8 }}>
              {isMobile ? "AUTONOMOUS BUSINESS INFRASTRUCTURE · MMXXVI" : "AUTONOMOUS BUSINESS INFRASTRUCTURE &nbsp;∙&nbsp; DIGITAL LABOR UNITS &nbsp;∙&nbsp; MMXXVI"}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.45 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 10.5vw, 148px)", lineHeight: 0.9, letterSpacing: "0.065em", marginBottom: 32 }}>
            THE ARCHITECTURE<br />OF AUTONOMY.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }}
            style={{ fontSize: isMobile ? 14 : 15, fontWeight: 300, lineHeight: 1.8, color: "#484848", maxWidth: 540, margin: "0 auto 48px", letterSpacing: "0.04em" }}>
            Axiom Systems exists to render human inefficiency obsolete — not through automation as a convenience, but through the architecture of Operational Sovereignty as a competitive standard.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}
            style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", alignItems: "center", gap: isMobile ? 16 : 28 }}>
            <button className="btn-audit" onClick={openModal} style={{ width: isMobile ? "100%" : undefined }}>REQUEST SYSTEMS AUDIT</button>
            {!isMobile && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#1E1E1E", letterSpacing: "0.2em" }}>∙&nbsp; LIMITED INTAKE &nbsp;∙</span>}
          </motion.div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        style={{ borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A", display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", padding: `0 ${isMobile?"20px":"52px"}` }}>
        {METRICS.map((m, i) => (
          <div key={i} style={{ textAlign: "center", padding: "26px 12px", borderRight: (isMobile ? i%2<1 : i<3) ? "1px solid #1A1A1A" : "none", borderBottom: isMobile && i<2 ? "1px solid #1A1A1A" : "none" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? 28 : 34, letterSpacing: "0.08em" }}>{m.value}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7.5, color: "#303030", letterSpacing: "0.2em", marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── OBSERVABILITY ── */}
      <ObservabilitySection />

      {/* ── TERMINAL ── */}
      <section style={{ padding: `100px ${isMobile?"20px":"52px"}`, borderTop: "1px solid #1A1A1A" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#282828", letterSpacing: "0.3em", textAlign: "center", marginBottom: 28 }}>
          ── LIVE OPERATIONAL FEED ──
        </motion.div>
        <Terminal />
      </section>

      {/* ── QUOTE ── */}
      <div style={{ borderTop: "1px solid #1A1A1A" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
          style={{ padding: `80px ${isMobile?"24px":"52px"}`, maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "clamp(15px, 2.2vw, 24px)", fontWeight: 200, lineHeight: 1.85, color: "#404040", letterSpacing: "0.04em" }}>
            "We build <span style={{ color: "#E2E2E2", fontWeight: 400 }}>deterministic, self-reinforcing infrastructure</span> that compounds in precision the longer it runs, transforming high-growth firms into organisms that scale without friction and <span style={{ color: "#E2E2E2", fontWeight: 400 }}>execute without variance.</span>"
          </p>
        </motion.div>
      </div>

      {/* ── AXIOMS ── */}
      <section style={{ padding: `96px ${isMobile?"20px":"52px"}`, borderTop: "1px solid #1A1A1A" }}>
        <SectionLabel>── FOUNDATIONAL PRINCIPLES ──</SectionLabel>
        <SectionTitle>THE THREE AXIOMS</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", border: "1px solid #181818", maxWidth: 1080, margin: "0 auto", gap: isMobile ? "1px" : 0 }}>
          {AXIOMS.map((a, i) => <AxiomCard key={i} axiom={a} index={isMobile ? 99 : i} />)}
        </div>
      </section>

      {/* ── VALIDATIONS ── */}
      <section style={{ padding: `100px ${isMobile?"20px":"52px"}`, borderTop: "1px solid #1A1A1A" }}>
        <SectionLabel>── PEER PERFORMANCE VALIDATION ──</SectionLabel>
        <SectionTitle>FIELD INTELLIGENCE</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? "12px" : 1, maxWidth: 1080, margin: "0 auto" }}>
          {VALIDATIONS.map((v, i) => <ValidationCard key={i} v={v} i={i} />)}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: `100px ${isMobile?"20px":"52px"}`, borderTop: "1px solid #1A1A1A" }}>
        <SectionLabel>── CAPITAL ALLOCATION ──</SectionLabel>
        <SectionTitle>SELECT YOUR TIER</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? "12px" : 1, maxWidth: 1080, margin: "0 auto" }}>
          {TIERS.map((t, i) => <PricingCard key={t.id} tier={t} i={i} onAudit={openModal} />)}
        </div>
      </section>

      {/* ── SECURE CHANNEL ── */}
      <section className="grid-bg" style={{ borderTop: "1px solid #1A1A1A", padding: `100px ${isMobile?"24px":"52px"}`, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <SectionLabel>── SECURE CHANNEL ──</SectionLabel>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75, delay: 0.1 }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 5vw, 60px)", letterSpacing: "0.08em", lineHeight: 1.1, marginBottom: 36 }}>
          WE ACCEPT THREE FIRMS<br />PER QUARTER.
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, border: "1px solid #181818", padding: "13px 26px", background: "rgba(255,255,255,0.012)" }}>
            <StatusDot color="#E8B84B" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? 10 : 11, color: "#555", letterSpacing: "0.16em" }}>
              CURRENT STATUS: &nbsp;<span style={{ color: "#E2E2E2" }}>1 / 3 SLOTS REMAINING</span>
            </span>
          </div>
        </motion.div>
        <motion.button initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
          className="btn-audit" onClick={openModal} style={{ padding: "16px 54px", fontSize: 11, width: isMobile ? "100%" : undefined }}>
          REQUEST SYSTEMS AUDIT &nbsp;→
        </motion.button>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, maxWidth: 720, margin: "64px auto 0", border: "1px solid #141414" }}>
          {[["RESPONSE SLA","24 HRS"],["ENCRYPTION","AES-256"],["INTAKE PROTOCOL","SELECTIVE"]].map(([l,v],i)=>(
            <div key={l} style={{ background:"#080808",padding:"20px 12px",textAlign:"center",borderRight:i<2?"1px solid #141414":"none" }}>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:7.5,color:"#2A2A2A",letterSpacing:"0.2em",marginBottom:7 }}>{l}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:"0.12em" }}>{v}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── GOVERNANCE FOOTER ── */}
      <GovernanceFooter />
    </div>
  );
}
