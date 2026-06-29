// pages/AuthPage.jsx
import { useState } from "react";
import { C, F, alpha } from "../lib/constans";
import { Mono } from "../components/shared/Primitives";
import { supabase } from "../services/supabase";

// ── Kalori wordmark ───────────────────────────────────────────
const KaloriMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill={C.accent} opacity="0.15" />
    <rect
      width="36"
      height="36"
      rx="10"
      stroke={C.accent}
      strokeWidth="1"
      fill="none"
      opacity="0.4"
    />
    {/* fork */}
    <line
      x1="11"
      y1="8"
      x2="11"
      y2="14"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="8"
      x2="14"
      y2="14"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <line
      x1="17"
      y1="8"
      x2="17"
      y2="14"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M11 14 Q14 17 17 14"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    <line
      x1="14"
      y1="17"
      x2="14"
      y2="28"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* arc ring — calorie ring hint */}
    <path
      d="M22 10 A8 8 0 1 1 21.99 10"
      stroke={C.accent}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="18 6"
      opacity="0.5"
    />
    <circle cx="26" cy="18" r="2.5" fill={C.accent} />
  </svg>
);

// ── Social icon: Google ───────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// ── Input ─────────────────────────────────────────────────────
function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Mono size={8} color={C.mutedLight}>
          {label}
        </Mono>
        {error && (
          <Mono size={8} color={C.red}>
            {error}
          </Mono>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: C.card,
          border: `1px solid ${error ? alpha(C.red, 50) : focused ? C.accent : C.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          fontFamily: F.body,
          fontSize: 14,
          color: C.text,
          outline: "none",
          transition: "border-color 0.2s",
          minHeight: 46,
        }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // success message
  const [authError, setAuthError] = useState(null); // server error

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const clearState = () => {
    setErrors({});
    setAuthError(null);
    setMessage(null);
  };

  const switchMode = (m) => {
    clearState();
    setMode(m);
  };

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (isSignup && !name.trim()) e.name = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!isForgot && !password) e.password = "Required";
    else if (!isForgot && password.length < 6) e.password = "Min 6 characters";
    return e;
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    clearState();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // UserContext onAuthStateChange handles the rest
      }

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }, // stored in auth.users.user_metadata
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account.");
      }

      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("Password reset link sent — check your email.");
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: C.accent,
          opacity: 0.04,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* card */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          animation: "fadeUp 0.4s ease both",
        }}
      >
        {/* logo + wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 36,
          }}
        >
          <div style={{ animation: "bounceIn 0.6s ease both" }}>
            <KaloriMark />
          </div>
          <div
            style={{
              fontFamily: F.head,
              fontSize: 32,
              fontWeight: 900,
              color: C.accent,
              letterSpacing: -1,
              marginTop: 12,
              textShadow: `0 0 40px ${C.accentGlow}`,
              animation: "fadeUp 0.4s ease 0.1s both",
            }}
          >
            Kalori
          </div>
          <Mono
            size={8}
            color={C.muted}
            style={{ marginTop: 4, animation: "fadeUp 0.4s ease 0.15s both" }}
          >
            {isLogin && "TRACK · LEVEL UP · IMPROVE"}
            {isSignup && "START YOUR JOURNEY"}
            {isForgot && "RECOVER YOUR ACCOUNT"}
          </Mono>
        </div>

        {/* form card */}
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "24px",
            animation: "fadeUp 0.4s ease 0.2s both",
          }}
        >
          {/* tab switcher — login / signup */}
          {!isForgot && (
            <div
              style={{
                display: "flex",
                gap: 4,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 4,
                marginBottom: 24,
              }}
            >
              {[
                { id: "login", label: "Log In" },
                { id: "signup", label: "Sign Up" },
              ].map(({ id, label }) => (
                <div
                  key={id}
                  onClick={() => switchMode(id)}
                  className="press"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "8px 0",
                    borderRadius: 9,
                    cursor: "pointer",
                    background: mode === id ? C.accent : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: 9,
                      fontWeight: 700,
                      color: mode === id ? "#000" : C.muted,
                      letterSpacing: 1,
                    }}
                  >
                    {label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* forgot header */}
          {isForgot && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 18,
                  fontWeight: 900,
                  color: C.text,
                }}
              >
                Forgot Password
              </div>
              <div
                style={{
                  fontFamily: F.body,
                  fontSize: 13,
                  color: C.soft,
                  marginTop: 4,
                }}
              >
                Enter your email and we'll send a reset link.
              </div>
            </div>
          )}

          {/* success message */}
          {message && (
            <div
              style={{
                background: C.accentDim,
                border: `1px solid ${C.accentMid}`,
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
                display: "flex",
                gap: 8,
                alignItems: "center",
                animation: "fadeIn 0.2s ease both",
              }}
            >
              <span style={{ color: C.accent, fontSize: 14 }}>✓</span>
              <span
                style={{ fontFamily: F.body, fontSize: 12, color: C.accent }}
              >
                {message}
              </span>
            </div>
          )}

          {/* server error */}
          {authError && (
            <div
              style={{
                background: alpha(C.red, 6),
                border: `1px solid ${alpha(C.red, 19)}`,
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
                display: "flex",
                gap: 8,
                alignItems: "center",
                animation: "fadeIn 0.2s ease both",
              }}
            >
              <span style={{ color: C.red, fontSize: 14 }}>✕</span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.red }}>
                {authError}
              </span>
            </div>
          )}

          {/* fields */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
            onKeyDown={handleKeyDown}
          >
            {isSignup && (
              <AuthInput
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Your name"
                error={errors.name}
                autoComplete="name"
              />
            )}
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              error={errors.email}
              autoComplete="email"
            />
            {!isForgot && (
              <AuthInput
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={isSignup ? "Min 6 characters" : "Your password"}
                error={errors.password}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            )}
          </div>

          {/* forgot password link */}
          {isLogin && (
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <span
                onClick={() => switchMode("forgot")}
                className="press"
                style={{
                  fontFamily: F.mono,
                  fontSize: 8,
                  color: C.mutedLight,
                  cursor: "pointer",
                  letterSpacing: 1,
                }}
              >
                FORGOT PASSWORD?
              </span>
            </div>
          )}

          {/* submit */}
          <div
            onClick={!loading ? handleSubmit : undefined}
            className="hover-btn press"
            style={{
              marginTop: 20,
              background: loading ? C.accentDim : C.accent,
              borderRadius: 12,
              padding: "14px",
              textAlign: "center",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : `0 0 24px ${C.accentGlow}`,
              transition: "all 0.2s",
              minHeight: 48,
            }}
          >
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 11,
                fontWeight: 700,
                color: loading ? C.accent : "#000",
              }}
            >
              {loading
                ? "PLEASE WAIT..."
                : isLogin
                  ? "LOG IN"
                  : isSignup
                    ? "CREATE ACCOUNT"
                    : "SEND RESET LINK"}
            </span>
          </div>

          {/* divider */}
          {!isForgot && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  margin: "20px 0",
                }}
              >
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <Mono size={8} color={C.muted}>
                  OR
                </Mono>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>

              {/* google */}
              <div
                onClick={!loading ? handleGoogle : undefined}
                className="hover-btn press"
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  minHeight: 48,
                }}
              >
                <GoogleIcon />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.soft,
                  }}
                >
                  CONTINUE WITH GOOGLE
                </span>
              </div>
            </>
          )}
        </div>

        {/* back to login from forgot */}
        {isForgot && (
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              animation: "fadeIn 0.3s ease 0.3s both",
            }}
          >
            <span
              onClick={() => switchMode("login")}
              className="press"
              style={{
                fontFamily: F.mono,
                fontSize: 8,
                color: C.mutedLight,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              ← BACK TO LOG IN
            </span>
          </div>
        )}

        {/* terms */}
        {isSignup && (
          <div
            style={{
              textAlign: "center",
              marginTop: 16,
              padding: "0 8px",
              animation: "fadeIn 0.3s ease 0.3s both",
            }}
          >
            <span style={{ fontFamily: F.body, fontSize: 11, color: C.muted }}>
              By signing up you agree to our{" "}
              <span
                style={{
                  color: C.mutedLight,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Terms
              </span>{" "}
              and{" "}
              <span
                style={{
                  color: C.mutedLight,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </span>
            </span>
          </div>
        )}

        {/* version */}
        <div
          style={{
            textAlign: "center",
            marginTop: 24,
            animation: "fadeIn 0.3s ease 0.4s both",
          }}
        >
          <Mono size={7} color={C.muted}>
            KALORI V1.0 · MINT DARK
          </Mono>
        </div>
      </div>
    </div>
  );
}
