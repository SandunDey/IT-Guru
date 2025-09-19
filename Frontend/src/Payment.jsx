import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Utilities (plain JS arrays)
const currencies = ["LKR", "USD", "EUR", "GBP", "INR"];
const methods = ["card", "bank", "cash", "wallet", "other"];
const statuses = ["pending", "succeeded", "failed", "refunded", "cancelled"];

export default function PaymentsPage() {
  // Query params
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [currency, setCurrency] = useState("");

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state (create)
  const [form, setForm] = useState({
    amount: "",
    currency: "LKR",
    method: "card",
    description: "",
    reference: "",
  });

  const params = useMemo(
    () => ({ q: q || undefined, status: status || undefined, method: method || undefined, currency: currency || undefined, page, limit }),
    [q, status, method, currency, page, limit]
  );

  async function fetchPayments() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/payment", { params });
      setList(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function createPayment(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = {
        amount: Number(form.amount),
        currency: form.currency,
        method: form.method,
        description: form.description || undefined,
        reference: form.reference || undefined,
      };
      await api.post("/payment", payload);
      setForm({ amount: "", currency: "LKR", method: "card", description: "", reference: "" });
      setPage(1);
      await fetchPayments();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function softDelete(id) {
    if (!confirm("Delete this payment?")) return;
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/payment/${id}`);
      await fetchPayments();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPayments(); /* eslint-disable-next-line */ }, [params]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Payments</h1>
          <button
            onClick={async () => {
              try {
                const { data } = await api.get("/payment/health");
                alert(JSON.stringify(data));
              } catch (e) {
                alert(e?.response?.data?.message || e.message);
              }
            }}
            className="px-3 py-2 rounded-xl shadow bg-white hover:bg-gray-100"
          >
            Health Check
          </button>
        </header>

        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-3">
          <input className="px-3 py-2 rounded-xl border" placeholder="Search (q)" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="px-3 py-2 rounded-xl border" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select className="px-3 py-2 rounded-xl border" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Method</option>
            {methods.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <select className="px-3 py-2 rounded-xl border" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="">Currency</option>
            {currencies.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 rounded-xl border" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {[5,10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
            </select>
            <button onClick={() => { setPage(1); fetchPayments(); }} className="px-3 py-2 rounded-xl shadow bg-white hover:bg-gray-100">Apply</button>
          </div>
        </div>

        {/* Create form */}
        <form onSubmit={createPayment} className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="text-lg font-medium">Create Payment</h2>
          <div className="grid md:grid-cols-5 gap-3">
            <input type="number" min={0} step="0.01" required className="px-3 py-2 rounded-xl border" placeholder="Amount" value={form.amount} onChange={(e) => setForm(v => ({...v, amount: e.target.value}))} />
            <select className="px-3 py-2 rounded-xl border" value={form.currency} onChange={(e) => setForm(v => ({...v, currency: e.target.value}))}>
              {currencies.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select className="px-3 py-2 rounded-xl border" value={form.method} onChange={(e) => setForm(v => ({...v, method: e.target.value}))}>
              {methods.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
            <input className="px-3 py-2 rounded-xl border" placeholder="Reference (optional, unique)" value={form.reference} onChange={(e) => setForm(v => ({...v, reference: e.target.value}))} />
            <input className="px-3 py-2 rounded-xl border md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm(v => ({...v, description: e.target.value}))} />
            <button type="submit" className="px-3 py-2 rounded-xl bg-black text-white shadow hover:opacity-90">Save</button>
          </div>
          <p className="text-sm text-gray-500">Required: amount, currency, method. Others optional.</p>
        </form>

        {/* List */}
        <div className="bg-white rounded-2xl shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2">Ref</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Currency</th>
                  <th className="px-3 py-2">Method</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {list?.data?.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-3 py-2">{p.reference || "—"}</td>
                    <td className="px-3 py-2">{p.amount}</td>
                    <td className="px-3 py-2">{p.currency}</td>
                    <td className="px-3 py-2">{p.method}</td>
                    <td className="px-3 py-2">{p.status}</td>
                    <td className="px-3 py-2">{p.description || ""}</td>
                    <td className="px-3 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => softDelete(p._id)} className="px-2 py-1 rounded-lg bg-red-600 text-white hover:opacity-90">Delete</button>
                    </td>
                  </tr>
                ))}
                {(!list || list.data.length === 0) && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-500">{loading ? "Loading..." : "No payments"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-3">
            <div className="text-sm text-gray-500">
              Page {list?.pagination?.page || page} of {list?.pagination?.pages || 1} • Total {list?.pagination?.total || 0}
            </div>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-xl border disabled:opacity-50">Prev</button>
              <button disabled={page >= (list?.pagination?.pages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-2 rounded-xl border disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700">{error}</div>
        )}
      </div>
    </div>
  );
}
