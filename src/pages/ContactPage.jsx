import { useState } from "react";
import { Icons, Footer } from "../components/Shared";

const CSS = `
.contact-page { padding: 120px 24px 80px; max-width: 1100px; margin: 0 auto; min-height: 100vh; position: relative; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: flex-start; }

.contact-info h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 5vw, 68px); line-height: 1.1; margin-bottom: 24px; color: var(--text); }
.contact-info h1 em { font-style: italic; color: var(--gold); }
.contact-info p { font-size: 17px; color: var(--text2); line-height: 1.7; margin-bottom: 40px; }

.contact-cards { display: flex; flex-direction: column; gap: 20px; }
.contact-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; gap: 16px; transition: all 0.3s; }
.contact-card:hover { border-color: var(--gold); transform: translateY(-3px); box-shadow: 0 12px 36px var(--shadow); }
.contact-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--glow); border: 1px solid var(--glow); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--gold); }
.contact-icon svg { width: 20px; height: 20px; }
.contact-item-h { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.contact-item-v { font-size: 14px; color: var(--text2); }

.contact-form-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px var(--shadow); position: relative; overflow: hidden; }
.contact-form-wrap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--gold), var(--gold2)); }
.contact-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; }
.form-input { background: var(--bg); border: 1px solid var(--border2); border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 15px; color: var(--text); transition: all 0.2s; }
.form-input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 4px var(--glow); }
.form-textarea { min-height: 140px; resize: none; }
.form-btn { background: linear-gradient(135deg, var(--gold), var(--gold2)); color: #fff; border: none; border-radius: 11px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 10px; }
.form-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--glow); }

.contact-orb { position: absolute; width: 600px; height: 600px; background: var(--gold); border-radius: 50%; filter: blur(140px); opacity: 0.06; pointer-events: none; }
.co1 { top: -100px; right: -100px; }

@media(max-width: 800px) {
  .contact-grid { grid-template-columns: 1fr; gap: 48px; }
  .contact-page { padding: 100px 20px 60px; }
}
`;

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="contact-page">
        <div className="contact-orb co1" />
        
        <div className="contact-grid">
          <div className="contact-info">
            <h1>We're here to <em>listen.</em></h1>
            <p>Question about your account? Partnering with us? Or just want to share your experience? We'd love to hear from you.</p>
            
            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon"><Icons.heart /></div>
                <div>
                  <div className="contact-item-h">General Support</div>
                  <div className="contact-item-v">support@solace-ai.com</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon"><Icons.sparkle /></div>
                <div>
                  <div className="contact-item-h">Partnerships</div>
                  <div className="contact-item-v">hello@solace-ai.com</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon"><Icons.shield /></div>
                <div>
                  <div className="contact-item-h">Security</div>
                  <div className="contact-item-v">security@solace-ai.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 64, height: 64, background: "var(--glow)", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 24px", color: "var(--gold)" }}>
                  <Icons.check style={{ width: 32, height: 32 }} />
                </div>
                <h3 style={{ fontSize: 24, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: "var(--text2)" }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button className="form-btn" style={{ margin: "32px auto 0", width: "auto", padding: "12px 24px" }} onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-input" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" placeholder="email@example.com" required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select className="form-input">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea className="form-input form-textarea" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="form-btn">
                  Send Message <Icons.send style={{ width: 16, height: 16 }} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
