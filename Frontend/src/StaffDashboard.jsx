// src/pages/StaffDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

/** Resolve API base from Vite or CRA envs (works in both) */
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "";

/** --- Validators --------------------------------------------------------- */
const NIC_REGEX = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

const emptyForm = {
  staffId: "",
  name: "",
  address: "",
  nic: "",
  gender: "",
  email: "",
  password: "",
  confirmPassword: "",
  phonenumber: "",
  role: "staff",
};

export default function StaffDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /** Fetch staff list */
  async function fetchStaff() {
    try {
      setLoading(true);
      setErr("");
      const res = await axios.get(`${API_BASE}/api/staff/viewStaffmember`, {
        withCredentials: true,
      });
      setRows(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Network Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  /** Client-side validation */
  function validate(values) {
    const v = {};
    if (!values.staffId.trim()) v.staffId = "Staff ID is required";
    if (!values.name.trim()) v.name = "Name is required";
    if (!values.address.trim()) v.address = "Address is required";
    if (!values.nic.trim()) v.nic = "NIC is required";
    else if (!NIC_REGEX.test(values.nic)) v.nic = "Invalid NIC format";
    if (!values.gender) v.gender = "Gender is required";
    if (!["Male", "Female", "Other"].includes(values.gender)) v.gender = "Invalid gender";
    if (!values.email.trim()) v.email = "Email is required";
    else if (!EMAIL_REGEX.test(values.email)) v.email = "Invalid email address";
    if (!values.phonenumber.trim()) v.phonenumber = "Phone is required";
    else if (!PHONE_REGEX.test(values.phonenumber)) v.phonenumber = "Invalid phone number";
    if (!values.role) v.role = "Role is required";
    return v;
  }

  const errors = useMemo(() => validate(form), [form, editingId]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setTouched({});
    setShowForm(true);
  }

  function openEdit(staff) {
    setForm({
      staffId: staff.staffId || "",
      name: staff.name || "",
      address: staff.address || "",
      nic: staff.nic || "",
      gender: staff.gender || "Male",
      email: staff.email || "",
      phonenumber: staff.phonenumber?.toString?.() || "",
      role: staff.role || "staff",
      password: "",
      confirmPassword: "",
    });
    setEditingId(staff._id);
    setTouched({});
    setShowForm(true);
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      setErr("");
      // ✅ match Express route: DELETE /deleteStaffmember/:id
      await axios.delete(`${API_BASE}/api/staff/deleteStaffmember/${id}`, {
        withCredentials: true,
      });
      setRows((r) => r.filter((x) => x._id !== id));
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Network Error");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({
      staffId: true, name: true, address: true, nic: true, gender: true,
      email: true, password: true, confirmPassword: true, phonenumber: true, role: true,
    });
    if (Object.keys(errors).length) return;

    try {
      setSubmitting(true);
      setErr("");
      if (editingId) {
        const payload = { ...form };
        // if password left blank, don't send it
        if (!payload.password) {
          delete payload.password;
          delete payload.confirmPassword;
        }
        // ✅ match Express route: PUT /updateStaffmember/:id
        const res = await axios.put(
          `${API_BASE}/api/staff/updateStaffmember/${editingId}`,
          payload,
          { withCredentials: true }
        );
        setRows((r) => r.map((x) => (x._id === editingId ? res.data : x)));
      } else {
        // ✅ match Express route: POST /register
        const res = await axios.post(`${API_BASE}/api/staff/register`, form, {
          withCredentials: true,
        });
        setRows((r) => [res.data, ...r]);
      }
      setShowForm(false);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Network Error");
    } finally {
      setSubmitting(false);
    }
  }

  /** UI helpers: filter, search, sort */
  const filtered = useMemo(() => {
    let list = [...rows];
    if (roleFilter !== "all") list = list.filter((x) => x.role === roleFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (x) =>
          x.name?.toLowerCase().includes(q) ||
          x.email?.toLowerCase().includes(q) ||
          x.staffId?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "role") return (a.role || "").localeCompare(b.role || "");
      if (sortBy === "email") return (a.email || "").localeCompare(b.email || "");
      return 0;
    });
    return list;
  }, [rows, query, roleFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Staff Dashboard</h1>
            <p className="text-sm text-slate-500">Manage admins, teachers, support and staff</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            + Add Staff
          </button>
        </div>

        {/* Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="Total Staff" value={rows.length} />
          <StatCard label="Admins" value={rows.filter((x) => x.role === "admin").length} />
          <StatCard label="Teachers" value={rows.filter((x) => x.role === "teacher").length} />
          <StatCard label="Support" value={rows.filter((x) => x.role === "support").length} />
        </div>

        {/* Toolbar */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            className="col-span-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
            placeholder="Search by name, email or Staff ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="support">Support</option>
              <option value="staff">Staff</option>
            </select>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort: Name</option>
              <option value="email">Sort: Email</option>
              <option value="role">Sort: Role</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <Th>STAFF ID</Th>
                <Th>NAME</Th>
                <Th>EMAIL</Th>
                <Th>ROLE</Th>
                <Th>PHONE</Th>
                <Th>ACTIONS</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <Td>{s.staffId}</Td>
                    <Td>{s.name}</Td>
                    <Td className="text-slate-600">{s.email}</Td>
                    <Td className="capitalize">{s.role}</Td>
                    <Td>{s.phonenumber}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button
                          className="rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-50"
                          onClick={() => openEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          onClick={() => onDelete(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="text-slate-400">No staff found.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Error banner */}
        {err && (
          <div className="mt-4 rounded-xl border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {err}
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                {editingId ? "Edit Staff" : "Add Staff"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2">
              <Field label="Staff ID" name="staffId" value={form.staffId} onChange={onChange}
                error={touched.staffId && errors.staffId}
                onBlur={() => setTouched((t) => ({ ...t, staffId: true }))} />
              <Field label="Name" name="name" value={form.name} onChange={onChange}
                error={touched.name && errors.name}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))} />
              <Field label="Address" name="address" value={form.address} onChange={onChange}
                error={touched.address && errors.address}
                onBlur={() => setTouched((t) => ({ ...t, address: true }))} />
              <Field label="NIC" name="nic" value={form.nic}
                onChange={(e) =>
                  onChange({ target: { name: "nic", value: e.target.value.toUpperCase() } })
                }
                error={touched.nic && errors.nic}
                onBlur={() => setTouched((t) => ({ ...t, nic: true }))} />
              <Select label="Gender" name="gender" value={form.gender} onChange={onChange}
                options={["Male", "Female", "Other"]}
                error={touched.gender && errors.gender}
                onBlur={() => setTouched((t) => ({ ...t, gender: true }))} />
              <Field label="Email" name="email" type="email" value={form.email} onChange={onChange}
                error={touched.email && errors.email}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))} />
              <Field label="Phone" name="phonenumber" value={form.phonenumber} onChange={onChange}
                placeholder="+9471XXXXXXX"
                error={touched.phonenumber && errors.phonenumber}
                onBlur={() => setTouched((t) => ({ ...t, phonenumber: true }))} />
              <Select label="Role" name="role" value={form.role} onChange={onChange}
                options={["staff", "admin", "teacher", "support"]}
                error={touched.role && errors.role}
                onBlur={() => setTouched((t) => ({ ...t, role: true }))} />
              <Field label={`Password ${editingId ? "(leave blank to keep)" : ""}`}
                name="password" type="password" value={form.password} onChange={onChange}
                error={touched.password && errors.password}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))} />
              <Field label={`Confirm Password ${editingId ? "(leave blank if unchanged)" : ""}`}
                name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange}
                error={touched.confirmPassword && errors.confirmPassword}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))} />

              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-1">
                <button type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setShowForm(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit"
                  className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-60"
                  disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>

            {err && (
              <div className="mx-5 mb-5 -mt-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
                {err}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Small presentational helpers */
function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-800">{value}</div>
    </div>
  );
}
function Th({ children }) {
  return <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-6 py-3 text-slate-700 ${className}`}>{children}</td>;
}
function Field({ label, name, value, onChange, onBlur, error, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none ${
          error ? "border-rose-400" : "border-slate-200 focus:border-slate-400"
        }`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
function Select({ label, name, value, onChange, onBlur, options, error }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm ${
          error ? "border-rose-400" : "border-slate-200 focus:border-slate-400"
        }`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o[0].toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
