// SignupForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpStudent } from "./api";

const initial = {
  studentId: "",
  name: "",
  address: "",
  year: "2025",
  nic: "",
  birthday: "",
  gender: "Male",
  email: "",
  password: "",
  confirmPassword: "",
  phonenumber: "",
};

const nicRegex = /^([0-9]{9}[VX]|[0-9]{12})$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

export default function SignupForm() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.studentId || !form.name || !form.address) return "Fill required fields";
    const yearNum = Number(form.year);
    if (!Number.isInteger(yearNum) || yearNum < 2025) return "Year must be >= 2025";
    if (!nicRegex.test(form.nic.toUpperCase())) return "Invalid NIC";
    if (form.birthday && isNaN(Date.parse(form.birthday))) return "Invalid birthday";
    if (!emailRegex.test(form.email)) return "Invalid email";
    if (!phoneRegex.test(form.phonenumber)) return "Invalid phone number";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setMsg({ type: "error", text: error });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const payload = { ...form, year: Number(form.year), nic: form.nic.toUpperCase() };
      const { message } = await signUpStudent(payload);
      setMsg({ type: "success", text: message || "Signed up" });
      setForm(initial);
      navigate("/login", {
        replace: true,
        state: { flash: "Account created. Please log in." },
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => setForm(initial);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#124170] via-[#1C6EA4] to-[#222831] px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#124170]">Create your Student Account</h1>
          <p className="text-gray-600 mt-2">Fill in your details to get started.</p>
        </header>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              msg.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
            role="status"
            aria-live="polite"
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" noValidate>
          {/* Input Fields */}
          {[
            { id: "studentId", label: "Student ID", type: "text", required: true },
            { id: "name", label: "Full Name", type: "text", required: true },
            { id: "address", label: "Address", type: "text", required: true },
            { id: "year", label: "Academic Year", type: "number", min: 2025, required: true },
            { id: "nic", label: "NIC", type: "text", placeholder: "200012345678", required: true },
            { id: "birthday", label: "Birthday", type: "date" },
            {
              id: "gender",
              label: "Gender",
              type: "select",
              options: ["Male", "Female", "Other"],
              required: true,
            },
            { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
            { id: "password", label: "Password", type: "password", required: true },
            { id: "confirmPassword", label: "Confirm Password", type: "password", required: true },
            { id: "phonenumber", label: "Phone Number", type: "text", placeholder: "+9471XXXXXXX", required: true },
          ].map((field) => (
            <div key={field.id} className="flex flex-col">
              <label htmlFor={field.id} className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  name={field.id}
                  value={form[field.id]}
                  onChange={onChange}
                  required={field.required}
                  className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1C6EA4] focus:border-[#1C6EA4] px-3 py-2"
                >
                  {field.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  min={field.min}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={onChange}
                  required={field.required}
                  className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1C6EA4] focus:border-[#1C6EA4] px-3 py-2"
                />
              )}
            </div>
          ))}

          {/* Footer Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="px-5 py-2 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "…" : "Clear"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-semibold bg-[#124170] text-white shadow hover:bg-[#0d2f54] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving…" : "Create Account"}
            </button>
          </div>

          {/* Terms */}
          <p className="md:col-span-2 text-xs text-gray-500 mt-4 text-center">
            By signing up, you agree to our{" "}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1C6EA4] underline hover:text-[#124170]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1C6EA4] underline hover:text-[#124170]">
              Privacy Policy
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}
