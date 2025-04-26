import React, { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });
    setMsg(error ? error.message : "Signup successful! Check your email.");
    if (!error) setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div
      className="mb-3 container text-light"
      style={{ minHeight: "100vh", paddingTop: "80px" }}
    >
      <form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary fs-4 mt-4 " type="submit">Sign Up</button>
        <p>{msg}</p>
      </form>
    </div>
  );
};

export default Signup;
