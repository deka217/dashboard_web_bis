import { useState } from "react";
import { api } from "../api";

function ChangePassword({ admin, onPasswordChanged }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleChangePassword(e) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);

    try {
      await api.auth.changePassword(admin.adminID, currentPassword, newPassword);
      setNotice("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onPasswordChanged) {
        onPasswordChanged();
      }
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-page">
      <div className="panel">
        <h3>Change Password</h3>

        {error && <div className="alert error">{error}</div>}
        {notice && <div className="alert success">{notice}</div>}

        <form onSubmit={handleChangePassword} className="form-grid" style={{ maxWidth: "400px" }}>
          <label>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>Current Password</span>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>New Password</span>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <label>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>Confirm New Password</span>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </label>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>

        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "20px" }}>
          Password must be at least 6 characters and different from the current password.
        </p>
      </div>
    </div>
  );
}

export default ChangePassword;
