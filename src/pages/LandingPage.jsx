import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Shared";
import { Footer } from "../components/Shared";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CSS = `
/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 40px 80px;position:relative;overflow:hidden;}
.hero-bg{position:absolute;inset:0;pointer-events:none;}
.h-orb{position:absolute;border-radius:50%;filter:blur(110px);}
[data-theme="dark"] .h-orb{opacity:0.09;}
[data-theme="light"] .h-orb{opacity:0.055;}
.ho1{width:700px;height:700px;background:var(--gold);top:-200px;left:-150px;animation:driftOrb 20s ease-in-out infinite alternate;}
.ho2{width:500px;height:500px;background:var(--blue);bottom:-100px;right:-100px;animation:driftOrb2 26s ease-in-out infinite alternate;}
.ho3{width:300px;height:300px;background:var(--teal);top:50%;left:50%;transform:translate(-50%,-50%);animation:driftOrb 15s ease-in-out infinite alternate-reverse;}

.hero-badge{display:inline-flex;align-items:center;gap:7px;background:var(--glow);border:1px solid rgba(201,169,110,0.25);border-radius:100px;padding:7px 16px;font-size:12px;font-weight:600;color:var(--gold);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:28px;animation:fadeUp 0.7s var(--ease) both;}
.hero-badge svg{width:13px;height:13px;}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s ease-in-out infinite;}

.hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,7vw,96px);font-weight:400;line-height:1.02;color:var(--text);margin-bottom:24px;animation:fadeUp 0.7s var(--ease) 0.1s both;letter-spacing:-0.01em;}
.hero h1 em{font-style:italic;color:var(--gold);display:block;}
.hero-sub{font-size:clamp(16px,2vw,19px);color:var(--text2);line-height:1.75;max-width:540px;margin:0 auto 44px;animation:fadeUp 0.7s var(--ease) 0.2s both;}
.hero-actions{display:flex;align-items:center;gap:14px;justify-content:center;flex-wrap:wrap;animation:fadeUp 0.7s var(--ease) 0.3s both;}
.btn-primary{padding:15px 32px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;color:#fff;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s;letter-spacing:0.02em;box-shadow:0 6px 24px var(--glow);display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 36px var(--glow);}
.btn-primary svg{width:16px;height:16px;}
.btn-ghost{padding:15px 32px;background:transparent;border:1px solid var(--border2);border-radius:12px;color:var(--text2);font-family:'Outfit',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);}

.hero-trust{margin-top:52px;animation:fadeUp 0.7s var(--ease) 0.4s both;}
.trust-label{font-size:12px;color:var(--text3);margin-bottom:14px;letter-spacing:0.04em;}
.trust-avatars{display:flex;align-items:center;justify-content:center;gap:0;}
.trust-av{width:36px;height:36px;border-radius:50%;border:2px solid var(--surface);background:linear-gradient(135deg,var(--card2),var(--card));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--gold);margin-left:-8px;}
.trust-av:first-child{margin-left:0;}
.trust-count{margin-left:12px;font-size:13px;font-weight:600;color:var(--text2);}
.trust-stars{display:flex;gap:2px;color:var(--gold);font-size:12px;margin-left:6px;}

.hero-preview{margin-top:64px;animation:fadeUp 0.9s var(--ease) 0.5s both;position:relative;}
.preview-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:50%;background:var(--gold);filter:blur(80px);opacity:0.06;pointer-events:none;}
.preview-window{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:0;overflow:hidden;box-shadow:0 32px 80px var(--shadow),0 0 0 1px var(--border);max-width:680px;margin:0 auto;}
.preview-bar{background:var(--card);padding:14px 18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);}
.preview-dots{display:flex;gap:6px;}
.preview-dot{width:10px;height:10px;border-radius:50%;}
.preview-title{font-size:13px;color:var(--text3);margin:0 auto;}
.preview-body{padding:24px;display:flex;flex-direction:column;gap:14px;}
.prev-msg{display:flex;gap:10px;max-width:85%;}
.prev-msg.u{align-self:flex-end;flex-direction:row-reverse;}
.prev-av{width:28px;height:28px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;}
.prev-av.ai{background:linear-gradient(135deg,var(--gold),var(--gold2));}
.prev-av.ai svg{width:13px;height:13px;stroke:#fff;}
.prev-av.u{background:var(--ubub);color:var(--gold);border:1px solid var(--border2);}
.prev-bub{padding:11px 15px;border-radius:12px;font-size:13px;line-height:1.65;color:var(--text);}
.prev-msg.ai .prev-bub{background:var(--aibub);border:1px solid var(--border);border-radius:3px 12px 12px 12px;}
.prev-msg.u .prev-bub{background:var(--ubub);border:1px solid var(--border2);border-radius:12px 3px 12px 12px;}
.prev-typing{display:flex;gap:4px;align-items:center;padding:11px 15px;background:var(--aibub);border:1px solid var(--border);border-radius:3px 12px 12px 12px;}
.prev-t{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:typing 1.4s ease-in-out infinite;}
.prev-t:nth-child(2){animation-delay:0.2s;}
.prev-t:nth-child(3){animation-delay:0.4s;}

/* ── STATS ── */
.stats-band{padding:40px 80px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;}
.stat-item{text-align:center;padding:20px;border-right:1px solid var(--border);}
.stat-item:last-child{border-right:none;}
.stat-num{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;color:var(--gold);line-height:1;margin-bottom:6px;animation:countUp 0.7s var(--ease) both;}
.stat-lbl{font-size:13px;color:var(--text3);}

/* ── FEATURES ── */
.section{padding:100px 80px;}
.section-tag{display:inline-flex;align-items:center;gap:6px;background:var(--glow);border:1px solid rgba(201,169,110,0.2);border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;}
.section-tag svg{width:12px;height:12px;}
.section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4vw,54px);font-weight:400;color:var(--text);line-height:1.1;margin-bottom:16px;}
.section-title em{font-style:italic;color:var(--gold);}
.section-sub{font-size:16px;color:var(--text2);line-height:1.7;max-width:520px;margin-bottom:60px;}

.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.feat-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px;position:relative;overflow:hidden;transition:all 0.3s var(--ease);cursor:default;}
.feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent);opacity:0;transition:opacity 0.25s;}
.feat-card:hover{transform:translateY(-4px);border-color:var(--border2);box-shadow:0 16px 40px var(--shadow);}
.feat-card:hover::before{opacity:1;}
.feat-icon{width:44px;height:44px;border-radius:12px;background:var(--glow);border:1px solid rgba(201,169,110,0.2);display:flex;align-items:center;justify-content:center;margin-bottom:18px;}
.feat-icon svg{width:20px;height:20px;color:var(--gold);}
.feat-title{font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px;}
.feat-desc{font-size:13px;color:var(--text2);line-height:1.65;}

/* ── HOW IT WORKS ── */
.how-section{padding:80px 80px;background:var(--surface);}
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;margin-top:60px;position:relative;}
.steps-grid::before{content:'';position:absolute;top:28px;left:calc(16.66% + 20px);right:calc(16.66% + 20px);height:1px;background:linear-gradient(90deg,var(--gold),var(--teal),var(--blue));opacity:0.3;}
.step{text-align:center;padding:0 20px;}
.step-num{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#fff;font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 6px 20px var(--glow);}
.step-title{font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px;}
.step-desc{font-size:13px;color:var(--text2);line-height:1.65;}

/* ── TESTIMONIALS ── */
.test-section{padding:100px 80px;overflow:hidden;}
.test-scroll{display:flex;gap:20px;margin-top:50px;animation:scrollLeft 30s linear infinite;}
.test-scroll:hover{animation-play-state:paused;}
@keyframes scrollLeft{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.test-track{display:flex;gap:20px;}
.test-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px;min-width:320px;max-width:320px;flex-shrink:0;position:relative;}
.test-quote{font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.7;color:var(--text2);margin-bottom:20px;font-style:italic;}
.test-author{display:flex;align-items:center;gap:10px;}
.test-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--card2),var(--card));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--gold);border:1px solid var(--border2);}
.test-name{font-size:13px;font-weight:600;color:var(--text);}
.test-loc{font-size:11px;color:var(--text3);}
.test-stars{display:flex;gap:2px;margin-bottom:14px;}
.test-stars svg{width:13px;height:13px;color:var(--gold);}

/* ── PRICING ── */
.price-section{padding:100px 80px;background:var(--surface);}
.price-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:860px;margin:60px auto 0;}
.price-card{background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:36px;position:relative;overflow:hidden;transition:all 0.3s;}
.price-card.featured{background:linear-gradient(135deg,var(--card),var(--card2));border-color:var(--gold);box-shadow:0 20px 60px var(--glow);}
.price-card.featured::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold2));}
.price-badge{display:inline-block;background:linear-gradient(90deg,var(--gold),var(--gold2));color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;}
.price-name{font-size:14px;font-weight:600;color:var(--text2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;}
.price-amount{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:400;color:var(--text);line-height:1;margin-bottom:4px;}
.price-amount sup{font-size:22px;vertical-align:super;}
.price-period{font-size:13px;color:var(--text3);margin-bottom:28px;}
.price-features{margin-bottom:28px;}
.price-feat{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);margin-bottom:10px;}
.price-feat svg{width:15px;height:15px;color:var(--gold);flex-shrink:0;}
.price-btn{width:100%;padding:13px;border-radius:11px;border:none;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em;}
.price-btn.primary{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#fff;box-shadow:0 4px 16px var(--glow);}
.price-btn.primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--glow);}
.price-btn.ghost{background:transparent;color:var(--text2);border:1px solid var(--border2);}
.price-btn.ghost:hover{border-color:var(--gold);color:var(--gold);}

/* ── CTA ── */
.cta-section{padding:100px 80px;text-align:center;position:relative;overflow:hidden;}
.cta-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,5vw,68px);font-weight:400;color:var(--text);margin-bottom:20px;line-height:1.05;}
.cta-section h2 em{font-style:italic;color:var(--gold);}
.cta-section p{font-size:17px;color:var(--text2);margin-bottom:40px;line-height:1.7;max-width:500px;margin-left:auto;margin-right:auto;}
.cta-note{font-size:12px;color:var(--text3);margin-top:14px;}

/* RESPONSIVE */
@media(max-width:900px){
  .stats-band{padding:28px 24px;}.stats-grid{grid-template-columns:repeat(2,1fr);}
  .section{padding:70px 28px;}.feat-grid{grid-template-columns:1fr;}
  .how-section{padding:60px 28px;}.steps-grid{grid-template-columns:1fr;}.steps-grid::before{display:none;}
  .test-section{padding:70px 0;}.test-section .section-tag,.test-section .section-title,.test-section .section-sub{padding:0 28px;}
  .price-section{padding:70px 28px;}.price-grid{grid-template-columns:1fr;}
  .cta-section{padding:70px 28px;}
}
@media(max-width:600px){
  .hero{padding:100px 24px 60px;}.hero h1{font-size:42px;}.hero-actions{flex-direction:column;align-items:stretch;}
  .btn-primary,.btn-ghost{justify-content:center;}
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FEATURES = [
  { icon: "brain", title: "Emotionally Intelligent AI", desc: "Solace picks up on nuance — not just what you say, but how you feel. Every response is tailored to your emotional state." },
  { icon: "chat", title: "Natural Conversation", desc: "Talk like you would with a close friend. No scripts, no menus, no robotic responses. Just honest, warm dialogue." },
  { icon: "shield", title: "Completely Private", desc: "Your conversations are yours alone. We never sell your data. Everything is encrypted and treated with the utmost care." },
  { icon: "trend", title: "Mood Tracking", desc: "Log how you feel each day and see patterns over time. Understand yourself better with weekly mood insights and charts." },
  { icon: "clock", title: "Available 24/7", desc: "3am panic attack? Sunday evening loneliness? Solace is always there — no appointments, no waiting rooms." },
  { icon: "globe", title: "Works Worldwide", desc: "Accessible from any device, anywhere in the world. Available in multiple languages to serve a global audience." },
];

const STEPS = [
  { n: "01", title: "Create your profile", desc: "Tell us your name and choose your preferred experience. No lengthy sign-up forms." },
  { n: "02", title: "Share how you feel", desc: "Type freely, pick a mood, or use a starter prompt. Solace adapts to however you want to open up." },
  { n: "03", title: "Feel heard & lighter", desc: "Receive genuine, thoughtful responses that validate your feelings and help you move forward." },
];

const TESTIMONIALS = [
  { q: "I never believed an AI could make me feel this understood. After a hard breakup, Solace helped me process things I couldn't talk to anyone about.", name: "Amara O.", loc: "Lagos, Nigeria", init: "A" },
  { q: "The 3am conversations when I can't sleep have genuinely changed how I manage my anxiety. It's like having a therapist in my pocket.", name: "James R.", loc: "London, UK", init: "J" },
  { q: "I was skeptical. Now I can't imagine not having it. It remembers our conversations and actually follows up on things I've shared.", name: "Priya M.", loc: "Mumbai, India", init: "P" },
  { q: "As someone who struggles to open up, the non-judgmental nature of Solace made me feel safe. It changed how I see myself.", name: "Carlos V.", loc: "São Paulo, Brazil", init: "C" },
  { q: "My therapist even said it's a great complement to our sessions. I process so much between appointments now.", name: "Sophie L.", loc: "Paris, France", init: "S" },
  { q: "The mood tracker alone is worth it. Seeing my patterns helped me realize what was actually affecting my mental health.", name: "David K.", loc: "Nairobi, Kenya", init: "D" },
];

const FREE_FEATURES = ["10 conversations per day", "Mood check-ins", "Daily affirmations", "Basic conversation history"];
const PRO_FEATURES = ["Unlimited conversations", "Full mood history & charts", "Memory across all sessions", "Priority response speed", "Multiple AI personas", "Export your insights", "Early access to new features"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED COUNTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 2000, steps = 60;
        let i = 0;
        const inc = target / steps;
        const t = setInterval(() => {
          i++; setCount(Math.min(Math.round(inc * i), target));
          if (i >= steps) clearInterval(t);
        }, dur / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL REVEAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `all 0.7s var(--ease) ${delay}ms` }}>
      {children}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function LandingPage() {
  const [previewStep, setPreviewStep] = useState(0);

  // Animate the preview chat
  useEffect(() => {
    const t = setInterval(() => setPreviewStep(s => (s + 1) % 4), 2800);
    return () => clearInterval(t);
  }, []);

  const previewMsgs = [
    { role: "user", text: "I've been feeling really anxious lately and I don't know why..." },
    { role: "ai", text: "That sounds really exhausting — anxiety without a clear cause can feel even more unsettling. You're not alone in this. Can you tell me a bit more about when it usually comes on?" },
    { role: "user", text: "Mostly at night. I just can't stop my thoughts." },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ paddingTop: 68 }}>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-bg">
            <div className="h-orb ho1" />
            <div className="h-orb ho2" />
            <div className="h-orb ho3" />
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              <span>Now available worldwide</span>
            </div>
            <h1>You deserve to be<em>truly heard.</em></h1>
            <p className="hero-sub">Solace is an AI companion built to help you process difficult emotions, find calm, and feel understood — any time, any day.</p>
            <div className="hero-actions">
              <Link to="/app" className="btn-primary">
                Start talking — it's free <Icons.arrow style={{ width: 16, height: 16 }} />
              </Link>
              <Link to="/about" className="btn-ghost">Learn how it works</Link>
            </div>
            <div className="hero-trust">
              <p className="trust-label">Trusted by people in 40+ countries</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="trust-avatars">
                  {["A","J","M","P","S","K"].map((l, i) => (
                    <div className="trust-av" key={i} style={{ zIndex: 6 - i }}>{l}</div>
                  ))}
                </div>
                <span className="trust-count">12,000+ people</span>
                <div className="trust-stars">
                  {[1,2,3,4,5].map(i => <Icons.star key={i} style={{ width: 13, height: 13 }} />)}
                </div>
              </div>
            </div>

            <div className="hero-preview">
              <div className="preview-glow" />
              <div className="preview-window">
                <div className="preview-bar">
                  <div className="preview-dots">
                    <div className="preview-dot" style={{ background: "#ff5f57" }} />
                    <div className="preview-dot" style={{ background: "#febc2e" }} />
                    <div className="preview-dot" style={{ background: "#28c840" }} />
                  </div>
                  <span className="preview-title">Solace — Private Conversation</span>
                </div>
                <div className="preview-body">
                  {previewMsgs.slice(0, previewStep + 1).map((m, i) => (
                    <div key={i} className={`prev-msg ${m.role === "user" ? "u" : "ai"}`} style={{ animation: "fadeUp 0.4s var(--ease) both" }}>
                      <div className={`prev-av ${m.role}`}>{m.role === "ai" ? <Icons.heart style={{ width: 13, height: 13 }} /> : "Y"}</div>
                      <div className="prev-bub">{m.text}</div>
                    </div>
                  ))}
                  {previewStep >= 3 && (
                    <div className="prev-msg ai" style={{ animation: "fadeUp 0.4s var(--ease) both" }}>
                      <div className="prev-av ai"><Icons.heart style={{ width: 13, height: 13 }} /></div>
                      <div className="prev-typing"><div className="prev-t" /><div className="prev-t" /><div className="prev-t" /></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-band">
          <div className="stats-grid">
            {[
              { n: 12000, s: "+", l: "People helped" },
              { n: 94, s: "%", l: "Feel less alone" },
              { n: 40, s: "+", l: "Countries reached" },
              { n: 4.9, s: "/5", l: "Average rating" },
            ].map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-num"><Counter target={s.n} suffix={s.s} /></div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="section" id="features">
          <Reveal>
            <div className="section-tag"><Icons.sparkle style={{ width: 12, height: 12 }} /> Features</div>
            <h2 className="section-title">Everything you need to feel<em>supported.</em></h2>
            <p className="section-sub">Solace combines emotional intelligence with thoughtful design to give you a safe space that actually helps.</p>
          </Reveal>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="feat-card">
                  <div className="feat-icon">{Icons[f.icon] ? Icons[f.icon]({ style: { width: 20, height: 20 } }) : null}</div>
                  <div className="feat-title">{f.title}</div>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="how-section">
          <Reveal style={{ textAlign: "center" }}>
            <div className="section-tag" style={{ margin: "0 auto 20px" }}><Icons.sparkle style={{ width: 12, height: 12 }} /> How it works</div>
            <h2 className="section-title" style={{ textAlign: "center" }}>Simple as a <em>conversation.</em></h2>
          </Reveal>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="step">
                  <div className="step-num">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="test-section">
          <div style={{ padding: "0 80px", marginBottom: 0 }}>
            <Reveal>
              <div className="section-tag"><Icons.quote style={{ width: 12, height: 12 }} /> Testimonials</div>
              <h2 className="section-title">People whose lives <em>changed.</em></h2>
            </Reveal>
          </div>
          <div style={{ overflow: "hidden", marginTop: 48 }}>
            <div className="test-scroll">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div className="test-card" key={i}>
                  <div className="test-stars">{[1,2,3,4,5].map(j => <Icons.star key={j} style={{ width: 13, height: 13 }} />)}</div>
                  <p className="test-quote">"{t.q}"</p>
                  <div className="test-author">
                    <div className="test-av">{t.init}</div>
                    <div><div className="test-name">{t.name}</div><div className="test-loc">{t.loc}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="price-section" id="pricing">
          <div style={{ textAlign: "center" }}>
            <Reveal>
              <div className="section-tag" style={{ margin: "0 auto 20px" }}><Icons.sparkle style={{ width: 12, height: 12 }} /> Pricing</div>
              <h2 className="section-title">Start free. <em>Upgrade when ready.</em></h2>
              <p className="section-sub" style={{ textAlign: "center", margin: "0 auto 0" }}>No hidden fees. Cancel any time. Payments processed securely worldwide.</p>
            </Reveal>
          </div>
          <div className="price-grid">
            <Reveal delay={0}>
              <div className="price-card">
                <div className="price-name">Free</div>
                <div className="price-amount"><sup></sup>$0</div>
                <div className="price-period">Forever free</div>
                <div className="price-features">
                  {FREE_FEATURES.map((f, i) => (
                    <div className="price-feat" key={i}><Icons.check style={{ width: 15, height: 15 }} />{f}</div>
                  ))}
                </div>
                <Link to="/app"><button className="price-btn ghost">Get started</button></Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="price-card featured">
                <div className="price-badge">Most Popular</div>
                <div className="price-name">Premium</div>
                <div className="price-amount"><sup>$</sup>9<sup style={{ fontSize: 22 }}>.99</sup></div>
                <div className="price-period">per month · cancel any time</div>
                <div className="price-features">
                  {PRO_FEATURES.map((f, i) => (
                    <div className="price-feat" key={i}><Icons.check style={{ width: 15, height: 15 }} />{f}</div>
                  ))}
                </div>
                <button className="price-btn primary" onClick={() => window.open("YOUR_LEMONSQUEEZY_CHECKOUT_URL", "_blank")}>
                  Upgrade to Premium
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="h-orb" style={{ width: 600, height: 600, background: "var(--gold)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.04, position: "absolute", borderRadius: "50%", filter: "blur(100px)" }} />
          <Reveal style={{ position: "relative", zIndex: 2 }}>
            <h2>You don't have to carry <em>this alone.</em></h2>
            <p>Thousands of people have already found their calm. Take the first step — it takes 30 seconds.</p>
            <Link to="/app" className="btn-primary" style={{ display: "inline-flex" }}>
              Start your free conversation <Icons.arrow style={{ width: 16, height: 16 }} />
            </Link>
            <p className="cta-note">No credit card required · Available in 40+ countries</p>
          </Reveal>
        </section>

        <Footer />
      </div>
    </>
  );
}
