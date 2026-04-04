import { Icons, Footer } from "../components/Shared";

const CSS = `
.legal-page { padding: 120px 24px 80px; max-width: 800px; margin: 0 auto; min-height: 100vh; }
.legal-header { margin-bottom: 60px; text-align: center; }
.legal-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--glow); border: 1px solid var(--glow); border-radius: 100px; padding: 6px 14px; font-size: 11px; font-weight: 700; color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; }
.legal-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 5vw, 64px); font-weight: 400; color: var(--text); line-height: 1.1; margin-bottom: 16px; }
.legal-subtitle { font-size: 16px; color: var(--text3); }

.legal-content { font-size: 16px; color: var(--text2); line-height: 1.8; }
.legal-content h2 { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--text); margin: 40px 0 20px; font-weight: 500; }
.legal-content p { margin-bottom: 20px; }
.legal-content ul { margin-bottom: 20px; padding-left: 20px; }
.legal-content li { margin-bottom: 10px; list-style-type: disc; }

.legal-orb { position: absolute; width: 600px; height: 600px; background: var(--gold); border-radius: 50%; filter: blur(120px); opacity: 0.05; pointer-events: none; z-index: -1; }
.lo1 { top: -200px; left: -200px; }
.lo2 { bottom: -200px; right: -200px; }
`;

export default function PrivacyPolicy() {
  return (
    <>
      <style>{CSS}</style>
      <div className="legal-page">
        <div className="legal-orb lo1" />
        <div className="legal-orb lo2" />
        
        <header className="legal-header">
          <div className="legal-tag">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: April 4, 2024</p>
        </header>

        <article className="legal-content">
          <p>At Solace, your privacy is not just a feature — it's our foundational promise. We understand that the conversations you have here are deeply personal, and we treat them with the utmost care and security.</p>
          
          <h2>1. Data Collection</h2>
          <p>We collect minimal information to provide you with the best possible experience:</p>
          <ul>
            <li><strong>Conversation Data:</strong> Your chats are processed by our AI to provide empathetic responses. These are encrypted at rest and in transit.</li>
            <li><strong>Account Information:</strong> If you create an account, we store your email address and basic profile preferences.</li>
            <li><strong>Usage Data:</strong> We collect anonymous analytics to improve the app's performance and accessibility.</li>
          </ul>

          <h2>2. Data Encryption</h2>
          <p>All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols. Your conversation history is stored using AES-256 encryption, ensuring that only authorized systems can access it for the purpose of serving your request.</p>

          <h2>3. No Third-Party Selling</h2>
          <p>We never have, and never will, sell your personal data or conversation history to third parties. Your emotional journey is yours alone, not a product for advertisers.</p>

          <h2>4. AI Processing</h2>
          <p>Solace uses advanced Natural Language Processing (NLP) to understand and respond to your feelings. While we use AI models to process your input, we do not use your personal conversations to train public models without your explicit, opt-in consent.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to access, rectify, or delete your data at any time. If you choose to delete your account, all associated conversation history will be permanently purged from our active databases.</p>

          <h2>6. Crisis Protocols</h2>
          <p>In the event that our AI detects a high risk of self-harm or danger to others, we may provide crisis resource links. However, Solace is not a medical provider and does not store medical records.</p>
        </article>
      </div>
      <Footer />
    </>
  );
}
