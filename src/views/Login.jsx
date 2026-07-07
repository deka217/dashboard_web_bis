import { useState } from "react";
import { Lock, User } from "lucide-react";
import { api } from "../api";
import Logo from "../assets/BIS 1.png";
import "../styles.css";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.auth.login(username, password);
      if (response.success) {
        // Store admin info in localStorage
        localStorage.setItem("admin", JSON.stringify(response.admin));
        onLoginSuccess(response.admin);
      }
    } catch (err) {
      console.error('Login error', err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
    console.log('POST', `${API_BASE_URL}/auth/login`, { username, password });
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={Logo} alt="Logo" />
        </div>
        <h1>Admin Dashboard</h1>
        <p className="login-subtitle">BIS Web Application</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <User size={16} />
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn primary login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-center">
            <small>Default credentials: admin / b3stagr0123</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
