import { useState, useEffect, useRef, useCallback } from "react";
import { Icons, useTheme } from "../components/Shared";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIG — Replace with your real keys
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL = "https://pprbsoonbyksbnausdim.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcmJzb29uYnlrc2JuYXVzZGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzI2NjIsImV4cCI6MjA4ODU0ODY2Mn0.Pngkadr02RFOZboaW3DSKRj7VxoiE4C36Ey4EDGfjl0";
const LEMONSQUEEZY_URL =
  "https://solaceapp.lemonsqueezy.com/checkout/buy/e56a3b6e-b4e3-404b-bd53-ffdc795127db?desc=0";
const TRANSFER_DETAILS = {
  method: "Bank transfer",
  usd: {
    accountHolder: "pelumi daniel adeyemi",
    accountNumber: "211074776626",
    bankName: "Lead Bank",
    countryCode: "US",
    achRouting: "101019644",
    wireRouting: "101019644",
    bankAddress: "1801 Main St., Kansas City, MO 64108",
    accountType: "Checking",
  },
  eur: {
    accountHolder: "pelumi daniel adeyemi",
    accountNumber: "42168391",
    sortCode: "041307",
    swiftCode: "CLJUGB21XXX",
    bankName: "Clear Junction Limited",
    iban: "GB45CLJU04130742168391",
    bankAddress:
      "4th Floor Imperial House, 15 Kingsway, London, United Kingdom, WC2B 6UN",
  },
  reference: "Use your email or username",
  supportEmail: "support@solace-ai.com",
};
// HF_KEY no longer needed — chat uses OpenRouter via Supabase Edge Function

// SQL for Supabase:
// CREATE TABLE conversations (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, user_id text, role text, content text, persona text, created_at timestamptz DEFAULT now());
// CREATE TABLE mood_logs (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, user_id text, mood text, created_at timestamptz DEFAULT now());
// CREATE TABLE journal_entries (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, user_id text, content text, mood text, created_at timestamptz DEFAULT now());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI PERSONAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PERSONAS = {
  solace: {
    name: "Solace",
    desc: "Warm & empathetic",
    system: `You are Solace — a deeply empathetic, warm companion. Speak like a caring best friend. Validate feelings first, ask thoughtful questions, keep responses natural and warm. Never lecture. If someone mentions self-harm, provide the 988 crisis line with care.`,
  },
  sage: {
    name: "Sage",
    desc: "Calm & grounding",
    system: `You are Sage — a calm, grounding presence. You speak slowly and thoughtfully, like a wise elder. You help people find stillness. Use mindfulness-adjacent language, breathing prompts when appropriate, and gentle wisdom. Short, considered responses.`,
  },
  spark: {
    name: "Spark",
    desc: "Uplifting & energetic",
    system: `You are Spark — an uplifting, encouraging companion. You help people find motivation and joy. You're enthusiastic but not overwhelming. You celebrate small wins, reframe challenges, and help people find their strength. Positive but genuine — never toxic positivity.`,
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CSS = `
.app-wrap{display:flex;height:100vh;overflow:hidden;}
/* SIDEBAR */
.app-sb{width:290px;min-width:290px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;transition:all 0.3s;}
.sb-head{padding:20px 18px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.sb-brand{display:flex;align-items:center;gap:8px;}
.sb-bmark{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px var(--glow);}
.sb-bmark svg{width:14px;height:14px;stroke:#fff;}
.sb-bname{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;}
.sb-bname em{font-style:normal;color:var(--gold);}
.sb-ibt{width:30px;height:30px;border-radius:7px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all 0.2s;}
.sb-ibt:hover{border-color:var(--border2);color:var(--text);}
.sb-ibt svg{width:14px;height:14px;}

.sb-tabs{display:flex;gap:2px;padding:12px 12px 0;}
.sb-tab{flex:1;padding:6px 4px;border-radius:6px;border:none;background:transparent;color:var(--text3);font-family:'Outfit',sans-serif;font-size:10px;font-weight:600;cursor:pointer;transition:all 0.2s;text-align:center;letter-spacing:0.06em;text-transform:uppercase;}
.sb-tab.on{background:var(--glow);color:var(--gold);}
.sb-tab:hover:not(.on){background:var(--card);color:var(--text2);}

.sb-body{flex:1;overflow-y:auto;padding:12px;}
.sb-body::-webkit-scrollbar{width:3px;}
.sb-body::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

.ncbt{width:100%;padding:10px 13px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;color:#fff;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.22s;margin-bottom:16px;letter-spacing:0.02em;box-shadow:0 3px 14px var(--glow);}
.ncbt:hover{transform:translateY(-2px);box-shadow:0 6px 22px var(--glow);}
.ncbt svg{width:13px;height:13px;stroke:#fff;}

.slbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);margin-bottom:8px;}

/* Personas */
.persona-list{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
.persona-chip{padding:10px 12px;background:var(--card);border:1px solid var(--border);border-radius:9px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px;}
.persona-chip:hover,.persona-chip.on{border-color:var(--gold);background:var(--glow);}
.persona-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.persona-info{flex:1;}
.persona-name{font-size:13px;font-weight:600;color:var(--text);display:block;}
.persona-desc{font-size:11px;color:var(--text3);}
.persona-check{width:16px;height:16px;color:var(--gold);}

/* Moods */
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px;}
.mchip{padding:8px 9px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all 0.2s;text-align:left;font-family:'Outfit',sans-serif;}
.mchip:hover,.mchip.on{border-color:var(--gold);background:var(--glow);}
.mlbl{font-size:12px;font-weight:500;color:var(--text);display:block;}
.msub{font-size:10px;color:var(--text3);margin-top:1px;display:block;}

/* Affirmation */
.aff{background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--border2);border-radius:12px;padding:13px;margin-bottom:12px;position:relative;overflow:hidden;}
.aff::before{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:var(--glow);border-radius:50%;filter:blur(20px);}
.aff-lbl{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);margin-bottom:6px;font-weight:700;}
.aff-txt{font-family:'Cormorant Garamond',serif;font-size:14px;line-height:1.6;color:var(--text);font-style:italic;}

/* Mood chart */
.mchart{background:var(--card);border:1px solid var(--border);border-radius:11px;padding:12px;margin-bottom:12px;}
.mchart-t{font-size:11px;font-weight:500;color:var(--text2);margin-bottom:8px;}
.mbars{display:flex;align-items:flex-end;gap:4px;height:44px;}
.mbar-w{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end;}
.mbar{width:100%;border-radius:3px 3px 0 0;background:linear-gradient(180deg,var(--gold),var(--gold2));opacity:0.65;min-height:3px;transition:height 0.5s ease;}
.mbar-d{font-size:9px;color:var(--text3);}

/* Journal */
.journal-form{margin-bottom:12px;}
.journal-ta{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;color:var(--text);font-family:'Outfit',sans-serif;font-size:12px;resize:none;outline:none;transition:border-color 0.2s;line-height:1.6;height:80px;}
.journal-ta:focus{border-color:var(--gold);}
.journal-ta::placeholder{color:var(--text3);}
.journal-save{width:100%;padding:8px;background:var(--glow);border:1px solid rgba(201,169,110,0.3);border-radius:8px;color:var(--gold);font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:6px;}
.journal-save:hover{background:var(--gold);color:#fff;}
.journal-entry{background:var(--card);border:1px solid var(--border);border-radius:9px;padding:10px 12px;margin-bottom:6px;}
.je-date{font-size:10px;color:var(--text3);margin-bottom:4px;}
.je-text{font-size:12px;color:var(--text2);line-height:1.55;}

/* History */
.hi{padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.15s;margin-bottom:3px;border:1px solid transparent;}
.hi:hover{background:var(--card);border-color:var(--border);}
.hi-t{font-size:12px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.hi-s{font-size:10px;color:var(--text3);margin-top:2px;}

/* Upgrade */
.sb-ft{padding:12px;border-top:1px solid var(--border);}
.upcard{background:linear-gradient(135deg,rgba(107,159,228,0.1),rgba(91,191,176,0.09));border:1px solid rgba(107,159,228,0.2);border-radius:13px;padding:13px;}
.upbadge{display:inline-block;background:linear-gradient(90deg,var(--blue),var(--teal));color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;}
.upt{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;}
.upd{font-size:11px;color:var(--text2);line-height:1.5;margin-bottom:8px;}
.upbt{width:100%;background:linear-gradient(135deg,var(--blue),var(--teal));border:none;border-radius:8px;padding:9px;color:#fff;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
.upbt:hover{opacity:0.82;transform:translateY(-1px);}
.upbt-alt{width:100%;margin-top:8px;background:transparent;border:1px solid var(--blue);border-radius:8px;padding:9px;color:var(--blue);font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
.upbt-alt:hover{background:rgba(70,156,255,0.08);}
.upill{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--card);border-radius:8px;margin-top:8px;border:1px solid var(--border);}
.uav{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;}
.unm{font-size:12px;font-weight:500;color:var(--text);}
.upl{font-size:10px;color:var(--text3);}
.transfer-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0;}
.transfer-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;}
.transfer-card-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px;}
.transfer-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-top:1px solid rgba(255,255,255,0.05);font-size:12px;color:var(--text2);}
.transfer-row:first-of-type{border-top:none;}
.transfer-row strong{color:var(--text);font-weight:600;}
.paywall-note{font-size:12px;color:var(--text3);margin-top:10px;}

/* MAIN */
.app-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);position:relative;}
.bg-art{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(100px);}
[data-theme="dark"] .orb{opacity:0.07;}
[data-theme="light"] .orb{opacity:0.04;}
.o1{width:500px;height:500px;background:var(--gold);top:-150px;right:-60px;animation:driftOrb 18s ease-in-out infinite alternate;}
.o2{width:340px;height:340px;background:var(--blue);bottom:-80px;left:-40px;animation:driftOrb2 24s ease-in-out infinite alternate;}

.app-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 26px;border-bottom:1px solid var(--border);backdrop-filter:blur(14px);position:relative;z-index:5;}
.hdr-l{display:flex;align-items:center;gap:10px;}
.sav{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px var(--glow);}
.sav svg{width:18px;height:18px;stroke:#fff;}
.hdr-info h2{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--text);}
.hdr-info p{font-size:11px;color:var(--text3);}
.sdot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#4caf82;margin-right:4px;vertical-align:middle;animation:statusPulse 2.5s ease-in-out infinite;}
.hdr-r{display:flex;gap:6px;align-items:center;}
.h-ib{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all 0.2s;}
.h-ib:hover{color:var(--text);border-color:var(--border2);}
.h-ib svg{width:14px;height:14px;}

/* Persona bar */
.persona-bar{display:flex;gap:6px;padding:10px 26px;border-bottom:1px solid var(--border);overflow-x:auto;background:var(--surface);}
.persona-bar::-webkit-scrollbar{display:none;}
.pbar-chip{padding:5px 12px;border-radius:100px;border:1px solid var(--border);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;color:var(--text2);transition:all 0.2s;white-space:nowrap;flex-shrink:0;}
.pbar-chip:hover{border-color:var(--border2);color:var(--text);}
.pbar-chip.on{background:var(--glow);border-color:var(--gold);color:var(--gold);}

/* Messages */
.msgs{flex:1;overflow-y:auto;padding:32px 32px 16px;display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;scroll-behavior:smooth;}
.msgs::-webkit-scrollbar{width:3px;}
.msgs::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

.wlc{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;padding:40px 28px;animation:fadeUp 0.65s ease both;}
.wic{width:70px;height:70px;border-radius:18px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;margin:0 auto 22px;animation:glow 3s ease-in-out infinite;box-shadow:0 0 0 12px var(--glow);}
.wic svg{width:32px;height:32px;stroke:#fff;}
.wlc h1{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,44px);font-weight:400;color:var(--text);margin-bottom:10px;line-height:1.1;}
.wlc h1 em{font-style:italic;color:var(--gold);}
.wlc p{font-size:14px;color:var(--text2);line-height:1.75;max-width:400px;margin-bottom:32px;}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;width:100%;max-width:480px;}
.pcard{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 16px;cursor:pointer;text-align:left;transition:all 0.22s;position:relative;overflow:hidden;}
.pcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent);opacity:0;transition:opacity 0.2s;}
.pcard:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 8px 24px var(--shadow);}
.pcard:hover::after{opacity:1;}
.pc-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:var(--gold);margin-bottom:4px;}
.pc-txt{font-size:12px;color:var(--text2);line-height:1.5;}

.mrow{display:flex;gap:9px;animation:fadeUp 0.3s var(--spring) both;max-width:75%;}
.mrow.user{align-self:flex-end;flex-direction:row-reverse;}
.mrow.ai{align-self:flex-start;}
.mav{width:30px;height:30px;border-radius:8px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;}
.mav.ai{background:linear-gradient(135deg,var(--gold),var(--gold2));}
.mav.ai svg{width:14px;height:14px;stroke:#fff;}
.mav.user{background:var(--ubub);border:1px solid var(--border2);color:var(--gold);}
.bub{padding:12px 16px;border-radius:13px;font-size:14px;line-height:1.78;}
.mrow.ai .bub{background:var(--aibub);border:1px solid var(--border);border-radius:3px 13px 13px 13px;color:var(--text);box-shadow:0 2px 12px var(--shadow);}
.mrow.user .bub{background:var(--ubub);border:1px solid var(--border2);border-radius:13px 3px 13px 13px;color:var(--text);}
.mt{font-size:10px;color:var(--text3);margin-top:3px;}
.mrow.user .mt{text-align:right;}

.reactions{display:flex;gap:4px;margin-top:4px;}
.reaction-btn{padding:2px 8px;border-radius:100px;border:1px solid var(--border);background:transparent;cursor:pointer;font-size:11px;color:var(--text3);transition:all 0.15s;font-family:'Outfit',sans-serif;}
.reaction-btn:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);}
.reaction-btn.on{border-color:var(--gold);color:var(--gold);background:var(--glow);}

.trow{display:flex;gap:9px;align-self:flex-start;}
.tbub{background:var(--aibub);border:1px solid var(--border);border-radius:3px 13px 13px 13px;padding:13px 16px;display:flex;gap:4px;align-items:center;}
.td{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:typing 1.4s ease-in-out infinite;}
.td:nth-child(2){animation-delay:0.2s;}
.td:nth-child(3){animation-delay:0.4s;}

/* Input */
.iz{padding:16px 32px 22px;background:var(--bg);position:relative;z-index:5;border-top:1px solid var(--border);}
.ibox{background:var(--surface);border:1px solid var(--border2);border-radius:15px;padding:10px 12px;display:flex;align-items:flex-end;gap:8px;transition:all 0.2s;box-shadow:0 3px 16px var(--shadow);}
.ibox:focus-within{border-color:var(--gold);box-shadow:0 3px 16px var(--glow);}
.cta{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;resize:none;max-height:120px;line-height:1.6;padding:2px 0;}
.cta::placeholder{color:var(--text3);}
.quick-btns{display:flex;gap:5px;padding:0 2px 8px;}
.qb{padding:4px 10px;border-radius:100px;border:1px solid var(--border);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:11px;color:var(--text3);transition:all 0.15s;white-space:nowrap;}
.qb:hover{border-color:var(--gold);color:var(--gold);background:var(--glow);}
.sbt{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow:0 3px 10px var(--glow);flex-shrink:0;}
.sbt:hover{transform:translateY(-1px);box-shadow:0 6px 18px var(--glow);}
.sbt:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none;}
.sbt svg{width:14px;height:14px;stroke:#fff;}
.ift{display:flex;align-items:center;justify-content:space-between;padding:7px 2px 0;}
.ift span{font-size:10px;color:var(--text3);}

/* Crisis banner */
.crisis-banner{background:rgba(232,80,80,0.1);border:1px solid rgba(232,80,80,0.3);border-radius:10px;padding:10px 14px;margin:0 32px 12px;font-size:12px;color:var(--text2);line-height:1.5;display:flex;justify-content:space-between;align-items:center;gap:8px;}
.crisis-banner a{color:#e05050;font-weight:600;}
.crisis-x{background:none;border:none;cursor:pointer;color:var(--text3);font-size:16px;}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(0,0,0,0.68);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:200;animation:fadeIn 0.2s ease;}
.md{background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:40px 36px;width:400px;max-width:95vw;animation:fadeUp 0.32s var(--spring) both;position:relative;overflow:hidden;}
.md::before{content:'';position:absolute;top:-50px;right:-50px;width:160px;height:160px;background:var(--glow);border-radius:50%;filter:blur(40px);}
.md-ic{width:48px;height:48px;border-radius:13px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 5px 18px var(--glow);}
.md-ic svg{width:22px;height:22px;stroke:#fff;}
.md h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;color:var(--text);margin-bottom:8px;line-height:1.1;}
.md h2 em{font-style:italic;color:var(--gold);}
.md p{font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:22px;}
.fl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text2);margin-bottom:5px;display:block;}
.fi{width:100%;background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13px;outline:none;margin-bottom:10px;transition:border-color 0.2s;}
.fi:focus{border-color:var(--gold);}
.fi::placeholder{color:var(--text3);}
.ms{width:100%;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;padding:13px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.22s;margin-top:4px;box-shadow:0 4px 18px var(--glow);}
.ms:hover{transform:translateY(-2px);box-shadow:0 8px 26px var(--glow);}
.mn{text-align:center;font-size:11px;color:var(--text3);margin-top:10px;}

.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border2);color:var(--text2);padding:10px 18px;border-radius:10px;font-size:12px;z-index:500;box-shadow:0 6px 24px var(--shadow);white-space:nowrap;animation:fadeUp 0.3s ease;}

.paywall-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeUp 0.25s ease;}
.paywall-modal{background:var(--bg);border:1px solid var(--border2);border-radius:20px;padding:36px 32px;max-width:720px;width:min(92vw,720px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;}
.paywall-close{position:absolute;top:14px;right:14px;background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.paywall-close:hover{background:var(--card);color:var(--text);}
.paywall-icon{font-size:40px;margin-bottom:12px;}
.paywall-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--text);margin:0 0 10px;}
.paywall-desc{font-size:13px;color:var(--text2);line-height:1.6;margin:0 0 22px;}
.paywall-btn{width:100%;padding:13px 20px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.22s;box-shadow:0 4px 16px var(--glow);letter-spacing:0.02em;}
.paywall-btn:hover{transform:translateY(-2px);box-shadow:0 6px 24px var(--glow);}
.paywall-skip{width:100%;padding:10px;background:none;border:none;color:var(--text3);font-size:12px;cursor:pointer;margin-top:10px;transition:color 0.2s;}
.paywall-skip:hover{color:var(--text2);}
@media (max-width: 760px) {
  .paywall-modal{padding:24px 18px;}
  .paywall-title{font-size:20px;}
  .paywall-desc{font-size:12px;line-height:1.55;}
  .transfer-grid{grid-template-columns:1fr;}
  .transfer-card{padding:14px;}
  .transfer-row{font-size:11px;gap:8px;}
  .paywall-note{font-size:11px;margin-top:8px;}
}

@media(max-width:860px){
  .app-sb{display:none;}
  .msgs{padding:18px 16px 12px;}
  .iz{padding:10px 12px 16px;}
  .mrow{max-width:88%;}
  .pgrid{grid-template-columns:1fr;max-width:280px;}
  .wlc h1{font-size:26px;}
  .crisis-banner{margin:0 12px 10px;}
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MOODS = [
  {
    id: "sad",
    label: "Sad",
    sub: "Feeling down",
    color: "#6b9fe4",
    prompt: "I'm feeling really sad right now and need someone to talk to.",
  },
  {
    id: "anxious",
    label: "Anxious",
    sub: "Overwhelmed",
    color: "#c9a96e",
    prompt: "I'm feeling anxious and overwhelmed. I need help calming my mind.",
  },
  {
    id: "angry",
    label: "Frustrated",
    sub: "Anger & tension",
    color: "#e07b7b",
    prompt: "I'm feeling really frustrated and angry right now.",
  },
  {
    id: "numb",
    label: "Empty",
    sub: "Disconnected",
    color: "#9b8bb4",
    prompt: "I feel numb and empty, like nothing matters right now.",
  },
  {
    id: "lonely",
    label: "Lonely",
    sub: "Isolated",
    color: "#5bbfb0",
    prompt: "I'm feeling very lonely and isolated.",
  },
  {
    id: "stressed",
    label: "Stressed",
    sub: "Too much",
    color: "#d4a054",
    prompt: "I'm incredibly stressed and don't know how to manage everything.",
  },
];
const PROMPTS = [
  {
    label: "Open up",
    text: "I just need someone to listen right now. I have a lot on my mind.",
  },
  {
    label: "Hard day",
    text: "I'm having a really difficult day and I don't even know why.",
  },
  {
    label: "Anxiety",
    text: "There's something big coming up and I can't stop feeling anxious about it.",
  },
  {
    label: "Heartache",
    text: "I'm going through something painful and really need support right now.",
  },
];
const QUICK = [
  "I'm feeling anxious",
  "Talk me through this",
  "Help me breathe",
  "I need encouragement",
];
const AFFIRMATIONS = [
  "Your feelings are valid. You are allowed to take up space.",
  "This moment is hard, but it will not last forever.",
  "You have survived every difficult day until now.",
  "It is okay to not be okay. Healing is not linear.",
  "You deserve kindness — especially from yourself.",
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const sbOk = () => SUPABASE_URL && !SUPABASE_URL.startsWith("YOUR");
async function sbPost(table, body) {
  if (!sbOk()) return;
  fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(body),
  }).catch(() => {});
}
async function sbGet(table, filter = "") {
  if (!sbOk()) return [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${filter}&order=created_at.asc&limit=60`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    return await r.json();
  } catch {
    return [];
  }
}
const tl = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function AppPage() {
  const [user, setUser] = useState(null);
  const [nameIn, setNameIn] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [persona, setPersona] = useState("solace");
  const [tab, setTab] = useState("chat");
  const [toast, setToast] = useState("");
  const [reactions, setReactions] = useState({});
  const [showCrisis, setShowCrisis] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState([]);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTransferInfo, setShowTransferInfo] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState("");
  const [paymentRequestStatus, setPaymentRequestStatus] = useState("");
  const [transferStatus, setTransferStatus] = useState("");
  const FREE_MSG_LIMIT = 3;
  const [aff] = useState(
    () => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)],
  );
  const [moodBars] = useState(() =>
    Array(7)
      .fill(0)
      .map(() => +(Math.random() * 0.7 + 0.15).toFixed(2)),
  );
  const bottomRef = useRef(null);
  const taRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const { toggle } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem("solace_u2");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      sbGet("conversations", `user_id=eq.${u.id}`).then((rows) => {
        if (rows?.length) {
          setMessages(
            rows.map((r, i) => ({
              id: i,
              role: r.role,
              content: r.content,
              time: tl(),
            })),
          );
          setHistory(rows.map((r) => ({ role: r.role, content: r.content })));
        }
      });
      const je = localStorage.getItem(`solace_journal_${u.id}`);
      if (je) setJournalEntries(JSON.parse(je));
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 3500);
  };

  const openTransferModal = () => {
    setShowPaywall(true);
    setShowTransferInfo(true);
    setShowAccountPrompt(false);
    setPaymentRequestStatus("");
  };

  const openAccountPrompt = () => {
    setShowPaywall(true);
    setShowAccountPrompt(true);
    setShowTransferInfo(false);
    setPaymentRequestStatus("");
  };

  const handleUpgradeClick = () => {
    showToast("Upgrade coming soon.");
  };

  const copyTransferDetails = () => {
    const text = [
      `${TRANSFER_DETAILS.method} payment details`,
      "",
      "USD account:",
      `Account holder: ${TRANSFER_DETAILS.usd.accountHolder}`,
      `Account number: ${TRANSFER_DETAILS.usd.accountNumber}`,
      `Bank name: ${TRANSFER_DETAILS.usd.bankName}`,
      `Country code: ${TRANSFER_DETAILS.usd.countryCode}`,
      `ACH routing: ${TRANSFER_DETAILS.usd.achRouting}`,
      `Wire routing: ${TRANSFER_DETAILS.usd.wireRouting}`,
      `Bank address: ${TRANSFER_DETAILS.usd.bankAddress}`,
      `Account type: ${TRANSFER_DETAILS.usd.accountType}`,
      "",
      "EUR account:",
      `Account holder: ${TRANSFER_DETAILS.eur.accountHolder}`,
      `Account number: ${TRANSFER_DETAILS.eur.accountNumber}`,
      `Sort code: ${TRANSFER_DETAILS.eur.sortCode}`,
      `SWIFT code: ${TRANSFER_DETAILS.eur.swiftCode}`,
      `IBAN: ${TRANSFER_DETAILS.eur.iban}`,
      `Bank name: ${TRANSFER_DETAILS.eur.bankName}`,
      `Bank address: ${TRANSFER_DETAILS.eur.bankAddress}`,
      "",
      `Reference: ${TRANSFER_DETAILS.reference}`,
      `Support: ${TRANSFER_DETAILS.supportEmail}`,
    ].join("\n");

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Transfer details copied");
      });
    } else {
      showToast("Copy the transfer details manually.");
    }
  };

  const confirmTransfer = async (currency) => {
    if (!user) {
      showToast("Please enter your name before confirming transfer.");
      return;
    }
    const request = {
      user_id: user.id,
      user_name: user.name,
      currency,
      status: "pending",
      plan_requested: "premium",
      note: "User confirmed bank transfer sent.",
      created_at: new Date().toISOString(),
    };
    sbPost("transfer_requests", request);
    const updatedUser = { ...user, plan: "pending" };
    setUser(updatedUser);
    localStorage.setItem("solace_u2", JSON.stringify(updatedUser));
    setTransferStatus(
      `Transfer confirmation recorded for ${currency}. Awaiting verification.`,
    );
    showToast("Transfer request saved. We'll review it soon.");
    setShowPaywall(false);
    setShowTransferInfo(false);
  };

  const submitPaymentAccount = async () => {
    if (!user) {
      showToast("Please enter your name before submitting an account number.");
      return;
    }
    if (!paymentAccount.trim()) {
      showToast("Please enter your payment account number.");
      return;
    }
    const request = {
      user_id: user.id,
      user_name: user.name,
      currency: "N/A",
      status: "pending",
      plan_requested: "premium",
      note: `Payment account number submitted: ${paymentAccount.trim()}`,
      payment_account_number: paymentAccount.trim(),
      created_at: new Date().toISOString(),
    };
    sbPost("transfer_requests", request);
    const updatedUser = { ...user, plan: "pending" };
    setUser(updatedUser);
    localStorage.setItem("solace_u2", JSON.stringify(updatedUser));
    setPaymentRequestStatus(
      "Payment account submitted. We'll verify your subscription soon.",
    );
    showToast("Subscription request saved.");
    setShowPaywall(false);
    setShowAccountPrompt(false);
    setPaymentAccount("");
  };

  const handleSetUser = () => {
    if (!nameIn.trim()) return;
    const u = { name: nameIn.trim(), id: `u_${Date.now()}`, plan: "free" };
    localStorage.setItem("solace_u2", JSON.stringify(u));
    setUser(u);
  };

  const sendMessage = useCallback(
    async (text) => {
      const content = (text || input).trim();
      if (!content || loading) return;
      // Admin bypasses message limit
      const isAdmin = localStorage.getItem("solace_admin") === "true";
      if (!isAdmin) {
        const currentPlan = user?.plan || "free";
        const msgCount = parseInt(
          localStorage.getItem("solace_msg_count") || "0",
          10,
        );
        if (currentPlan === "free" && msgCount >= FREE_MSG_LIMIT) {
          openAccountPrompt();
          return;
        }
        localStorage.setItem("solace_msg_count", String(msgCount + 1));
      }
      setInput("");
      if (taRef.current) {
        taRef.current.style.height = "auto";
      }
      const uid = Date.now();
      setMessages((p) => [
        ...p,
        { id: uid, role: "user", content, time: tl() },
      ]);
      setLoading(true);
      const nh = [...history, { role: "user", content }];
      setHistory(nh);
      sbPost("conversations", {
        user_id: user?.id || "guest",
        role: "user",
        content,
        persona,
      });
      const sys =
        PERSONAS[persona].system +
        (user ? `\n\nUser name: ${user.name}. Use occasionally.` : "");
      try {
        const chatMessages = [
          { role: "system", content: sys },
          ...nh.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        ];
        const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: chatMessages }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        const txt = data.choices?.[0]?.message?.content || "I'm here with you.";
        // Check for crisis keywords
        if (/suicid|self.harm|end my life|kill myself/i.test(content))
          setShowCrisis(true);
        setMessages((p) => [
          ...p,
          { id: uid + 1, role: "assistant", content: txt, time: tl() },
        ]);
        setHistory([...nh, { role: "assistant", content: txt }]);
        sbPost("conversations", {
          user_id: user?.id || "guest",
          role: "assistant",
          content: txt,
          persona,
        });
      } catch {
        showToast("Connection error — check your API key.");
        setMessages((p) => p.filter((m) => m.id !== uid));
        setHistory(history);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, history, user, persona],
  );

  const handleMood = (m) => {
    setActiveMood(m.id);
    setTab("chat");
    sbPost("mood_logs", { user_id: user?.id || "guest", mood: m.id });
    sendMessage(m.prompt);
  };
  const newChat = () => {
    setMessages([]);
    setHistory([]);
    setActiveMood(null);
    setShowCrisis(false);
  };
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleTa = (e) => {
    setInput(e.target.value);
    taRef.current.style.height = "auto";
    taRef.current.style.height =
      Math.min(taRef.current.scrollHeight, 120) + "px";
  };
  const toggleReaction = (msgId, r) =>
    setReactions((prev) => ({
      ...prev,
      [`${msgId}_${r}`]: !prev[`${msgId}_${r}`],
    }));
  const saveJournal = () => {
    if (!journalText.trim()) return;
    const entry = {
      text: journalText.trim(),
      date: new Date().toLocaleDateString(),
      mood: activeMood,
    };
    const ne = [entry, ...journalEntries].slice(0, 20);
    setJournalEntries(ne);
    if (user)
      localStorage.setItem(`solace_journal_${user.id}`, JSON.stringify(ne));
    setJournalText("");
    showToast("Journal entry saved.");
    sbPost("journal_entries", {
      user_id: user?.id || "guest",
      content: entry.text,
      mood: activeMood,
    });
  };

  // Welcome modal
  if (!user)
    return (
      <div>
        <style>{CSS}</style>
        <div className="mbg">
          <div className="md">
            <div className="md-ic">
              <Icons.heart style={{ width: 22, height: 22 }} />
            </div>
            <h2>
              Welcome to <em>Solace</em>
            </h2>
            <p>
              A private, judgment-free space to speak openly about how you feel.
              Solace listens and helps you find calm — any time of day.
            </p>
            <label className="fl">Your first name</label>
            <input
              className="fi"
              placeholder="e.g. Amara"
              value={nameIn}
              onChange={(e) => setNameIn(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetUser()}
              autoFocus
            />
            <button className="ms" onClick={handleSetUser}>
              Begin your journey
            </button>
            <p className="mn">Your conversations are private and secure.</p>
          </div>
        </div>
      </div>
    );

  const curPersona = PERSONAS[persona];

  const SBChat = () => (
    <>
      <button className="ncbt" onClick={newChat}>
        <Icons.plus style={{ width: 13, height: 13, stroke: "#fff" }} /> New
        conversation
      </button>
      <div className="slbl">Choose companion</div>
      <div className="persona-list">
        {Object.entries(PERSONAS).map(([k, p]) => (
          <button
            key={k}
            className={`persona-chip ${persona === k ? "on" : ""}`}
            onClick={() => setPersona(k)}
          >
            <div
              className="persona-dot"
              style={{
                background:
                  k === "solace"
                    ? "var(--gold)"
                    : k === "sage"
                      ? "var(--teal)"
                      : "var(--blue)",
              }}
            />
            <div className="persona-info">
              <span className="persona-name">{p.name}</span>
              <span className="persona-desc">{p.desc}</span>
            </div>
            {persona === k && (
              <Icons.check
                style={{
                  width: 14,
                  height: 14,
                  stroke: "var(--gold)",
                  fill: "none",
                }}
                className="persona-check"
              />
            )}
          </button>
        ))}
      </div>
      <div className="slbl">How are you feeling?</div>
      <div className="mgrid">
        {MOODS.map((m) => (
          <button
            key={m.id}
            className={`mchip ${activeMood === m.id ? "on" : ""}`}
            onClick={() => handleMood(m)}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: m.color,
                display: "inline-block",
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            <span className="mlbl">{m.label}</span>
            <span className="msub">{m.sub}</span>
          </button>
        ))}
      </div>
      <div className="aff">
        <div className="aff-lbl">Daily Affirmation</div>
        <div className="aff-txt">"{aff}"</div>
      </div>
    </>
  );

  const SBMood = () => (
    <>
      <div className="slbl">This week</div>
      <div className="mchart">
        <div className="mchart-t">Mood overview — 7 days</div>
        <div className="mbars">
          {moodBars.map((v, i) => (
            <div className="mbar-w" key={i}>
              <div className="mbar" style={{ height: `${v * 100}%` }} />
              <span className="mbar-d">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="slbl" style={{ marginTop: 12 }}>
        Log today's mood
      </div>
      <div className="mgrid">
        {MOODS.map((m) => (
          <button
            key={m.id}
            className={`mchip ${activeMood === m.id ? "on" : ""}`}
            onClick={() => handleMood(m)}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: m.color,
                display: "inline-block",
                marginRight: 5,
                verticalAlign: "middle",
              }}
            />
            <span className="mlbl">{m.label}</span>
          </button>
        ))}
      </div>
    </>
  );

  const SBJournal = () => (
    <>
      <div className="slbl">Write freely</div>
      <div className="journal-form">
        <textarea
          className="journal-ta"
          placeholder="Write whatever's on your mind. This is just for you..."
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
        <button className="journal-save" onClick={saveJournal}>
          Save entry
        </button>
      </div>
      {journalEntries.length > 0 && (
        <>
          <div className="slbl" style={{ marginTop: 12 }}>
            Past entries
          </div>
          {journalEntries.slice(0, 5).map((e, i) => (
            <div className="journal-entry" key={i}>
              <div className="je-date">
                {e.date}
                {e.mood ? ` · ${e.mood}` : ""}
              </div>
              <div className="je-text">
                {e.text.length > 80 ? e.text.slice(0, 80) + "..." : e.text}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );

  const SBHist = () => {
    const um = messages
      .filter((m) => m.role === "user")
      .slice(-8)
      .reverse();
    return (
      <>
        <div className="slbl">Recent</div>
        {um.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.7 }}>
            Your conversation history will appear here.
          </p>
        )}
        {um.map((m) => (
          <div className="hi" key={m.id}>
            <div className="hi-t">{m.content}</div>
            <div className="hi-s">{m.time}</div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <style>{CSS}</style>
      <div className="app-wrap">
        {/* SIDEBAR */}
        <aside className="app-sb">
          <div className="sb-head">
            <div className="sb-brand">
              <div className="sb-bmark">
                <Icons.heart style={{ width: 14, height: 14 }} />
              </div>
              <span className="sb-bname">
                Sol<em>ace</em>
              </span>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <button className="sb-ibt" title="New chat" onClick={newChat}>
                <Icons.plus style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          <div className="sb-tabs">
            {[
              { id: "chat", l: "Talk" },
              { id: "mood", l: "Mood" },
              { id: "journal", l: "Journal" },
              { id: "history", l: "History" },
            ].map((t) => (
              <button
                key={t.id}
                className={`sb-tab ${tab === t.id ? "on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className="sb-body">
            {tab === "chat" && <SBChat />}
            {tab === "mood" && <SBMood />}
            {tab === "journal" && <SBJournal />}
            {tab === "history" && <SBHist />}
          </div>

          <div className="sb-ft">
            <div className="upcard">
              <div className="upbadge">Premium</div>
              <div className="upt">Unlock everything</div>
              <div className="upd">
                Unlimited chats · Mood history · Memory · Journal sync
              </div>
              <button className="upbt" onClick={handleUpgradeClick}>
                Upgrade — Coming soon
              </button>
              <button className="upbt-alt" onClick={openTransferModal}>
                Pay by transfer
              </button>
            </div>
            <div className="upill">
              <div className="uav">{user.name[0].toUpperCase()}</div>
              <div>
                <div className="unm">{user.name}</div>
                <div className="upl">
                  {user.plan === "pending"
                    ? "Pending subscription"
                    : user.plan === "premium"
                      ? "Premium plan"
                      : "Free plan"}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="app-main">
          <div className="bg-art">
            <div className="orb o1" />
            <div className="orb o2" />
          </div>

          {/* Header */}
          <div className="app-hdr">
            <div className="hdr-l">
              <div className="sav">
                <Icons.heart style={{ width: 18, height: 18 }} />
              </div>
              <div className="hdr-info">
                <h2>{curPersona.name}</h2>
                <p>
                  <span className="sdot" />
                  Available now · {curPersona.desc}
                </p>
              </div>
            </div>
            <div className="hdr-r">
              <button className="h-ib" onClick={newChat} title="New chat">
                <Icons.plus style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>

          {/* Persona bar */}
          <div className="persona-bar">
            {Object.entries(PERSONAS).map(([k, p]) => (
              <button
                key={k}
                className={`pbar-chip ${persona === k ? "on" : ""}`}
                onClick={() => setPersona(k)}
              >
                {p.name} — {p.desc}
              </button>
            ))}
          </div>

          {/* Crisis banner */}
          {showCrisis && (
            <div className="crisis-banner">
              <span>
                If you're in crisis, please reach out:{" "}
                <a href="tel:988">988 Suicide & Crisis Lifeline</a> (call or
                text 988) · Available 24/7
              </span>
              <button className="crisis-x" onClick={() => setShowCrisis(false)}>
                ×
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="msgs">
            {messages.length === 0 ? (
              <div className="wlc">
                <div className="wic">
                  <Icons.heart style={{ width: 32, height: 32 }} />
                </div>
                <h1>
                  Hello, <em>{user.name}</em>
                </h1>
                <p>
                  Whatever you are carrying right now — I am here. No judgment,
                  no rush. Just speak freely and I will listen.
                </p>
                <div className="pgrid">
                  {PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      className="pcard"
                      onClick={() => sendMessage(p.text)}
                    >
                      <div className="pc-lbl">{p.label}</div>
                      <div className="pc-txt">{p.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mrow ${msg.role === "user" ? "user" : "ai"}`}
                >
                  <div className={`mav ${msg.role === "user" ? "user" : "ai"}`}>
                    {msg.role === "user" ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <Icons.heart style={{ width: 14, height: 14 }} />
                    )}
                  </div>
                  <div>
                    <div className="bub" style={{ whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </div>
                    <div className="mt">{msg.time}</div>
                    {msg.role === "assistant" && (
                      <div className="reactions">
                        {["Helpful", "Comforting", "Understood"].map((r) => (
                          <button
                            key={r}
                            className={`reaction-btn ${reactions[`${msg.id}_${r}`] ? "on" : ""}`}
                            onClick={() => toggleReaction(msg.id, r)}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="trow">
                <div className="mav ai">
                  <Icons.heart style={{ width: 14, height: 14 }} />
                </div>
                <div className="tbub">
                  <div className="td" />
                  <div className="td" />
                  <div className="td" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="iz">
            <div
              style={{ overflow: "auto", whiteSpace: "nowrap" }}
              className="quick-btns"
            >
              {QUICK.map((q) => (
                <button key={q} className="qb" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
            <div className="ibox">
              <textarea
                ref={taRef}
                className="cta"
                placeholder={`Talk to ${curPersona.name}...`}
                value={input}
                onChange={handleTa}
                onKeyDown={handleKey}
                rows={1}
              />
              <button
                className="sbt"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <Icons.send style={{ width: 14, height: 14 }} />
              </button>
            </div>
            <div className="ift">
              <span>{input.length > 0 ? `${input.length} chars` : ""}</span>
              <span>Enter to send · Shift+Enter for new line</span>
            </div>
          </div>
        </main>
      </div>
      {toast && <div className="toast">{toast}</div>}

      {/* Paywall Modal */}
      {showPaywall && (
        <div
          className="paywall-overlay"
          onClick={() => {
            setShowPaywall(false);
            setShowTransferInfo(false);
          }}
        >
          <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="paywall-close"
              onClick={() => {
                setShowPaywall(false);
                setShowTransferInfo(false);
              }}
            >
              ✕
            </button>
            <div className="paywall-icon">💬</div>
            {showAccountPrompt ? (
              <>
                <h2 className="paywall-title">Subscribe with account number</h2>
                <p className="paywall-desc">
                  You've reached your free message limit. Enter your payment
                  account number below so we can record your subscription
                  request.
                </p>
                <label className="fl">Payment account number</label>
                <input
                  className="fi"
                  placeholder="Enter account number"
                  value={paymentAccount}
                  onChange={(e) => setPaymentAccount(e.target.value)}
                />
                <button className="paywall-btn" onClick={submitPaymentAccount}>
                  Submit account number
                </button>
                <button
                  className="paywall-btn"
                  style={{ marginTop: 12, background: "#3a6cff" }}
                  onClick={openTransferModal}
                >
                  Or pay by bank transfer
                </button>
                {paymentRequestStatus && (
                  <div className="paywall-note" style={{ marginTop: 14 }}>
                    {paymentRequestStatus}
                  </div>
                )}
              </>
            ) : showTransferInfo ? (
              <>
                <h2 className="paywall-title">Pay by bank transfer</h2>
                <p className="paywall-desc">
                  Use one of the accounts below to send payment. Copy the
                  details and complete the transfer from your bank.
                </p>
                <div className="transfer-grid">
                  <div className="transfer-card">
                    <div className="transfer-card-title">USD account</div>
                    <div className="transfer-row">
                      <span>Account holder</span>
                      <strong>{TRANSFER_DETAILS.usd.accountHolder}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Account number</span>
                      <strong>{TRANSFER_DETAILS.usd.accountNumber}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Bank name</span>
                      <strong>{TRANSFER_DETAILS.usd.bankName}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Country code</span>
                      <strong>{TRANSFER_DETAILS.usd.countryCode}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>ACH routing</span>
                      <strong>{TRANSFER_DETAILS.usd.achRouting}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Wire routing</span>
                      <strong>{TRANSFER_DETAILS.usd.wireRouting}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Bank address</span>
                      <strong>{TRANSFER_DETAILS.usd.bankAddress}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Account type</span>
                      <strong>{TRANSFER_DETAILS.usd.accountType}</strong>
                    </div>
                  </div>
                  <div className="transfer-card">
                    <div className="transfer-card-title">EUR account</div>
                    <div className="transfer-row">
                      <span>Account holder</span>
                      <strong>{TRANSFER_DETAILS.eur.accountHolder}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Account number</span>
                      <strong>{TRANSFER_DETAILS.eur.accountNumber}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Sort code</span>
                      <strong>{TRANSFER_DETAILS.eur.sortCode}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>SWIFT code</span>
                      <strong>{TRANSFER_DETAILS.eur.swiftCode}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>IBAN</span>
                      <strong>{TRANSFER_DETAILS.eur.iban}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Bank name</span>
                      <strong>{TRANSFER_DETAILS.eur.bankName}</strong>
                    </div>
                    <div className="transfer-row">
                      <span>Bank address</span>
                      <strong>{TRANSFER_DETAILS.eur.bankAddress}</strong>
                    </div>
                  </div>
                </div>
                <button className="paywall-btn" onClick={copyTransferDetails}>
                  Copy transfer details
                </button>
                <button
                  className="paywall-btn"
                  style={{ marginTop: 12, background: "#3a6cff" }}
                  onClick={() => confirmTransfer("USD")}
                >
                  Confirm USD transfer sent
                </button>
                <button
                  className="paywall-btn"
                  style={{ marginTop: 12, background: "#4cbb76" }}
                  onClick={() => confirmTransfer("EUR")}
                >
                  Confirm EUR transfer sent
                </button>
                {transferStatus && (
                  <div className="paywall-note" style={{ marginTop: 14 }}>
                    {transferStatus}
                  </div>
                )}
                <div className="paywall-note">
                  Reference: {TRANSFER_DETAILS.reference}
                </div>
                <div className="paywall-note">
                  Support: {TRANSFER_DETAILS.supportEmail}
                </div>
              </>
            ) : (
              <>
                <h2 className="paywall-title">
                  You've used your free messages
                </h2>
                <p className="paywall-desc">
                  You've reached your {FREE_MSG_LIMIT} free messages. Upgrade to
                  Premium for unlimited conversations, mood tracking history,
                  memory, and more.
                </p>
                <button className="paywall-btn" onClick={handleUpgradeClick}>
                  Upgrade — Coming soon
                </button>
              </>
            )}
            <button
              className="paywall-skip"
              onClick={() => {
                setShowPaywall(false);
                setShowTransferInfo(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
