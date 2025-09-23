import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (name.trim().toLowerCase() === "rikta" && pw === "sayan123") {
      localStorage.setItem("auth", "1");
      nav("/");
    } else {
      setErr("Wrong name or password");
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Login</h1>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Password" />
        {err && <div className="error">{err}</div>}
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
