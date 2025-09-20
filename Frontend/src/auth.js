// src/auth.js
export function storeAuth(token, user, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("token", token || "");
  storage.setItem("user", JSON.stringify(user || {}));
}

export function getAuth() {
  const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  return { token, user: raw ? JSON.parse(raw) : null };
}

export function clearAuth() {
  ["localStorage", "sessionStorage"].forEach((area) => {
    try {
      const s = window[area];
      s.removeItem("token");
      s.removeItem("user");
    } catch {}
  });
}

export function hasRole(required) {
  const { user } = getAuth();
  const role = (user?.role || "").toLowerCase();
  if (Array.isArray(required)) return required.map((r) => r.toLowerCase()).includes(role);
  return role === String(required || "").toLowerCase();
}
