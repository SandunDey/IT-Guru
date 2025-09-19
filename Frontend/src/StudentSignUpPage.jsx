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
    <div className="auth-wrapper">
      <div className="card">
        <header className="card__header">
          <h1 className="card__title">Create your Student account</h1>
          <p className="card__subtitle">Fill in your details to get started.</p>
        </header>

        {msg && (
          <div
            className={`alert ${msg.type === "success" ? "alert--success" : "alert--error"}`}
            role="status"
            aria-live="polite"
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="form" noValidate>
          <div className="form-grid">
            <div className="field">
              <label className="label" htmlFor="studentId">Student ID</label>
              <input className="input" id="studentId" name="studentId" value={form.studentId} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="name">Full Name</label>
              <input className="input" id="name" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="address">Address</label>
              <input className="input" id="address" name="address" value={form.address} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="year">Academic Year</label>
              <input className="input" type="number" id="year" name="year" min={2025} value={form.year} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="nic">NIC</label>
              <input className="input" id="nic" name="nic" placeholder="200012345678" value={form.nic} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="birthday">Birthday</label>
              <input className="input" type="date" id="birthday" name="birthday" value={form.birthday} onChange={onChange} />
            </div>
            <div className="field">
              <label className="label" htmlFor="gender">Gender</label>
              <select className="input" id="gender" name="gender" value={form.gender} onChange={onChange} required>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input className="input" type="email" id="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input className="input" type="password" id="password" name="password" value={form.password} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <input className="input" type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={onChange} required />
            </div>
            <div className="field">
              <label className="label" htmlFor="phonenumber">Phone Number</label>
              <input className="input" id="phonenumber" name="phonenumber" placeholder="+9471XXXXXXX" value={form.phonenumber} onChange={onChange} required />
            </div>
          </div>

          <div className="form__footer">
            <button type="button" className="btn btn--ghost" onClick={onClear} disabled={loading}>
              {loading ? "…" : "Clear"}
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? "Saving…" : "Create account"}
            </button>
          </div>

          <p className="fineprint">
            By signing up, you agree to our{" "}
            <a href="#" onClick={(e)=>e.preventDefault()}>Terms</a> and{" "}
            <a href="#" onClick={(e)=>e.preventDefault()}>Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
