import { supabase } from './supabase';

export interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
  buy: string;
  sell: string;
  against?: string;
}

export interface CompanyInfo {
  values: string[];
  vision: string;
  mission: string;
}

export interface AppState {
  currencies: CurrencyRate[];
  lastUpdated: string;
  adminPassword: string;
  companyName: string;
  displayMode: "video" | "announcement";
  announcementText: string;
  companyInfo: CompanyInfo;
  tickerSpeed?: number;
  cardFontSize?: number;
  buyColor?: string;
  sellColor?: string;
  headerText?: string;
  headerFontFamily?: string;
  headerFontSize?: number;
  globalFontFamily?: string;
}

export const DEFAULT_STATE: AppState = {
  currencies: [
    { code: "USD", name: "US DOLLAR", flag: "🇺🇸", countryCode: "us", buy: "6149", sell: "9988", against: "ZWG" },
    { code: "EUR", name: "EURO", flag: "🇪🇺", countryCode: "eu", buy: "8565", sell: "", against: "ZWG" },
    { code: "AED", name: "UAE DIRHAM", flag: "🇦🇪", countryCode: "ae", buy: "7654", sell: "", against: "ZWG" },
    { code: "GBP", name: "POUND STERLING", flag: "🇬🇧", countryCode: "gb", buy: "1119", sell: "13195", against: "ZWG" },
  ],
  lastUpdated: new Date().toISOString(),
  adminPassword: "admin123",
  companyName: "AFC BANK",
  displayMode: "video",
  announcementText: "Welcome to our exchange!",
  companyInfo: {
    values: ["Relationships", "Results", "Reach", "Relevance"],
    vision: "To become a strong valuable bank that builds relationships, transforms lives through productive communities, ecosystems and value chains",
    mission: "To transform how people produce, transact and grow wealth through upright and accessible banking.",
  },
  headerText: "WELLCOME TO AFC BANK : FOREIGN EXCHANGE RATES",
  headerFontFamily: "Montserrat, sans-serif",
  headerFontSize: 1,
  globalFontFamily: "Montserrat, sans-serif",
};

export async function loadState(): Promise<AppState> {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('state')
      .eq('id', 1)
      .single();
      
    if (data && data.state) {
      if (Array.isArray(data.state.currencies)) {
        return data.state as AppState;
      }
    }
  } catch (err) {
    console.error("Error loading state from Supabase:", err);
  }
  return { ...DEFAULT_STATE, currencies: DEFAULT_STATE.currencies.map(c => ({ ...c })) };
}

export async function saveState(state: AppState): Promise<void> {
  const updatedState = { ...state, lastUpdated: new Date().toISOString() };
  try {
    await supabase
      .from('app_state')
      .upsert({ id: 1, state: updatedState });
  } catch (err) {
    console.error("Error saving state to Supabase:", err);
  }
}

export async function fetchVideoUrls(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from('videos').list();
    if (error || !data) {
      console.error("Error listing videos:", error);
      return [];
    }
    const publicUrls = data
      .filter(file => file.name.match(/\.(mp4|webm|mov)$/i))
      .map(file => {
        return supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl;
      });
    return publicUrls;
  } catch (err) {
    console.error("Error getting video URLs:", err);
    return [];
  }
}

export function formatWithCommas(val: string): string {
  const parts = val.replace(/[^0-9.]/g, "").split(".");
  let intPart = parts[0];
  if (!intPart && parts.length === 1) return "—";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${intPart}.${parts[1]}`;
  }
  return intPart;
}

export function formatWithSpaces(val: string): string {
  const parts = val.replace(/[^0-9.]/g, "").split(".");
  let intPart = parts[0];
  if (!intPart && parts.length === 1) return "—";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  if (parts.length > 1) {
    return `${intPart}.${parts[1]}`;
  }
  return intPart;
}
