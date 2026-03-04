import { useState, useRef, useEffect } from "react";

const BINANCE_YELLOW = "#F0B90B";
const BINANCE_DARK = "#0B0E11";
const BINANCE_CARD = "#1E2329";
const BINANCE_BORDER = "#2B3139";
const BINANCE_TEXT = "#EAECEF";
const BINANCE_MUTED = "#848E9C";

const DEMO_PORTFOLIO = [
  { symbol: "BTC", amount: 0.45, price: 94250, change: 2.3 },
  { symbol: "ETH", amount: 5.2, price: 3580, change: -1.1 },
  { symbol: "BNB", amount: 12, price: 625, change: 4.7 },
  { symbol: "SOL", amount: 30, price: 178, change: 1.8 },
];

const SUGGESTED = [
  "Analyze my portfolio risk",
  "What's the BTC market sentiment?",
  "Explain Binance Earn strategies",
  "Best DCA plan for $500/month",
];

const systemPrompt = `You are CopilotX — an AI trading assistant for Binance users. You help with:
- Portfolio analysis and risk assessment
- Market sentiment and trend analysis  
- Explaining Binance products (Spot, Futures, Earn, Launchpad, Copy Trading, Auto-Invest)
- Trading strategies, DCA plans, position sizing
- Crypto education for beginners and advanced users

User's demo portfolio:
${DEMO_PORTFOLIO.map(p => `${p.symbol}: ${p.amount} units @ $${p.price} (${p.change > 0 ? "+" : ""}${p.change}% 24h)`).join("\n")}
Total value: ~$${DEMO_PORTFOLIO.reduce((s, p) => s + p.amount * p.price, 0).toLocaleString()}

Be concise, use bullet points for lists. Add relevant emojis. If discussing risk, always add a disclaimer.
Respond in the same language the user writes in.`;

function PortfolioBar() {
  const total = DEMO_PORTFOLIO.reduce((s, p) => s + p.amount * p.price, 0);
  return (
    <div style={{
      display: "flex", gap: 8, padding: "12px 16px",
      background: BINANCE_CARD, borderRadius: 12,
      border: `1px solid ${BINANCE_BORDER}`, overflowX: "auto",
    }}>
      {DEMO_PORTFOLIO.map(p => {
        const val = p.amount * p.price;
        const pct = ((val / total) * 100).toFixed(1);
        return (
          <div key={p.symbol} style={{
            flex: "1 0 auto", minWidth: 100, padding: "8px 12px",
            background: "rgba(240,185,11,0.06)", borderRadius: 8,
            borderLeft: `3px solid ${BINANCE_YELLOW}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: BINANCE_TEXT, fontSize: 14 }}>{p.symbol}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                background: p.change > 0 ? "rgba(14,203,129,0.15)" : "rgba(246,70,93,0.15)",
                color: p.change > 0 ? "#0ECB81" : "#F6465D",
              }}>
                {p.change > 0 ? "+" : ""}{p.change}%
              </span>
            </div>
            <div style={{ color: BINANCE_MUTED, fontSize: 11, marginTop: 4 }}>
              ${val.toLocaleString()} · {pct}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(id);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, 8);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span style={{
          display: "inline-block", width: 2, height: 14,
          background: BINANCE_YELLOW, marginLeft: 2,
          animation: "blink 0.8s infinite",
          verticalAlign: "text-bottom",
        }} />
      )}
    </span>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12, animation: "fadeUp 0.3s ease",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${BINANCE_YELLOW}, #E8A800)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginRight: 8, marginTop: 2, fontSize: 14, fontWeight: 800,
          color: BINANCE_DARK,
        }}>X</div>
      )}
      <div style={{
        maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
        fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
        ...(isUser
          ? { background: BINANCE_YELLOW, color: BINANCE_DARK, fontWeight: 500, borderBottomRightRadius: 4 }
          : { background: BINANCE_CARD, color: BINANCE_TEXT, border: `1px solid ${BINANCE_BORDER}`, borderBottomLeftRadius: 4 }),
      }}>
        {!isUser && msg.typing ? <TypewriterText text={msg.content} /> : msg.content}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${BINANCE_YELLOW}, #E8A800)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginRight: 8, fontSize: 14, fontWeight: 800, color: BINANCE_DARK,
      }}>X</div>
      <div style={{
        padding: "12px 18px", borderRadius: 14, background: BINANCE_CARD,
        border: `1px solid ${BINANCE_BORDER}`, borderBottomLeftRadius: 4,
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: BINANCE_YELLOW,
            animation: `dotPulse 1.2s ease infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function BinanceCopilot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm CopilotX — your Binance AI trading assistant. 🚀\n\nI can analyze your portfolio, explain Binance products, suggest strategies, or answer any crypto question.\n\nWhat would you like to explore?", typing: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(true);
  const chatEnd = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setShowPortfolio(false);

    try {
      const apiMessages = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't process that. Try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply, typing: true }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Connection error. Please check your network and try again.",
        typing: false,
      }]);
    }
    setLoading(false);
  };

  const total = DEMO_PORTFOLIO.reduce((s, p) => s + p.amount * p.price, 0);
  const avgChange = DEMO_PORTFOLIO.reduce((s, p) => s + p.change, 0) / DEMO_PORTFOLIO.length;

  return (
    <div style={{
      width: "100%", maxWidth: 520, margin: "0 auto", height: "100vh",
      display: "flex", flexDirection: "column",
      background: BINANCE_DARK, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes blink { 0%,50% { opacity: 1 } 51%,100% { opacity: 0 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes dotPulse { 0%,80%,100% { transform: scale(0.6); opacity: 0.4 } 40% { transform: scale(1); opacity: 1 } }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: ${BINANCE_BORDER}; border-radius: 4px }
        input::placeholder { color: ${BINANCE_MUTED} }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${BINANCE_BORDER}`,
        background: "rgba(11,14,17,0.95)", backdropFilter: "blur(10px)",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${BINANCE_YELLOW}, #D4A000)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: BINANCE_DARK,
            boxShadow: `0 0 20px ${BINANCE_YELLOW}33`,
          }}>X</div>
          <div>
            <div style={{ fontWeight: 700, color: BINANCE_TEXT, fontSize: 15 }}>
              CopilotX
            </div>
            <div style={{ fontSize: 11, color: "#0ECB81", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ECB81", display: "inline-block" }} />
              Powered by OpenClaw AI
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: BINANCE_TEXT }}>
            ${total.toLocaleString()}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: avgChange > 0 ? "#0ECB81" : "#F6465D",
          }}>
            {avgChange > 0 ? "▲" : "▼"} {Math.abs(avgChange).toFixed(1)}% today
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 16px 8px",
        display: "flex", flexDirection: "column",
      }}>
        {showPortfolio && (
          <div style={{ marginBottom: 16, animation: "fadeUp 0.4s ease" }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: BINANCE_MUTED,
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
            }}>
              📊 Your Portfolio
            </div>
            <PortfolioBar />
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <LoadingDots />}
        <div ref={chatEnd} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{
          padding: "0 16px 8px", display: "flex", flexWrap: "wrap", gap: 6,
        }}>
          {SUGGESTED.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)} style={{
              padding: "7px 12px", borderRadius: 20,
              background: "transparent", border: `1px solid ${BINANCE_BORDER}`,
              color: BINANCE_MUTED, fontSize: 12, cursor: "pointer",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = BINANCE_YELLOW; e.target.style.color = BINANCE_YELLOW; }}
              onMouseLeave={e => { e.target.style.borderColor = BINANCE_BORDER; e.target.style.color = BINANCE_MUTED; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px 16px",
        borderTop: `1px solid ${BINANCE_BORDER}`,
        background: "rgba(11,14,17,0.95)", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          display: "flex", gap: 8, alignItems: "center",
          background: BINANCE_CARD, borderRadius: 14, padding: "4px 4px 4px 16px",
          border: `1px solid ${BINANCE_BORDER}`,
          transition: "border-color 0.2s",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about trading, portfolio, Binance..."
            disabled={loading}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: BINANCE_TEXT, fontSize: 14, fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10, border: "none",
              background: input.trim() ? BINANCE_YELLOW : BINANCE_BORDER,
              color: BINANCE_DARK, cursor: input.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", fontSize: 18, fontWeight: 700,
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
        <div style={{
          textAlign: "center", fontSize: 10, color: BINANCE_MUTED,
          marginTop: 8, opacity: 0.6,
        }}>
          CopilotX by OpenClaw · Not financial advice
        </div>
      </div>
    </div>
  );
}
