import { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME CONTEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ThemeCtx = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("solace_theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("solace_theme", theme);
  }, [theme]);
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => useContext(ThemeCtx);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SVG ICONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const Icons = {
  heart: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" fill="none" strokeWidth="1.7"/></svg>,
  moon: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  sun: (p) => <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="5" stroke="currentColor" fill="none" strokeWidth="1.8"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.8"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.8"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.8"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.8"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.8"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.8"/></svg>,
  send: (p) => <svg viewBox="0 0 24 24" {...p}><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" fill="none" strokeWidth="2"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" {...p}><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.8"/></svg>,
  close: (p) => <svg viewBox="0 0 24 24" {...p}><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.8"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8"/></svg>,
  arrow: (p) => <svg viewBox="0 0 24 24" {...p}><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8"/><polyline points="12 5 19 12 12 19" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12" stroke="currentColor" fill="none" strokeWidth="2"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" fill="currentColor" strokeWidth="1"/></svg>,
  shield: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  sparkle: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" fill="none" strokeWidth="1.6"/></svg>,
  chat: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  trend: (p) => <svg viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" fill="none" strokeWidth="1.8"/><polyline points="17 6 23 6 23 12" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="1.8"/><polyline points="12 6 12 12 16 14" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  lock: (p) => <svg viewBox="0 0 24 24" {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" fill="none" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  globe: (p) => <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="1.8"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" fill="none" strokeWidth="1.8"/></svg>,
  brain: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.19A2.5 2.5 0 0 1 9.5 2" stroke="currentColor" fill="none" strokeWidth="1.6"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3.19A2.5 2.5 0 0 0 14.5 2" stroke="currentColor" fill="none" strokeWidth="1.6"/></svg>,
  quote: (p) => <svg viewBox="0 0 24 24" {...p}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke="currentColor" fill="none" strokeWidth="1.6"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke="currentColor" fill="none" strokeWidth="1.6"/></svg>,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const navCss = `
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 48px;height:68px;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s var(--ease);}
.nav.scrolled{background:var(--surface);border-bottom:1px solid var(--border);backdrop-filter:blur(20px);}
.nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);}
.nav-mark{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px var(--glow);}
.nav-mark svg{width:16px;height:16px;}
.nav-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;letter-spacing:0.03em;}
.nav-name em{font-style:normal;color:var(--gold);}
.nav-links{display:flex;align-items:center;gap:4px;}
.nav-link{padding:8px 14px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;color:var(--text2);transition:all 0.2s;letter-spacing:0.01em;}
.nav-link:hover{color:var(--text);background:var(--card);}
.nav-link.active{color:var(--gold);}
.nav-r{display:flex;align-items:center;gap:8px;}
.nav-ib{width:34px;height:34px;border-radius:9px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all 0.2s;}
.nav-ib:hover{border-color:var(--border2);color:var(--text);background:var(--card);}
.nav-ib svg{width:15px;height:15px;}
.nav-cta{padding:9px 20px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:9px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em;box-shadow:0 3px 12px var(--glow);}
.nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px var(--glow);}
.mob-menu{display:none;}
.mob-nav{display:none;position:fixed;inset:0;background:var(--surface);z-index:99;padding:80px 32px 32px;flex-direction:column;gap:8px;}
.mob-nav.open{display:flex;}
.mob-link{padding:14px 16px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:500;color:var(--text2);transition:all 0.2s;border:1px solid transparent;}
.mob-link:hover{color:var(--text);border-color:var(--border);}
@media(max-width:768px){
  .nav{padding:0 20px;}
  .nav-links{display:none;}
  .mob-menu{display:flex;}
  .nav-cta{display:none;}
}
`;

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/app", label: "Open App" },
  ];

  return (
    <>
      <style>{navCss}</style>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="nav-brand">
          <div className="nav-mark"><Icons.heart style={{width:16,height:16,stroke:"#fff"}}/></div>
          <span className="nav-name">Sol<em>ace</em></span>
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${loc.pathname === l.to ? "active" : ""}`}>{l.label}</Link>
          ))}
        </div>
        <div className="nav-r">
          <button className="nav-ib" onClick={toggle}>{theme === "dark" ? <Icons.sun style={{width:15,height:15}}/> : <Icons.moon style={{width:15,height:15}}/>}</button>
          <Link to="/app"><button className="nav-cta">Start for free</button></Link>
          <button className="nav-ib mob-menu" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <Icons.close style={{width:15,height:15}}/> : <Icons.menu style={{width:15,height:15}}/>}
          </button>
        </div>
      </nav>
      <div className={`mob-nav ${mobileOpen ? "open" : ""}`}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className="mob-link" onClick={() => setMobileOpen(false)}>{l.label}</Link>
        ))}
        <Link to="/app" style={{marginTop:12}}>
          <button className="nav-cta" style={{width:"100%",padding:"14px"}} onClick={() => setMobileOpen(false)}>Start for free</button>
        </Link>
      </div>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FOOTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const footCss = `
.footer{background:var(--surface);border-top:1px solid var(--border);padding:60px 80px 40px;}
.ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;}
.ft-brand-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--text);margin-bottom:10px;}
.ft-brand-name em{font-style:normal;color:var(--gold);}
.ft-tagline{font-size:13px;color:var(--text3);line-height:1.7;max-width:240px;margin-bottom:18px;}
.ft-col h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:14px;}
.ft-col a{display:block;font-size:13px;color:var(--text2);text-decoration:none;margin-bottom:9px;transition:color 0.2s;}
.ft-col a:hover{color:var(--gold);}
.ft-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:28px;border-top:1px solid var(--border);}
.ft-copy{font-size:12px;color:var(--text3);}
.ft-badge{font-size:11px;color:var(--text3);display:flex;align-items:center;gap:5px;}
@media(max-width:768px){.footer{padding:40px 24px 28px;}.ft-grid{grid-template-columns:1fr 1fr;gap:28px;}.ft-bottom{flex-direction:column;gap:12px;text-align:center;}}
`;

export function Footer() {
  return (
    <>
      <style>{footCss}</style>
      <footer className="footer">
        <div className="ft-grid">
          <div>
            <div className="ft-brand-name">Sol<em>ace</em></div>
            <p className="ft-tagline">A private, compassionate AI companion that helps you process emotions and find calm — any time of day.</p>
          </div>
          <div className="ft-col">
            <h4>Product</h4>
            <Link to="/app">Open App</Link>
            <Link to="/#features">Features</Link>
            <Link to="/#pricing">Pricing</Link>
          </div>
          <div className="ft-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="ft-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Crisis Resources</a>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy">© 2025 Solace. All rights reserved.</span>
          <span className="ft-badge"><Icons.shield style={{width:12,height:12}}/> Your conversations are private & secure</span>
        </div>
      </footer>
    </>
  );
}
