import React, { useState } from "react";
import api from "../utils/api";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phonenumber: "", address: "", year: "", nic: "", gender: "Male", birthday: ""
  });
  const [msg, setMsg] = useState(null);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/signup", form);
      setMsg({ type: "success", text: data.message || "Created" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div style={{maxWidth:600,margin:"2rem auto"}}>
      <h2>Student Sign Up</h2>
      {msg && <div style={{color: msg.type==="error"?"#b00020":"#006400"}}>{msg.text}</div>}
      <form onSubmit={submit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required /><br/>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required /><br/>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required /><br/>
        <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={onChange} required /><br/>
        <input name="phonenumber" placeholder="Phone (+94...)" value={form.phonenumber} onChange={onChange} required /><br/>
        <input name="address" placeholder="Address" value={form.address} onChange={onChange} /><br/>
        <input name="year" placeholder="Year/Class" value={form.year} onChange={onChange} /><br/>
        <input name="nic" placeholder="NIC" value={form.nic} onChange={onChange} /><br/>
        <input name="birthday" type="date" value={form.birthday} onChange={onChange} /><br/>
        <select name="gender" value={form.gender} onChange={onChange}>
          <option>Male</option><option>Female</option><option>Other</option>
        </select><br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
