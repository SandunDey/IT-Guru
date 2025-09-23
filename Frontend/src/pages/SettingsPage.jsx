// src/pages/SettingsPage.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Monitor, Sun, Moon, Bell, Mail, Smartphone, ShieldCheck, KeyRound,
  EyeOff, CheckCircle2, AlertCircle, Globe, Languages, Clock, Calendar,
  DollarSign, LogOut, Trash2, Save
} from "lucide-react";
import toast from "react-hot-toast";
import ChatBot from "../components/ChatBot/chatBot";
// import axios from "axios";

const LANGS = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල (Sinhala)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
];

const THEMES = [
  { value: "system", label: "System", icon: <Monitor size={16} /> },
  { value: "light", label: "Light", icon: <Sun size={16} /> },
  { value: "dark", label: "Dark", icon: <Moon size={16} /> },
];

const DATE_FORMATS = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2025-09-22)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (22/09/2025)" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (09/22/2025)" },
];

const CURRENCIES = [
  { value: "LKR", label: "LKR – Sri Lankan Rupee" },
  { value: "USD", label: "USD – US Dollar" },
  { value: "EUR", label: "EUR – Euro" },
];

export default function SettingsPage() {
  const systemTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  /* ---------- Preferences (NO profile editing here) ---------- */
  const [prefs, setPrefs] = useState({
    language: "en",
    theme: "system",
    timezone: systemTz || "Asia/Colombo",
    dateFormat: "YYYY-MM-DD",
    currency: "LKR",
  });

  const [notify, setNotify] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfilePublic: false,
    allowSearchEngines: false,
    readReceipts: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFA: false,
  });

  const [sessions, setSessions] = useState([
    { id: "this-device", device: "Windows • Chrome", where: "Colombo, LK", current: true, lastActive: "Now" },
    { id: "phone-1", device: "Android • App", where: "Kandy, LK", current: false, lastActive: "2 days ago" },
  ]);

  /* -------------------- Handlers -------------------- */
  const savePrefs = async (e) => {
    e.preventDefault();
    try {
      // await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/user/prefs`, prefs);
      applyTheme(prefs.theme);
      toast.success("Preferences saved");
    } catch (err) {
      toast.error("Failed to save preferences");
      console.error(err);
    }
  };

  const saveNotify = async (e) => {
    e.preventDefault();
    try {
      // await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/user/notifications`, notify);
      toast.success("Notification settings updated");
    } catch (err) {
      toast.error("Failed to update notifications");
      console.error(err);
    }
  };

  const savePrivacy = async (e) => {
    e.preventDefault();
    try {
      // await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/user/privacy`, privacy);
      toast.success("Privacy settings saved");
    } catch (err) {
      toast.error("Failed to save privacy");
      console.error(err);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (security.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/change-password`, {
      //   currentPassword: security.currentPassword,
      //   newPassword: security.newPassword,
      // });
      setSecurity((s) => ({ ...s, currentPassword: "", newPassword: "", confirmPassword: "" }));
      toast.success("Password changed");
    } catch (err) {
      toast.error("Failed to change password");
      console.error(err);
    }
  };

  const toggle2FA = async () => {
    try {
      // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/twofa/toggle`);
      setSecurity((s) => ({ ...s, twoFA: !s.twoFA }));
      toast.success(`Two-factor ${!security.twoFA ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error("Could not update 2FA");
      console.error(err);
    }
  };

  const logoutOthers = async () => {
    try {
      // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/sessions/revoke-others`);
      setSessions((arr) => arr.filter((x) => x.current));
      toast.success("Logged out from other devices");
    } catch (err) {
      toast.error("Failed to revoke sessions");
      console.error(err);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("This will permanently delete your account. Continue?")) return;
    try {
      // await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`);
      toast.success("Account deletion requested");
      // optional: navigate("/");
    } catch (err) {
      toast.error("Failed to delete account");
      console.error(err);
    }
  };

  // apply theme quickly on the client
  const applyTheme = (next) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const mode = next === "system" ? (prefersDark ? "dark" : "light") : next;
    root.classList.toggle("dark", mode === "dark");
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-10 px-4">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-blue-900">Settings</h1>
          <p className="text-blue-900/70">
            Language, theme, notifications, privacy & security. (No profile editing on this page.)
          </p>
        </header>

        {/* PREFERENCES */}
        <Card title="Preferences" icon={<Globe size={18} />}>
          <form onSubmit={savePrefs} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Language"
              icon={<Languages size={16} />}
              value={prefs.language}
              onChange={(v) => setPrefs((p) => ({ ...p, language: v }))}
              options={LANGS.map((l) => ({ value: l.code, label: l.label }))}
            />
            <Select
              label="Theme"
              icon={THEMES.find(t => t.value === prefs.theme)?.icon || <Monitor size={16} />}
              value={prefs.theme}
              onChange={(v) => setPrefs((p) => ({ ...p, theme: v }))}
              options={THEMES.map((t) => ({ value: t.value, label: t.label }))}
            />
            <TextField
              label="Timezone"
              icon={<Clock size={16} />}
              value={prefs.timezone}
              onChange={(v) => setPrefs((p) => ({ ...p, timezone: v }))}
              placeholder="e.g., Asia/Colombo"
            />
            <Select
              label="Date Format"
              icon={<Calendar size={16} />}
              value={prefs.dateFormat}
              onChange={(v) => setPrefs((p) => ({ ...p, dateFormat: v }))}
              options={DATE_FORMATS}
            />
            <Select
              label="Currency"
              icon={<DollarSign size={16} />}
              value={prefs.currency}
              onChange={(v) => setPrefs((p) => ({ ...p, currency: v }))}
              options={CURRENCIES}
            />

            <div className="md:col-span-2 flex justify-end">
              <PrimaryButton type="submit" label="Save Preferences" icon={<Save size={16} />} />
            </div>
          </form>
        </Card>

        {/* NOTIFICATIONS */}
        <Card title="Notifications" icon={<Bell size={18} />}>
          <form onSubmit={saveNotify} className="space-y-4">
            <Toggle
              label="Email notifications"
              icon={<Mail size={16} />}
              checked={notify.email}
              onChange={(v) => setNotify((n) => ({ ...n, email: v }))}
            />
            <Toggle
              label="SMS notifications"
              icon={<Smartphone size={16} />}
              checked={notify.sms}
              onChange={(v) => setNotify((n) => ({ ...n, sms: v }))}
            />
            <Toggle
              label="Push notifications"
              icon={<Bell size={16} />}
              checked={notify.push}
              onChange={(v) => setNotify((n) => ({ ...n, push: v }))}
            />
            <Toggle
              label="Marketing emails"
              icon={<CheckCircle2 size={16} />}
              checked={notify.marketing}
              onChange={(v) => setNotify((n) => ({ ...n, marketing: v }))}
            />
            <div className="flex justify-end pt-2">
              <PrimaryButton type="submit" label="Save Notifications" icon={<Save size={16} />} />
            </div>
          </form>
        </Card>

        {/* PRIVACY */}
        <Card title="Privacy" icon={<EyeOff size={18} />}>
          <form onSubmit={savePrivacy} className="space-y-4">
            <Toggle
              label="Show profile publicly"
              icon={<AlertCircle size={16} />}
              checked={privacy.showProfilePublic}
              onChange={(v) => setPrivacy((p) => ({ ...p, showProfilePublic: v }))}
            />
            <Toggle
              label="Allow search engines to index my profile"
              icon={<Globe size={16} />}
              checked={privacy.allowSearchEngines}
              onChange={(v) => setPrivacy((p) => ({ ...p, allowSearchEngines: v }))}
            />
            <Toggle
              label="Send read receipts"
              icon={<CheckCircle2 size={16} />}
              checked={privacy.readReceipts}
              onChange={(v) => setPrivacy((p) => ({ ...p, readReceipts: v }))}
            />
            <div className="flex justify-end pt-2">
              <PrimaryButton type="submit" label="Save Privacy" icon={<Save size={16} />} />
            </div>
          </form>
        </Card>

        {/* SECURITY */}
        <Card title="Security" icon={<ShieldCheck size={18} />}>
          <form onSubmit={changePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PasswordField
              label="Current Password"
              value={security.currentPassword}
              onChange={(v) => setSecurity((s) => ({ ...s, currentPassword: v }))}
            />
            <PasswordField
              label="New Password"
              value={security.newPassword}
              onChange={(v) => setSecurity((s) => ({ ...s, newPassword: v }))}
            />
            <PasswordField
              label="Confirm New Password"
              value={security.confirmPassword}
              onChange={(v) => setSecurity((s) => ({ ...s, confirmPassword: v }))}
            />
            <div className="md:col-span-3 flex items-center justify-between">
              <Toggle
                label={`Two-Factor Authentication (${security.twoFA ? "On" : "Off"})`}
                icon={<KeyRound size={16} />}
                checked={security.twoFA}
                onChange={() => toggle2FA()}
              />
              <PrimaryButton type="submit" label="Change Password" icon={<KeyRound size={16} />} />
            </div>
          </form>
        </Card>

        {/* ACTIVE SESSIONS */}
        <Card title="Active Sessions" icon={<Monitor size={18} />}>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-blue-900">
                    {s.device} {s.current && <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">This device</span>}
                  </p>
                  <p className="text-sm text-blue-900/70">{s.where} • Last active: {s.lastActive}</p>
                </div>
                {!s.current && (
                  <button
                    className="rounded-md border border-blue-200 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      setSessions((arr) => arr.filter((x) => x.id !== s.id));
                      toast.success("Logged out from that session");
                    }}
                  >
                    <LogOut size={16} className="inline -mt-0.5 mr-1" />
                    Log out
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={logoutOthers}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Log out of all other devices
              </button>
            </div>
          </div>
        </Card>

        {/* DANGER ZONE */}
        <Card title="Danger Zone" icon={<Trash2 size={18} />}>
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <div>
              <p className="font-semibold text-red-800">Delete Account</p>
              <p className="text-sm text-red-700/80">
                Permanently remove your account and data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={deleteAccount}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </Card>
      </div>
      <ChatBot/>
    </div>
  );
}

/* -------------------- Small UI components -------------------- */
function Card({ title, icon, children }) {
  return (
    <motion.section
      className="rounded-2xl bg-white p-6 shadow-lg"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-blue-800">
        {icon} {title}
      </h2>
      {children}
    </motion.section>
  );
}

function PrimaryButton({ label, icon, ...props }) {
  return (
    <button
      {...props}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {icon} {label}
    </button>
  );
}

function TextField({ label, icon, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">{icon} {label}</span>
      <input
        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Select({ label, icon, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">{icon} {label}</span>
      <select
        className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, icon, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
      <span className="flex items-center gap-2 text-blue-900">
        {icon} {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full p-0.5 transition ${checked ? "bg-blue-600" : "bg-gray-300"}`}
        aria-pressed={checked}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        <KeyRound size={16} /> {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="w-full rounded-lg border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff size={16} /> : <ShieldCheck size={16} />}
        </button>
      </div>
    </label>
  );
}
