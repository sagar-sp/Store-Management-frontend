import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" required />
        <button type="submit">Reset</button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default ResetPassword;
