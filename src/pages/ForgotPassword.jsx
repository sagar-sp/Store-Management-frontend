import { useState } from "react";
import { api } from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message + ` Use this demo link: ${response.data.resetLink}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Request failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
        <button type="submit">Send reset link</button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default ForgotPassword;
