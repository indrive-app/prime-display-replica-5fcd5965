import { useState } from "react";
import { AppState } from "@/lib/store";

interface Props {
  state: AppState;
  onUpdate: (state: AppState) => void;
  onClose: () => void;
}

const FONT_FAMILIES = [
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
];

const SuperAdminDrawer = ({ state, onUpdate, onClose }: Props) => {
  const [tab, setTab] = useState<"display" | "header" | "typography">("display");
  const [feedback, setFeedback] = useState("");

  // Display controls
  const [tickerSpeed, setTickerSpeed] = useState(state.tickerSpeed || 1);
  const [cardFontSize, setCardFontSize] = useState(state.cardFontSize || 1);
  const [buyColor, setBuyColor] = useState(state.buyColor || "#2ab7a9");
  const [sellColor, setSellColor] = useState(state.sellColor || "#e63946");

  // Header
  const [headerText, setHeaderText] = useState(
    state.headerText || `WELLCOME TO ${state.companyName} : FOREIGN EXCHANGE RATES`
  );
  const [headerFontFamily, setHeaderFontFamily] = useState(state.headerFontFamily || "Montserrat, sans-serif");
  const [headerFontSize, setHeaderFontSize] = useState(state.headerFontSize ?? 1);

  // Global typography
  const [globalFontFamily, setGlobalFontFamily] = useState(state.globalFontFamily || "Montserrat, sans-serif");

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2200);
  };

  const saveDisplay = () => {
    onUpdate({ ...state, tickerSpeed, cardFontSize, buyColor, sellColor });
    flash("Display settings saved");
  };

  const saveHeader = () => {
    onUpdate({ ...state, headerText, headerFontFamily, headerFontSize });
    flash("Header updated");
  };

  const saveTypography = () => {
    onUpdate({ ...state, globalFontFamily });
    flash("Typography updated");
  };

  const tabItems = [
    { key: "display" as const, label: "Display", icon: "🖥" },
    { key: "header" as const, label: "Header", icon: "📰" },
    { key: "typography" as const, label: "Typography", icon: "🔤" },
  ];

  const accent = "#a855f7";
  const accentDark = "#7c3aed";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        display: "flex", justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "520px", maxWidth: "94vw", height: "100%",
          background: "linear-gradient(180deg, #0d0820 0%, #060212 100%)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "-12px 0 50px rgba(0,0,0,0.7)",
          borderLeft: `1px solid ${accent}33`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "22px 26px",
            background: `linear-gradient(135deg, ${accent}1f 0%, transparent 100%)`,
            borderBottom: `1px solid ${accent}33`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px", height: "42px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${accent}, ${accentDark})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 14px ${accent}66`,
                fontSize: "20px",
              }}
            >
              👑
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Montserrat, sans-serif", fontWeight: 800,
                  fontSize: "15px", color: "#fff", letterSpacing: "3px",
                }}
              >
                SUPER ADMIN
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif", fontSize: "11px",
                  color: accent, marginTop: "2px", letterSpacing: "0.5px",
                }}
              >
                Full system control
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", fontSize: "16px", cursor: "pointer",
              width: "36px", height: "36px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            style={{
              background: `linear-gradient(90deg, ${accent}33 0%, ${accent}0d 100%)`,
              color: "#fff", padding: "11px 26px", fontSize: "13px",
              fontFamily: "Inter, sans-serif", fontWeight: 500,
              borderBottom: `1px solid ${accent}33`,
            }}
          >
            ✓ {feedback}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex", gap: "4px", padding: "8px 14px",
            background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {tabItems.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "11px 0 9px",
                background: tab === t.key ? `linear-gradient(135deg, ${accent}26, ${accent}0d)` : "transparent",
                border: tab === t.key ? `1px solid ${accent}40` : "1px solid transparent",
                cursor: "pointer", borderRadius: "8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "16px" }}>{t.icon}</span>
              <span
                style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                  color: tab === t.key ? accent : "rgba(255,255,255,0.4)",
                  fontFamily: "Montserrat, sans-serif", textTransform: "uppercase",
                }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 26px" }}>
          {/* DISPLAY */}
          {tab === "display" && (
            <div>
              <SectionLabel>Ticker Speed <span style={{ color: accent }}>({tickerSpeed.toFixed(1)}x)</span></SectionLabel>
              <Card>
                <input
                  type="range" min="0.2" max="3" step="0.1" value={tickerSpeed}
                  onChange={e => setTickerSpeed(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={hintStyle}>Slow</span><span style={hintStyle}>Fast</span></Row>
              </Card>

              <SectionLabel>Card Font Size <span style={{ color: accent }}>({cardFontSize.toFixed(1)}x)</span></SectionLabel>
              <Card>
                <input
                  type="range" min="0.6" max="2" step="0.1" value={cardFontSize}
                  onChange={e => setCardFontSize(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={hintStyle}>Small</span><span style={hintStyle}>Large</span></Row>
              </Card>

              <SectionLabel>Rate Column Colors</SectionLabel>
              <Card>
                <div style={{ display: "flex", gap: "16px" }}>
                  <ColorPicker label="We Buy" value={buyColor} onChange={setBuyColor} />
                  <ColorPicker label="We Sell" value={sellColor} onChange={setSellColor} />
                </div>
              </Card>

              <PrimaryButton onClick={saveDisplay}>SAVE DISPLAY SETTINGS</PrimaryButton>
            </div>
          )}

          {/* HEADER */}
          {tab === "header" && (
            <div>
              <SectionLabel>Header Title Text</SectionLabel>
              <Card>
                <textarea
                  value={headerText}
                  onChange={e => setHeaderText(e.target.value)}
                  placeholder="WELLCOME TO AFC BANK : FOREIGN EXCHANGE RATES"
                  style={{
                    width: "100%", minHeight: "70px", resize: "vertical",
                    background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px", padding: "12px", color: "#fff", fontSize: "13px",
                    fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>
                  This is the top banner displayed on every screen.
                </div>
              </Card>

              <SectionLabel>Header Font Family</SectionLabel>
              <Card>
                <select
                  value={headerFontFamily}
                  onChange={e => setHeaderFontFamily(e.target.value)}
                  style={selectStyle}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value} style={{ background: "#1a0b2e" }}>{f.label}</option>
                  ))}
                </select>
                <div
                  style={{
                    marginTop: "12px", padding: "10px 12px",
                    background: "rgba(0,0,0,0.3)", borderRadius: "6px",
                    color: "#fff", fontFamily: headerFontFamily, fontSize: "14px",
                    fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase",
                  }}
                >
                  {headerText || "Preview"}
                </div>
              </Card>

              <SectionLabel>Header Font Size <span style={{ color: accent }}>({headerFontSize.toFixed(2)}x)</span></SectionLabel>
              <Card>
                <input
                  type="range" min="0.5" max="2" step="0.05" value={headerFontSize}
                  onChange={e => setHeaderFontSize(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={hintStyle}>Small</span><span style={hintStyle}>Large</span></Row>
              </Card>

              <PrimaryButton onClick={saveHeader}>SAVE HEADER</PrimaryButton>
            </div>
          )}

          {/* TYPOGRAPHY */}
          {tab === "typography" && (
            <div>
              <SectionLabel>Global Font Family</SectionLabel>
              <Card>
                <select
                  value={globalFontFamily}
                  onChange={e => setGlobalFontFamily(e.target.value)}
                  style={selectStyle}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value} style={{ background: "#1a0b2e" }}>{f.label}</option>
                  ))}
                </select>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "10px", lineHeight: 1.5 }}>
                  Sets the default font used across the entire dashboard interface.
                </div>
                <div
                  style={{
                    marginTop: "14px", padding: "14px",
                    background: "rgba(0,0,0,0.3)", borderRadius: "8px",
                    fontFamily: globalFontFamily,
                  }}
                >
                  <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>
                    The quick brown fox
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
                    Jumps over the lazy dog · 0123456789
                  </div>
                </div>
              </Card>

              <PrimaryButton onClick={saveTypography}>SAVE TYPOGRAPHY</PrimaryButton>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            padding: "14px", background: "rgba(0,0,0,0.4)",
            border: "none", borderTop: `1px solid ${accent}33`,
            color: "rgba(255,255,255,0.55)", fontSize: "11px", fontWeight: 700,
            letterSpacing: "2px", cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          LOGOUT & CLOSE
        </button>
      </div>
    </div>
  );
};

/* ───────── helpers ───────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
      letterSpacing: "2px", marginBottom: "10px", marginTop: "4px",
      fontFamily: "Montserrat, sans-serif", textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)", borderRadius: "12px",
      padding: "16px", marginBottom: "22px",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>{children}</div>
);

const hintStyle: React.CSSProperties = { fontSize: "10px", color: "rgba(255,255,255,0.35)" };

const selectStyle: React.CSSProperties = {
  width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px", padding: "10px 12px", color: "#fff", fontSize: "13px",
  fontFamily: "Inter, sans-serif", outline: "none", cursor: "pointer",
};

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", marginBottom: "8px", fontWeight: 600 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "40px", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer", background: "transparent" }}
      />
      <span style={{ fontSize: "12px", color: value, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
        {value}
      </span>
    </div>
  </div>
);

const PrimaryButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: "13px",
      background: "linear-gradient(135deg, #a855f7, #7c3aed)",
      color: "#fff", border: "none", borderRadius: "10px",
      fontFamily: "Montserrat, sans-serif", fontWeight: 800,
      fontSize: "13px", letterSpacing: "2px", cursor: "pointer",
      boxShadow: "0 6px 20px rgba(168,85,247,0.35)",
    }}
  >
    {children}
  </button>
);

export default SuperAdminDrawer;
