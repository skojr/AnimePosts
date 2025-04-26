import React, { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setMsg(error ? error.message : "Login successful!");
    if (!error) setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="mb-3 container text-light" style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
        className="mt-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary fs-4 mt-3" type="submit">Log In</button>
        <p>{msg}</p>
      </form>
    </div>
  );
};

export default Login;
