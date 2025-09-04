// src/pages/StaffPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

/** Resolve API base (Vite or fallback) */
const API_BASE = (
  import.meta?.env?.VITE_BACKEND_URL ||
  import.meta?.env?.VITE_API_BASE_URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

if (!API_BASE) {
  console.warn("Missing API base URL. Set VITE_BACKEND_URL or VITE_API_BASE_URL in your .env");
}

/** Validators to match your schema (frontend) */
const NIC_REGEX = /^([0-9]{9}[VX]|[0-9]{12})$/i; // Sri Lanka NIC (old/new)
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const emptyForm = {
  staffId: "",
  name: "",
  address: "",
  nic: "",
  gender: "Male",
  email: "",
  password: "",
  confirmPassword: "",
  phonenumber: "",
  role: "staff", // default
};

export default function StaffPage() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  // UI state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // staffId when editing
  const [q, setQ] = useState("");

  // Form
  const [form, setForm] = useState(emptyForm);
  const resetForm = () => setForm(emptyForm);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ---- LOAD ----
  async function load() {
    try {
      setBusy(true);
      const { data } = await axios.get(`${API_BASE}/api/Staff/viewStaffmember`, {
        // withCredentials: true, // enable only if your API uses cookies/sessions
      });

      // Accept several common shapes
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.result)
        ? data.result
        : Array.isArray(data?.staff)
        ? data.staff
        : Array.isArray(data?.Staff)
        ? data.Staff
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setRows(list);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load staff";
      toast.error(String(msg));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ---- CREATE ----
  async function onCreate(e) {
    e.preventDefault();

    // basic validations
    if (!form.staffId.trim()) return toast.error("Staff ID is required");
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!NIC_REGEX.test(form.nic)) return toast.error("Invalid NIC");
    if (!EMAIL_REGEX.test(form.email)) return toast.error("Invalid email");
    if (!PHONE_REGEX.test(String(form.phonenumber)))
      return toast.error("Invalid phone");
    if (!form.password || form.password.length < 6)
      return toast.error("Password min length is 6");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (!form.role) return toast.error("Role is required");

    try {
      setBusy(true);
      await axios.post(
        `${API_BASE}/api/Staff/register`,
        {
          staffId: form.staffId.trim(),
          name: form.name.trim(),
          address: form.address.trim(),
          nic: form.nic.trim().toUpperCase(),
          gender: form.gender,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          phonenumber: String(form.phonenumber).trim(),
          role: form.role, // <-- from form control
        },
        { withCredentials: true }
      );
      toast.success("Staff added");
      setOpen(false);
      resetForm();
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      toast.error(String(msg || "Failed to add"));
    } finally {
      setBusy(false);
    }
  }

  // ---- START EDIT ----
  function startEdit(row) {
    setEditingId(row.staffId);
    setForm({
      staffId: row.staffId ?? "",
      name: row.name ?? "",
      address: row.address ?? "",
      nic: row.nic ?? "",
      gender: row.gender ?? "Male",
      email: row.email ?? "",
      password: "",
      confirmPassword: "",
      phonenumber: row.phonenumber ?? "",
      role: row.role ?? "staff", // keep existing
    });
    setOpen(true);
  }

  // ---- UPDATE ----
  async function onUpdate(e) {
    e.preventDefault();
    if (!editingId) return toast.error("Missing staffId for update");

    if (!form.staffId.trim()) return toast.error("Staff ID is required");
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!NIC_REGEX.test(form.nic)) return toast.error("Invalid NIC");
    if (!EMAIL_REGEX.test(form.email)) return toast.error("Invalid email");
    if (!PHONE_REGEX.test(String(form.phonenumber)))
      return toast.error("Invalid phone");
    if (!form.role) return toast.error("Role is required");

    if (
      (form.password || form.confirmPassword) &&
      form.password !== form.confirmPassword
    ) {
      return toast.error("Passwords do not match");
    }

    const payload = {
      staffId: form.staffId.trim(),
      name: form.name.trim(),
      address: form.address.trim(),
      nic: form.nic.trim().toUpperCase(),
      gender: form.gender,
      email: form.email.trim().toLowerCase(),
      phonenumber: String(form.phonenumber).trim(),
      role: form.role, // <-- include role on update too
    };
    if (form.password) {
      payload.password = form.password;
      payload.confirmPassword = form.confirmPassword;
    }

    try {
      setBusy(true);
      await axios.put(
        `${API_BASE}/api/Staff/updateStaffmember/${encodeURIComponent(
          form.staffId
        )}`,
        payload,
        { withCredentials: true }
      );
      toast.success("Staff updated");
      setOpen(false);
      setEditingId(null);
      resetForm();
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      toast.error(String(msg || "Failed to update"));
    } finally {
      setBusy(false);
    }
  }

  // ---- DELETE ----
  async function onDelete(row) {
    const id = row?.staffId;
    if (!id) return toast.error("Missing staffId");
    if (!confirm(`Delete staff ${id}?`)) return;

    try {
      setBusy(true);
      await axios.delete(
        `${API_BASE}/api/Staff/deleteStaffmember/${encodeURIComponent(id)}`,
        { withCredentials: true }
      );
      toast.success("Staff deleted");
      await load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      toast.error(String(msg || "Failed to delete"));
    } finally {
      setBusy(false);
    }
  }

  // ---- SEARCH ----
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const phone = String(r.phonenumber ?? "").toLowerCase();
      return [
        r.staffId,
        r.name,
        r.address,
        r.nic,
        r.gender,
        r.email,
        phone,
        r.role,
      ]
        .map((x) => String(x ?? "").toLowerCase())
        .some((x) => x.includes(s));
    });
  }, [q, rows]);

  return (
    <div className="p-6">
      <Toaster />
      <div className="mx-auto w-full max-w-screen-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-black">Staff</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search staff by any field…"
                className="w-80 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              Add Staff
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-gray-100 px-6 py-3 text-xs font-semibold text-gray-500">
              <div>Staff ID</div>
              <div>Name</div>
              <div>Address</div>
              <div>NIC</div>
              <div>Gender</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Role</div>
              <div className="col-span-3 text-right pr-4">Actions</div>
            </div>

            {busy ? (
              <div className="p-6 text-sm text-gray-500">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No staff found</div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r._id || r.staffId}
                  className="grid grid-cols-12 gap-x-6 gap-y-4 px-6 py-3 text-sm text-gray-800 border-b last:border-none"
                >
                  <div className="font-mono">{r.staffId ?? "-"}</div>
                  <div className="truncate">{r.name ?? "-"}</div>
                  <div className="truncate">{r.address ?? "-"}</div>
                  <div>{r.nic ?? "-"}</div>
                  <div>{r.gender ?? "-"}</div>
                  <div className="truncate">{r.email ?? "-"}</div>
                  <div className="truncate">{r.phonenumber ?? "-"}</div>
                  <div>{r.role ?? "-"}</div>
                  <div className="col-span-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drawer / Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Staff" : "Add Staff"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={editingId ? onUpdate : onCreate}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Staff ID *</span>
                  <input
                    name="staffId"
                    value={form.staffId}
                    onChange={onChange}
                    required
                    disabled={!!editingId}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500 disabled:bg-gray-100"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block md:col-span-2">
                  <span className="mb-1 block font-medium">Address *</span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">NIC *</span>
                  <input
                    name="nic"
                    value={form.nic}
                    onChange={onChange}
                    required
                    placeholder="123456789V or 200012345678"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Gender *</span>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Email *</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Phone *</span>
                  <input
                    name="phonenumber"
                    value={form.phonenumber}
                    onChange={onChange}
                    required
                    placeholder="+9477XXXXXXX or 077XXXXXXX"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </label>

                {/* ✅ ROLE select (create & update) */}
                <label className="text-sm block">
                  <span className="mb-1 block font-medium">Role *</span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                  >
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                    <option value="teacher">teacher</option>
                  </select>
                </label>

                {/* Passwords only required on create */}
                {!editingId && (
                  <>
                    <label className="text-sm block">
                      <span className="mb-1 block font-medium">Password *</span>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                      />
                    </label>

                    <label className="text-sm block">
                      <span className="mb-1 block font-medium">
                        Confirm Password *
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={onChange}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                      />
                    </label>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  {editingId ? "Update Staff" : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top progress bar */}
      <div
        className={`pointer-events-none fixed left-0 top-0 h-0.5 bg-red-600 transition-all ${
          busy ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}
