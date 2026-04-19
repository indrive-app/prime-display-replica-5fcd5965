import { useState, useCallback, useEffect } from "react";
import { loadState, saveState, AppState } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import ExchangeRateCard from "@/components/ExchangeRateCard";
import VideoPanelNew from "@/components/VideoPanelNew";
import TickerBar from "@/components/TickerBar";
import AdminDrawer from "@/components/AdminDrawer";
import LoginModalNew from "@/components/LoginModalNew";
import FullscreenHint from "@/components/FullscreenHint";
import SuperAdminDrawer from "@/components/SuperAdminDrawer";

const Index = () => {
  const [state, setState] = useState<AppState | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [adminMode, setAdminMode] = useState<"closed" | "login" | "open" | "super">("closed");

  useEffect(() => {
    const init = async () => {
      const s = await loadState();
      setState(s);
    };
    init();

    const channel = supabase
      .channel('public:app_state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, (payload) => {
        const newData = payload.new as any;
        if (newData?.state && Array.isArray(newData.state.currencies)) {
          console.log('Real-time update received');
          setState(newData.state as AppState);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpdate = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = () => setAdminMode("closed");
    window.addEventListener("admin-cancel", handler);
    return () => window.removeEventListener("admin-cancel", handler);
  }, []);

  if (!state) {
    return (
      <div style={{
        width: "100vw", height: "100vh",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "var(--dash-bg)", color: "var(--dash-gold)",
        fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem",
      }}>
        Loading Display...
  const headerSizeMult = state.headerFontSize ?? 1;
  const headerFamily = state.headerFontFamily || "Montserrat, sans-serif";
  const globalFamily = state.globalFontFamily || "Montserrat, sans-serif";

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", flexDirection: "column",
      position: "relative",
      overflow: "hidden", background: "var(--dash-bg)",
      fontFamily: globalFamily,
    }}>
      {/* CLICK-TO-START OVERLAY */}
      {!hasStarted && (
        <div 
          onClick={() => {
            window.dispatchEvent(new Event('force-video-play'));
            setHasStarted(true);
          }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            cursor: "pointer", display: "flex", flexDirection: "column", 
            justifyContent: "center", alignItems: "center",
            background: "linear-gradient(135deg, #0d0820 0%, #060212 100%)", color: "#fff",
            fontFamily: "Montserrat, sans-serif", zIndex: 99999
          }}
        >
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "rgba(168,85,247,0.2)", display: "flex", justifyContent: "center", alignItems: "center",
            marginBottom: "20px", border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 0 40px rgba(168,85,247,0.3)"
          }}>
            <div style={{
              width: "0", height: "0", 
              borderTop: "15px solid transparent", borderBottom: "15px solid transparent",
              borderLeft: "24px solid #fff", marginLeft: "8px"
            }} />
          </div>
          <h1 style={{ margin: 0, fontSize: "2rem", letterSpacing: "2px", color: "var(--dash-gold, #d4af37)" }}>
            START DISPLAY
          </h1>
          <p style={{ marginTop: "10px", color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>
            Click anywhere to initialize audio and begin
          </p>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #c41e22 0%, #a01518 100%)",
          padding: "12px 24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(196,30,34,0.3)",
        }}>
          <img
            src="/favicon.png"
            alt="AFC Logo"
            style={{
              position: "absolute", left: 0, top: 0,
              height: "100%", width: "auto", objectFit: "contain",
            }}
          />
          <h1 style={{
            margin: 0, color: "#fff",
            fontFamily: headerFamily,
            fontSize: `clamp(${0.7 * headerSizeMult}rem, ${1.6 * headerSizeMult}vw, ${2.2 * headerSizeMult}rem)`,
            letterSpacing: "2px", textTransform: "uppercase",
            fontWeight: 900,
          }}>
            {state.headerText || `WELLCOME TO ${state.companyName} : FOREIGN EXCHANGE RATES`}
          </h1>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, padding: "8px 10px", gap: "10px" }}>
        {/* LEFT: Exchange Rate Card */}
        <div style={{ flex: "1 1 0", height: "100%", minWidth: 0 }}>
          <ExchangeRateCard
            rates={state.currencies}
            companyName={state.companyName}
            fontSizeMultiplier={state.cardFontSize || 1}
            buyColor={state.buyColor || "#2ab7a9"}
            sellColor={state.sellColor || "#e63946"}
          />
        </div>

        {/* RIGHT: Video Panel */}
        <div style={{ flex: "1.4 1 0", height: "100%", minWidth: 0 }}>
          <VideoPanelNew
            companyName={state.companyName}
            displayMode={state.displayMode}
            announcementText={state.announcementText}
            companyInfo={state.companyInfo || { values: ["Relationships", "Results", "Reach", "Relevance"], vision: "", mission: "" }}
          />
        </div>
      </div>

      {/* ── TICKER ── */}
      <TickerBar
        rates={state.currencies}
        onAdminClick={() => setAdminMode("login")}
        speed={state.tickerSpeed || 1}
      />

      <FullscreenHint />

      {adminMode === "login" && (
        <LoginModalNew
          password={state.adminPassword}
          onLogin={(role) => setAdminMode(role === "super" ? "super" : "open")}
        />
      )}
      {adminMode === "open" && (
        <AdminDrawer state={state} onUpdate={handleUpdate} onClose={() => setAdminMode("closed")} />
      )}
      {adminMode === "super" && (
        <SuperAdminDrawer state={state} onUpdate={handleUpdate} onClose={() => setAdminMode("closed")} />
      )}
    </div>
  );
};

export default Index;
