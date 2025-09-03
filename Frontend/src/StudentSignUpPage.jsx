import React, { useMemo, useState } from "react";
import axios from "axios";

// Resolve API base from Vite or CRA envs (works in both)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  "";

// --- Validators ------------------------------------------------------------
const NIC_REGEX = /^([0-9]{9}[VvXx]|[0-9]{12})$/; // Sri Lanka NIC (old/new)
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues = {
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

function validate(values) {
  const errors = {};
  if (!values.staffId.trim()) errors.staffId = "Staff ID is required";
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.address.trim()) errors.address = "Address is required";

  if (!values.nic.trim()) errors.nic = "NIC is required";
  else if (!NIC_REGEX.test(values.nic.trim())) errors.nic = "Invalid NIC format";

  if (!values.gender) errors.gender = "Select a gender";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Invalid email";

  if (!values.password) errors.password = "Password is required";
  else if (values.password.length < 6) errors.password = "Minimum 6 characters";

  if (!values.confirmPassword) errors.confirmPassword = "Confirm your password";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Passwords do not match";

  if (!values.phonenumber.trim()) errors.phonenumber = "Phone number is required";
  else if (!PHONE_REGEX.test(values.phonenumber.trim()))
    errors.phonenumber = "Invalid phone number";

  if (!values.role) errors.role = "Role is required";

  return errors;
}

export default function AddStaffPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => Object.keys(validate(values)).length === 0, [values]);

  function handleChange(e) {
    const { name, value } = e.target;
    // Auto-format NIC to uppercase
    const next = name === "nic" ? value.toUpperCase() : value;
    setValues((v) => ({ ...v, [name]: next }));
    // Live-validate individual field
    setErrors((prev) => {
      const nextValues = { ...values, [name]: next };
      const v = validate(nextValues);
      return { ...prev, [name]: v[name] };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      setLoading(true);
      // Adjust endpoint to match your backend route
      const res = await axios.post(`${API_BASE}/api/staff`, {
        staffId: values.staffId.trim(),
        name: values.name.trim(),
        address: values.address.trim(),
        nic: values.nic.trim(),
        gender: values.gender,
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        phonenumber: values.phonenumber.trim(),
        role: values.role,
      }, { withCredentials: true });

      if (res.status >= 200 && res.status < 300) {
        setSuccess("Staff member added successfully.");
        setValues(initialValues);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to add staff";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Add New Staff</h1>
          <p className="text-gray-500 mt-1">Fill in the details and submit to create a staff account.</p>
        </header>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            {serverError}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Staff ID */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staffId">Staff ID *</label>
            <input
              id="staffId"
              name="staffId"
              type="text"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.staffId ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="STF-001"
              value={values.staffId}
              onChange={handleChange}
            />
            {errors.staffId && <p className="text-xs text-red-600 mt-1">{errors.staffId}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.name ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="Jane Doe"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="address">Address *</label>
            <input
              id="address"
              name="address"
              type="text"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.address ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="123, Example Road, Colombo"
              value={values.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>

          {/* NIC */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="nic">NIC *</label>
            <input
              id="nic"
              name="nic"
              type="text"
              className={`w-full rounded-xl border p-2.5 uppercase tracking-wider outline-none focus:ring-2 ${errors.nic ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="199012345678 or 900123456V"
              value={values.nic}
              onChange={handleChange}
            />
            {errors.nic && <p className="text-xs text-red-600 mt-1">{errors.nic}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.gender ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              value={values.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="name@example.com"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phonenumber">Phone *</label>
            <input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.phonenumber ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="+9471XXXXXXX"
              value={values.phonenumber}
              onChange={handleChange}
            />
            {errors.phonenumber && <p className="text-xs text-red-600 mt-1">{errors.phonenumber}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.role ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              value={values.role}
              onChange={handleChange}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
            {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.password ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="••••••"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`w-full rounded-xl border p-2.5 outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200"}`}
              placeholder="••••••"
              value={values.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setValues(initialValues); setErrors({}); setServerError(""); setSuccess(""); }}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className={`px-4 py-2 rounded-xl text-white ${loading || !isValid ? "bg-gray-400" : "bg-black hover:opacity-90"}`}
            >
              {loading ? "Saving..." : "Add Staff"}
            </button>
          </div>
        </form>

        {/* Tiny helper text */}
        <p className="text-[11px] text-gray-400 mt-4">
          By creating an account you confirm the details are correct. Required fields are marked with *. 
        </p>
      </div>
    </div>
  );
}
