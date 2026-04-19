import { useState, useCallback, useEffect } from "react";
import { loadState, saveState, fetchVideoUrls, AppState } from "@/lib/store";
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
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [adminMode, setAdminMode] = useState<"closed" | "login" | "open" | "super">("closed");

  useEffect(() => {
    const init = async () => {
      const s = await loadState();
      setState(s);
      const vp = await fetchVideoUrls();
      setPlaylist(vp);
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

    const iv = setInterval(async () => {
      const vp = await fetchVideoUrls();
      if (vp.length > 0) setPlaylist(vp);
    }, 3600000);

    return () => { clearInterval(iv); supabase.removeChannel(channel); };
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
      </div>
    );
  }

  const headerSizeMult = state.headerFontSize ?? 1;
  const headerFamily = state.headerFontFamily || "Montserrat, sans-serif";
  const globalFamily = state.globalFontFamily || "Montserrat, sans-serif";

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden", background: "var(--dash-bg)",
      fontFamily: globalFamily,
    }}>
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
            playlist={playlist}
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
