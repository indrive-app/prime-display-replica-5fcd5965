import { useState, useEffect } from "react";
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

type ThemeMode = "dark" | "light";

const SuperAdminDrawer = ({ state, onUpdate, onClose }: Props) => {
  const [tab, setTab] = useState<"display" | "header" | "typography">("display");
  const [feedback, setFeedback] = useState("");
  
  // Theme state
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("superAdminTheme") as ThemeMode;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("superAdminTheme", newTheme);
  };

  // Display controls
  const [tickerSpeed, setTickerSpeed] = useState(state.tickerSpeed || 1);
  const [cardFontSize, setCardFontSize] = useState(state.cardFontSize || 1);
  const [buyColor, setBuyColor] = useState(state.buyColor || "#2ab7a9");
  const [sellColor, setSellColor] = useState(state.sellColor || "#e63946");
  const [displayMode, setDisplayMode] = useState<"video" | "announcement">(state.displayMode || "video");
  const [announcementText, setAnnouncementText] = useState(state.announcementText || "");

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
    onUpdate({ ...state, tickerSpeed, cardFontSize, buyColor, sellColor, displayMode, announcementText });
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
  
  const isDark = themeMode === "dark";
  
  // Theme Palettes
  const t = {
    bgGradient: isDark ? "linear-gradient(180deg, #0d0820 0%, #060212 100%)" : "linear-gradient(180deg, #fdfcff 0%, #f3f4f6 100%)",
    textPrimary: isDark ? "#ffffff" : "#111827",
    textSecondary: isDark ? "rgba(255,255,255,0.7)" : "rgba(17,24,39,0.7)",
    textTertiary: isDark ? "rgba(255,255,255,0.4)" : "rgba(17,24,39,0.45)",
    borderSoft: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    borderHard: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    cardBg: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
    cardShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.03)" : "0 4px 20px rgba(0,0,0,0.03)",
    inputBg: isDark ? "rgba(0,0,0,0.4)" : "#f8fafc",
    inputBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    tabBarBg: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.02)",
    closeBtnBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    previewBg: isDark ? "rgba(0,0,0,0.3)" : "#f1f5f9",
    selectOptBg: isDark ? "#1a0b2e" : "#ffffff",
  };

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
          background: t.bgGradient,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "-12px 0 50px rgba(0,0,0,0.7)",
          borderLeft: `1px solid ${accent}33`,
          color: t.textPrimary,
          transition: "all 0.3s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "22px 26px",
            background: `linear-gradient(135deg, ${accent}1f 0%, transparent 100%)`,
            borderBottom: `1px solid ${t.borderSoft}`,
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
                  fontSize: "15px", color: t.textPrimary, letterSpacing: "3px",
                }}
              >
                SUPER ADMIN
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif", fontSize: "11px",
                  color: isDark ? accent : accentDark, marginTop: "2px", letterSpacing: "0.5px",
                }}
              >
                Full system control
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={toggleTheme}
              style={{
                background: t.closeBtnBg, border: `1px solid ${t.borderSoft}`,
                color: t.textSecondary, fontSize: "16px", cursor: "pointer",
                width: "36px", height: "36px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              onClick={onClose}
              style={{
                background: t.closeBtnBg, border: `1px solid ${t.borderSoft}`,
                color: t.textSecondary, fontSize: "16px", cursor: "pointer",
                width: "36px", height: "36px", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            style={{
              background: `linear-gradient(90deg, ${accent}33 0%, ${accent}0d 100%)`,
              color: t.textPrimary, padding: "11px 26px", fontSize: "13px",
              fontFamily: "Inter, sans-serif", fontWeight: 500,
              borderBottom: `1px solid ${t.borderSoft}`,
            }}
          >
            ✓ {feedback}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex", gap: "4px", padding: "8px 14px",
            background: t.tabBarBg, borderBottom: `1px solid ${t.borderSoft}`,
          }}
        >
          {tabItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                flex: 1, padding: "11px 0 9px",
                background: tab === item.key ? (isDark ? `linear-gradient(135deg, ${accent}26, ${accent}0d)` : `linear-gradient(135deg, ${accent}1a, ${accent}05)`) : "transparent",
                border: tab === item.key ? `1px solid ${accent}40` : "1px solid transparent",
                cursor: "pointer", borderRadius: "8px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                  color: tab === item.key ? (isDark ? accent : accentDark) : t.textTertiary,
                  fontFamily: "Montserrat, sans-serif", textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 26px" }}>
          
          {/* DISPLAY */}
          {tab === "display" && (
            <div>
              <SectionLabel color={t.textTertiary}>Super Admin Theme</SectionLabel>
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {(["dark", "light"] as const).map(mode => (
                  <button key={mode} onClick={() => {
                    setThemeMode(mode);
                    localStorage.setItem("superAdminTheme", mode);
                  }} style={{
                    flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer",
                    border: themeMode === mode ? `1px solid ${accent}80` : `1px solid ${t.borderSoft}`,
                    background: themeMode === mode ? `linear-gradient(135deg, ${accent}33, ${accent}1a)` : t.cardBg,
                    color: themeMode === mode ? t.textPrimary : t.textSecondary,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                    fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase",
                    transition: "all 0.2s"
                  }}>{mode} Mode</button>
                ))}
              </div>

              <SectionLabel color={t.textTertiary}>Content Mode</SectionLabel>
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {(["video", "announcement"] as const).map(mode => (
                  <button key={mode} onClick={() => setDisplayMode(mode)} style={{
                    flex: 1, padding: "12px", borderRadius: "10px", cursor: "pointer",
                    border: displayMode === mode ? `1px solid ${accent}80` : `1px solid ${t.borderSoft}`,
                    background: displayMode === mode ? `linear-gradient(135deg, ${accent}33, ${accent}1a)` : t.cardBg,
                    color: displayMode === mode ? t.textPrimary : t.textSecondary,
                    fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                    fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase",
                    transition: "all 0.2s"
                  }}>{mode}</button>
                ))}
              </div>

              {displayMode === "announcement" && (
                <>
                  <SectionLabel color={t.textTertiary}>Announcement Text</SectionLabel>
                  <Card t={t}>
                    <textarea
                      value={announcementText} onChange={e => setAnnouncementText(e.target.value)}
                      placeholder="Enter announcement text..."
                      style={{
                        width: "100%", height: "120px", resize: "vertical",
                        background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                        borderRadius: "8px", padding: "12px", color: t.textPrimary, fontSize: "13px",
                        fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </Card>
                </>
              )}

              <SectionLabel color={t.textTertiary}>Ticker Speed <span style={{ color: isDark ? accent : accentDark }}>({tickerSpeed.toFixed(1)}x)</span></SectionLabel>
              <Card t={t}>
                <input
                  type="range" min="0.2" max="3" step="0.1" value={tickerSpeed}
                  onChange={e => setTickerSpeed(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={{fontSize: "10px", color: t.textTertiary}}>Slow</span><span style={{fontSize: "10px", color: t.textTertiary}}>Fast</span></Row>
              </Card>

              <SectionLabel color={t.textTertiary}>Card Font Size <span style={{ color: isDark ? accent : accentDark }}>({cardFontSize.toFixed(1)}x)</span></SectionLabel>
              <Card t={t}>
                <input
                  type="range" min="0.6" max="2" step="0.1" value={cardFontSize}
                  onChange={e => setCardFontSize(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={{fontSize: "10px", color: t.textTertiary}}>Small</span><span style={{fontSize: "10px", color: t.textTertiary}}>Large</span></Row>
              </Card>

              <SectionLabel color={t.textTertiary}>Rate Column Colors</SectionLabel>
              <Card t={t}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <ColorPicker label="We Buy" value={buyColor} onChange={setBuyColor} color={t.textSecondary} />
                  <ColorPicker label="We Sell" value={sellColor} onChange={setSellColor} color={t.textSecondary} />
                </div>
              </Card>

              <PrimaryButton onClick={saveDisplay}>SAVE DISPLAY SETTINGS</PrimaryButton>
            </div>
          )}

          {/* HEADER */}
          {tab === "header" && (
            <div>
              <SectionLabel color={t.textTertiary}>Header Title Text</SectionLabel>
              <Card t={t}>
                <textarea
                  value={headerText}
                  onChange={e => setHeaderText(e.target.value)}
                  placeholder="WELLCOME TO AFC BANK : FOREIGN EXCHANGE RATES"
                  style={{
                    width: "100%", minHeight: "70px", resize: "vertical",
                    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: "8px", padding: "12px", color: t.textPrimary, fontSize: "13px",
                    fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: "10px", color: t.textTertiary, marginTop: "8px" }}>
                  This is the top banner displayed on every screen.
                </div>
              </Card>

              <SectionLabel color={t.textTertiary}>Header Font Family</SectionLabel>
              <Card t={t}>
                <select
                  value={headerFontFamily}
                  onChange={e => setHeaderFontFamily(e.target.value)}
                  style={{
                    width: "100%", background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: "8px", padding: "10px 12px", color: t.textPrimary, fontSize: "13px",
                    fontFamily: "Inter, sans-serif", outline: "none", cursor: "pointer",
                  }}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value} style={{ background: t.selectOptBg, color: t.textPrimary }}>{f.label}</option>
                  ))}
                </select>
                <div
                  style={{
                    marginTop: "12px", padding: "10px 12px",
                    background: t.previewBg, borderRadius: "6px",
                    color: t.textPrimary, fontFamily: headerFontFamily, fontSize: "14px",
                    fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase",
                  }}
                >
                  {headerText || "Preview"}
                </div>
              </Card>

              <SectionLabel color={t.textTertiary}>Header Font Size <span style={{ color: isDark ? accent : accentDark }}>({headerFontSize.toFixed(2)}x)</span></SectionLabel>
              <Card t={t}>
                <input
                  type="range" min="0.5" max="2" step="0.05" value={headerFontSize}
                  onChange={e => setHeaderFontSize(parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: accent }}
                />
                <Row><span style={{fontSize: "10px", color: t.textTertiary}}>Small</span><span style={{fontSize: "10px", color: t.textTertiary}}>Large</span></Row>
              </Card>

              <PrimaryButton onClick={saveHeader}>SAVE HEADER</PrimaryButton>
            </div>
          )}

          {/* TYPOGRAPHY */}
          {tab === "typography" && (
            <div>
              <SectionLabel color={t.textTertiary}>Global Font Family</SectionLabel>
              <Card t={t}>
                <select
                  value={globalFontFamily}
                  onChange={e => setGlobalFontFamily(e.target.value)}
                  style={{
                    width: "100%", background: t.inputBg, border: `1px solid ${t.inputBorder}`,
                    borderRadius: "8px", padding: "10px 12px", color: t.textPrimary, fontSize: "13px",
                    fontFamily: "Inter, sans-serif", outline: "none", cursor: "pointer",
                  }}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value} style={{ background: t.selectOptBg, color: t.textPrimary }}>{f.label}</option>
                  ))}
                </select>
                <div style={{ fontSize: "11px", color: t.textTertiary, marginTop: "10px", lineHeight: 1.5 }}>
                  Sets the default font used across the entire dashboard interface.
                </div>
                <div
                  style={{
                    marginTop: "14px", padding: "14px",
                    background: t.previewBg, borderRadius: "8px",
                    fontFamily: globalFontFamily,
                  }}
                >
                  <div style={{ color: t.textPrimary, fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>
                    The quick brown fox
                  </div>
                  <div style={{ color: t.textSecondary, fontSize: "13px" }}>
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
            padding: "16px", background: t.tabBarBg,
            border: "none", borderTop: `1px solid ${t.borderSoft}`,
            color: t.textSecondary, fontSize: "12px", fontWeight: 700,
            letterSpacing: "2px", cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.2s"
          }}
        >
          LOGOUT & CLOSE
        </button>
      </div>
    </div>
  );
};

/* ───────── helpers ───────── */

const SectionLabel = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <div
    style={{
      fontSize: "11px", fontWeight: 700, color,
      letterSpacing: "2px", marginBottom: "10px", marginTop: "4px",
      fontFamily: "Montserrat, sans-serif", textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Card = ({ children, t }: { children: React.ReactNode, t: any }) => (
  <div
    style={{
      background: t.cardBg, borderRadius: "12px",
      padding: "16px", marginBottom: "22px",
      border: `1px solid ${t.borderSoft}`,
      boxShadow: t.cardShadow,
    }}
  >
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>{children}</div>
);

const ColorPicker = ({ label, value, onChange, color }: { label: string; value: string; onChange: (v: string) => void, color: string }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: "11px", color, marginBottom: "8px", fontWeight: 700 }}>{label}</div>
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
      width: "100%", padding: "14px",
      background: "linear-gradient(135deg, #a855f7, #7c3aed)",
      color: "#fff", border: "none", borderRadius: "10px",
      fontFamily: "Montserrat, sans-serif", fontWeight: 800,
      fontSize: "13px", letterSpacing: "2px", cursor: "pointer",
      boxShadow: "0 6px 20px rgba(168,85,247,0.35)",
      transition: "transform 0.1s ease",
    }}
    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
    onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
  >
    {children}
  </button>
);

export default SuperAdminDrawer;
