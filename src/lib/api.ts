import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "https://vizera-backend.delightfulrock-67d9a4d2.uksouth.azurecontainerapps.io/v1";
const TOKEN_KEY = "vizera_token";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

function extractErrorMessage(detail: any, status: number): string {
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (item && typeof item === "object" ? item.msg || JSON.stringify(item) : String(item)))
      .join(", ");
  }
  if (detail && typeof detail === "object") {
    return detail.msg || JSON.stringify(detail);
  }
  return `Request failed with status ${status}`;
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data?.detail, response.status));
  }

  return data;
}

export type MerchantSignup = {
  business_name: string;
  email?: string;
  phone_number?: string;
  password: string;
  consent_given: boolean;
};

export async function signup(data: MerchantSignup) {
  return request("/merchants/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(identifier: string, password: string) {
  const data = await request("/merchants/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  await saveToken(data.access_token);
  return data;
}

export type MerchantProfile = {
  merchant_type: string;
  location: string;
  years_operating: number;
  payment_methods: string[];
};

export async function completeProfile(data: MerchantProfile) {
  return request("/merchants/me/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getMyProfile() {
  return request("/merchants/me");
}

export async function getMyPulse() {
  return request("/merchants/me/pulse");
}

export async function markConnectPromptShown() {
  return request("/merchants/me/connect-prompt-shown", {
    method: "PATCH",
  });
}

export async function logVoiceActivity(transcript: string) {
  return request("/activities/voice-log", {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });
}

export async function getMyActivities(skip = 0, limit = 20) {
  return request(`/activities/mine?skip=${skip}&limit=${limit}`);
}

export async function logout() {
  await clearToken();
}
