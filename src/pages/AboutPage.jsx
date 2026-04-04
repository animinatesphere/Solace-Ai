import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icons, Footer } from "../components/Shared";

const CSS = `
.about-hero{min-height:70vh;display:flex;align-items:center;padding:120px 80px 80px;position:relative;overflow:hidden;}
.ab-orb{position:absolute;border-radius:50%;filter:blur(110px);pointer-events:none;}
[data-theme="dark"] .ab-orb{opacity:0.08;}
[data-theme="light"] .ab-orb{opacity:0.05;}
.ab-o1{width:500px;height:500px;background:var(--gold);top:-100px;right:-80px;animation:driftOrb 18s ease-in-out infinite alternate;}
.ab-o2{width:350px;height:350px;background:var(--teal);bottom:-50px;left:100px;animation:driftOrb2 22s ease-in-out infinite alternate;}
.ab-hero-content{max-width:680px;position:relative;z-index:2;}
.ab-tag{display:inline-flex;align-items:center;gap:6px;background:var(--glow);border:1px solid rgba(201,169,110,0.25);border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;}
.ab-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,5.5vw,78px);font-weight:400;color:var(--text);line-height:1.05;margin-bottom:20px;}
.ab-h1 em{font-style:italic;color:var(--gold);}
.ab-sub{font-size:17px;color:var(--text2);line-height:1.75;max-width:540px;margin-bottom:36px;}
.ab-line{width:60px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:2px;margin-bottom:32px;}

/* Mission */
.mission-section{padding:80px 80px;background:var(--surface);}
.mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.mission-text h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.5vw,50px);font-weight:400;line-height:1.1;color:var(--text);margin-bottom:16px;}
.mission-text h2 em{font-style:italic;color:var(--gold);}
.mission-text p{font-size:15px;color:var(--text2);line-height:1.8;margin-bottom:14px;}
.mission-visual{position:relative;}
.mission-card{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:32px;position:relative;overflow:hidden;}
.mission-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--teal));}
.mission-quote{font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--text);line-height:1.65;margin-bottom:16px;}
.mission-attr{font-size:13px;color:var(--text3);}
.mission-floater{position:absolute;top:-16px;right:-16px;width:80px;height:80px;background:var(--glow);border-radius:50%;filter:blur(24px);}

/* Values */
.values-section{padding:80px 80px;}
.values-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.5vw,50px);font-weight:400;color:var(--text);margin-bottom:12px;}
.values-section h2 em{font-style:italic;color:var(--gold);}
.val-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:44px;}
.val-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:26px;display:flex;gap:16px;transition:all 0.25s;}
.val-card:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 8px 24px var(--shadow);}
.val-icon{width:40px;height:40px;border-radius:11px;background:var(--glow);border:1px solid rgba(201,169,110,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.val-icon svg{width:18px;height:18px;color:var(--gold);}
.val-title{font-size:15px;font-weight:600;color:var(--text);margin-bottom:6px;}
.val-desc{font-size:13px;color:var(--text2);line-height:1.6;}

/* Story */
.story-section{padding:80px 80px;background:var(--surface);}
.story-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.5vw,50px);font-weight:400;color:var(--text);margin-bottom:40px;}
.story-section h2 em{font-style:italic;color:var(--gold);}
.timeline{position:relative;padding-left:40px;}
.timeline::before{content:'';position:absolute;left:8px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg,var(--gold),var(--teal),transparent);}
.tl-item{position:relative;margin-bottom:40px;}
.tl-dot{position:absolute;left:-36px;top:6px;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));border:2px solid var(--surface);box-shadow:0 0 0 3px var(--glow);}
.tl-year{font-size:11px;font-weight:700;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;}
.tl-title{font-size:16px;font-weight:600;color:var(--text);margin-bottom:6px;}
.tl-desc{font-size:13px;color:var(--text2);line-height:1.65;}

/* Team */
.team-section{padding:80px 80px;}
.team-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.5vw,50px);font-weight:400;color:var(--text);margin-bottom:8px;}
.team-section h2 em{font-style:italic;color:var(--gold);}
.team-section > p{font-size:15px;color:var(--text2);margin-bottom:48px;line-height:1.7;}
.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.team-card{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px;text-align:center;transition:all 0.25s;overflow:hidden;position:relative;}
.team-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent);opacity:0;transition:opacity 0.2s;}
.team-card:hover{transform:translateY(-4px);box-shadow:0 14px 36px var(--shadow);border-color:var(--border2);}
.team-card:hover::before{opacity:1;}
.team-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--card2),var(--gold));display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--surface);margin:0 auto 16px;border:3px solid var(--border2);}
.team-name{font-size:16px;font-weight:600;color:var(--text);margin-bottom:4px;}
.team-role{font-size:12px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:10px;}
.team-bio{font-size:13px;color:var(--text2);line-height:1.6;}

/* Impact */
.impact-section{padding:80px 80px;background:var(--surface);}
.impact-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.5vw,50px);font-weight:400;color:var(--text);margin-bottom:40px;text-align:center;}
.impact-section h2 em{font-style:italic;color:var(--gold);}
.impact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.impact-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:28px;text-align:center;border-top:2px solid var(--gold);}
.impact-num{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:600;color:var(--gold);line-height:1;margin-bottom:8px;}
.impact-lbl{font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px;}
.impact-sub{font-size:12px;color:var(--text3);}

/* About CTA */
.ab-cta{padding:80px;text-align:center;position:relative;overflow:hidden;}
.ab-cta h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4vw,56px);font-weight:400;color:var(--text);margin-bottom:16px;}
.ab-cta h2 em{font-style:italic;color:var(--gold);}
.ab-cta p{font-size:16px;color:var(--text2);margin-bottom:36px;max-width:460px;margin-left:auto;margin-right:auto;line-height:1.7;}
.ab-btn{padding:14px 32px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;color:#fff;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.25s;letter-spacing:0.02em;box-shadow:0 6px 24px var(--glow);display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.ab-btn:hover{transform:translateY(-3px);box-shadow:0 12px 36px var(--glow);}

@media(max-width:900px){
  .about-hero{padding:100px 24px 60px;}
  .mission-section{padding:60px 24px;}.mission-grid{grid-template-columns:1fr;gap:40px;}
  .values-section{padding:60px 24px;}.val-grid{grid-template-columns:1fr;}
  .story-section{padding:60px 24px;}
  .team-section{padding:60px 24px;}.team-grid{grid-template-columns:1fr 1fr;}
  .impact-section{padding:60px 24px;}.impact-grid{grid-template-columns:1fr;}
  .ab-cta{padding:60px 24px;}
}
@media(max-width:600px){
  .team-grid{grid-template-columns:1fr;}
}
`;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `all 0.7s var(--ease) ${delay}ms` }}>
      {children}
    </div>
  );
}

const VALUES = [
  { icon: "shield", title: "Privacy First", desc: "Your conversations are encrypted and never sold. Your emotional data is yours alone." },
  { icon: "heart", title: "Genuine Empathy", desc: "We designed Solace to listen before speaking, to validate before advising." },
  { icon: "globe", title: "Radical Accessibility", desc: "Mental wellness support shouldn't be a privilege. We're building for everyone, everywhere." },
  { icon: "sparkle", title: "Honest Technology", desc: "Solace is transparent about what it is. We'll never pretend it's human. It's AI — and that's enough." },
  { icon: "lock", title: "Safety Above All", desc: "We have crisis protocols built in. If someone is in danger, Solace connects them with real help." },
  { icon: "brain", title: "Continuous Learning", desc: "We partner with mental health professionals to continuously improve how Solace responds to emotional pain." },
];

const TEAM = [
  { init: "O", name: "Oluwaseun A.", role: "Founder & CEO", bio: "Built Solace after struggling to find accessible emotional support. Passionate about closing the mental health gap in Africa and globally." },
  { init: "N", name: "Nadia K.", role: "Head of AI", bio: "Former NLP researcher with a background in clinical psychology. Designed the empathetic response system at the heart of Solace." },
  { init: "R", name: "Rohan M.", role: "Head of Product", bio: "10 years in consumer apps. Obsessed with creating experiences that feel human, warm, and genuinely useful." },
];

const TIMELINE = [
  { year: "2024", title: "The problem becomes personal", desc: "Our founder hits a mental health wall and can't find affordable, available support. Solace is born from that experience." },
  { year: "2025", title: "First version launched", desc: "We release a simple chatbot. 500 people sign up in the first week. The feedback is overwhelming — 'I finally feel heard.'" },
  { year: "2025", title: "10,000 users in 6 months", desc: "Word of mouth alone drives massive growth. We raise a small seed round to improve the AI and expand the team." },
  { year: "2026", title: "Global expansion", desc: "Solace launches in 40+ countries with multi-language support, Lemon Squeezy payment integration, and a mobile app." },
];

export default function AboutPage() {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ paddingTop: 68 }}>

        {/* HERO */}
        <section className="about-hero">
          <div className="ab-orb ab-o1" />
          <div className="ab-orb ab-o2" />
          <div className="ab-hero-content">
            <div className="ab-tag a-fade-up"><Icons.heart style={{ width: 12, height: 12 }} /> Our story</div>
            <h1 className="ab-h1 a-fade-up d1">We built what we <em>wished existed.</em></h1>
            <div className="ab-line a-fade-up d2" />
            <p className="ab-sub a-fade-up d3">Solace was born from a simple, painful truth: millions of people are carrying enormous emotional weight with nowhere safe to put it. We decided to change that.</p>
            <Link to="/app" className="ab-btn a-fade-up d4">
              Experience Solace <Icons.arrow style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </section>

        {/* MISSION */}
        <section className="mission-section">
          <div className="mission-grid">
            <Reveal>
              <div className="mission-text">
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--glow)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                  <Icons.sparkle style={{ width: 12, height: 12 }} /> Our mission
                </div>
                <h2>To make emotional support <em>available to everyone.</em></h2>
                <p>Therapy is inaccessible for most people — too expensive, too stigmatized, too hard to find. The waitlists are months long. The cost is prohibitive. And many people don't even know where to start.</p>
                <p>Solace isn't a replacement for therapy. It's the friend you can call at midnight, the space you can think out loud without fear of judgment, the companion that shows up every single time.</p>
                <p>We believe everyone deserves to feel heard — regardless of where they live, how much money they have, or how they were raised to think about mental health.</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="mission-visual">
                <div className="mission-card">
                  <div className="mission-floater" />
                  <p className="mission-quote">"The loneliest moment in someone's life is when they are watching their whole world fall apart, and all they can do is stare blankly."</p>
                  <p className="mission-attr">— F. Scott Fitzgerald</p>
                  <div style={{ marginTop: 24, padding: "16px", background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>Solace ensures no one has to stare blankly alone. We are always there.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* VALUES */}
        <section className="values-section">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--glow)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              <Icons.sparkle style={{ width: 12, height: 12 }} /> What we believe
            </div>
            <h2>Our <em>values.</em></h2>
            <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 0, lineHeight: 1.7 }}>These aren't just words on a wall. They guide every decision we make.</p>
          </Reveal>
          <div className="val-grid">
            {VALUES.map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="val-card">
                  <div className="val-icon">{Icons[v.icon]?.({ style: { width: 18, height: 18 } })}</div>
                  <div>
                    <div className="val-title">{v.title}</div>
                    <p className="val-desc">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* STORY / TIMELINE */}
        <section className="story-section">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--glow)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              <Icons.clock style={{ width: 12, height: 12 }} /> Our journey
            </div>
            <h2>How we got <em>here.</em></h2>
          </Reveal>
          <div className="timeline" style={{ marginTop: 40 }}>
            {TIMELINE.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="tl-item">
                  <div className="tl-dot" />
                  <div className="tl-year">{t.year}</div>
                  <div className="tl-title">{t.title}</div>
                  <p className="tl-desc">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="team-section">
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--glow)", border: "1px solid var(--border)", borderRadius: 100, padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>
              <Icons.heart style={{ width: 12, height: 12 }} /> The Builders
            </div>
            <h2 className="section-title">Rooted in <em>empathy.</em></h2>
            <p className="ab-sub">We are a collective of clinicians, engineers, and designers dedicated to making mental health support accessible to all.</p>
          </Reveal>
          <div className="team-grid">
            {TEAM.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="team-card">
                  <div className="team-avatar" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "#fff" }}>{t.init}</div>
                  <div className="team-name">{t.name}</div>
                  <div className="team-role">{t.role}</div>
                  <p className="team-bio">{t.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* IMPACT */}
        <section className="impact-section">
          <Reveal><h2>Our <em>impact.</em></h2></Reveal>
          <div className="impact-grid">
            {[
              { n: "12,000+", l: "People helped", s: "Across 40+ countries worldwide" },
              { n: "94%", l: "Report feeling less alone", s: "After their first 3 conversations" },
              { n: "4.9/5", l: "Average rating", s: "From verified user reviews" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="impact-card">
                  <div className="impact-num">{s.n}</div>
                  <div className="impact-lbl">{s.l}</div>
                  <div className="impact-sub">{s.s}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ab-cta">
          <div style={{ position: "absolute", width: 500, height: 500, background: "var(--gold)", borderRadius: "50%", filter: "blur(100px)", opacity: 0.04, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          <Reveal>
            <h2>Ready to feel <em>better?</em></h2>
            <p>Join thousands of people who have already found their calm. Start your first conversation for free.</p>
            <Link to="/app" className="ab-btn">
              Start talking now <Icons.arrow style={{ width: 16, height: 16 }} />
            </Link>
          </Reveal>
        </section>

        <Footer />
      </div>
    </>
  );
}
