"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/admin";
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch {
      setError("Server unreachable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.root}>
      {/* Grid lines background */}
      <div style={styles.grid} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>ADMIN</div>
          <h1 style={styles.title}>Control Panel</h1>
          <p style={styles.subtitle}>Restricted access. Authorised personnel only.</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="admin@example.com"
              style={styles.input}
              autoComplete="username"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              "AUTHENTICATE →"
            )}
          </button>
        </div>

        <p style={styles.footer}>
          All activity is monitored and logged.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Courier New', Courier, monospace",
    position: "relative",
    overflow: "hidden",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#111",
    border: "1px solid #2a2a2a",
    padding: "40px",
    boxShadow: "0 0 60px rgba(255, 200, 0, 0.05), 0 0 0 1px #1a1a1a",
  },
  header: {
    marginBottom: "28px",
  },
  badge: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "#ffc800",
    border: "1px solid #ffc800",
    padding: "3px 8px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "12px",
    color: "#555",
    margin: 0,
    letterSpacing: "0.03em",
  },
  divider: {
    height: "1px",
    backgroundColor: "#1e1e1e",
    marginBottom: "28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#555",
  },
  input: {
    backgroundColor: "#0d0d0d",
    border: "1px solid #252525",
    color: "#e5e5e5",
    padding: "12px 14px",
    fontSize: "14px",
    fontFamily: "'Courier New', Courier, monospace",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "4px",
    backgroundColor: "#ffc800",
    color: "#0a0a0a",
    border: "none",
    padding: "14px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "'Courier New', Courier, monospace",
    letterSpacing: "0.15em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid #0a0a0a",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    display: "inline-block",
  },
  error: {
    fontSize: "12px",
    color: "#ff4d4d",
    margin: 0,
    padding: "10px 12px",
    backgroundColor: "#1a0000",
    border: "1px solid #3a0000",
  },
  footer: {
    marginTop: "24px",
    fontSize: "11px",
    color: "#333",
    textAlign: "center",
    letterSpacing: "0.05em",
  },
};