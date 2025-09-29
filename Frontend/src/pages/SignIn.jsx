import React, { useState } from "react";
import api from "../utils/api";

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // select role
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password, role });
      // store token (localStorage) and pass user up if needed
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ ...data.user, role: data.role }));
      setMsg({ type: "success", text: "Login success" });
      if (onLogin) onLogin(data);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div style={{maxWidth:480,margin:"2rem auto"}}>
      <h2>Sign In</h2>
      {msg && <div style={{color: msg.type==="error"?"#b00020":"#006400"}}>{msg.text}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><br/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><br/>
        <label>Role:
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label><br/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
