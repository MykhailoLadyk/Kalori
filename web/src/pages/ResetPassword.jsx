import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../lib/constants";
import { Mono } from "../components/shared/Primitives";
import { supabase } from "../services/supabase";
import { IconCheck, IconX } from "../components/shared/DuoIcon";

// ── Kalori wordmark ───────────────────────────────────────────
const KaloriMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill={C.accent} opacity="0.15" />
    <rect width="36" height="36" rx="10" stroke={C.accent} strokeWidth="1" fill="none" opacity="0.4" />
    <line x1="11" y1="8" x2="11" y2="14" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="8" x2="14" y2="14" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" />
    <line x1="17" y1="8" x2="17" y2="14" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 14 Q14 17 17 14" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <line x1="14" y1="17" x2="14" y2="28" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" />
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuthError(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const validate = () => {
    const e = {};
    if (!password) e.password = "Required";
    else if (password.length < 6) e.password = "Min 6 characters";
    if (!confirmPassword) e.confirmPassword = "Required";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleReset = async () => {
    setErrors({});
    setAuthError(null);

    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setAuthError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleReset();
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: C.bg,
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

      <div className="w-full max-w-full" style={{ maxWidth: 400, animation: "fadeUp 0.4s ease both" }}>
        {/* logo + wordmark */}
        <div className="flex flex-col items-center mb-8">
          <div style={{ animation: "bounceIn 0.6s ease both" }}>
            <KaloriMark />
          </div>
          <div
            className="font-head font-black text-accent"
            style={{
              fontSize: 32,
              letterSpacing: -1,
              marginTop: 12,
              textShadow: `0 0 40px ${C.accentGlow}`,
              animation: "fadeUp 0.4s ease 0.1s both",
            }}
          >
            Kalori
          </div>
          <Mono size={8} color={C.muted} style={{ marginTop: 4, animation: "fadeUp 0.4s ease 0.15s both" }}>
            SET NEW PASSWORD
          </Mono>
        </div>

        {/* form card */}
        <div
          className="bg-panel"
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "24px",
            animation: "fadeUp 0.4s ease 0.2s both",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: F.head, fontSize: 18, fontWeight: 900, color: C.text }}>
              Reset Password
            </div>
            <div style={{ fontFamily: F.body, fontSize: 13, color: C.soft, marginTop: 4 }}>
              Enter a new secure password for your account.
            </div>
          </div>

          {success && (
            <div
              style={{
                background: C.accentDim,
                border: `1px solid ${C.accentMid}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 16,
                display: "flex",
                gap: 8,
                alignItems: "center",
                animation: "fadeIn 0.2s ease both",
              }}
            >
              <span className="flex" style={{ color: C.accent }}><IconCheck size={16} /></span>
              <span style={{ fontFamily: F.body, fontSize: 13, color: C.accent }}>
                Password updated! Redirecting into Kalori...
              </span>
            </div>
          )}

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
              <span className="flex" style={{ color: C.red }}><IconX size={14} /></span>
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.red }}>{authError}</span>
            </div>
          )}

          {!success && (
            <div className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Mono size={8} color={C.mutedLight}>
                    New Password
                  </Mono>
                  {errors.password && (
                    <Mono size={8} color={C.red}>
                      {errors.password}
                    </Mono>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  className="w-full input-field bg-card"
                  style={{
                    border: `1px solid ${errors.password ? alpha(C.red, 50) : C.border}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    minHeight: 46,
                    color: C.text,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Mono size={8} color={C.mutedLight}>
                    Confirm Password
                  </Mono>
                  {errors.confirmPassword && (
                    <Mono size={8} color={C.red}>
                      {errors.confirmPassword}
                    </Mono>
                  )}
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full input-field bg-card"
                  style={{
                    border: `1px solid ${errors.confirmPassword ? alpha(C.red, 50) : C.border}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    minHeight: 46,
                    color: C.text,
                    outline: "none",
                  }}
                />
              </div>

              <div
                onClick={!loading ? handleReset : undefined}
                className="hover-btn press text-center"
                style={{
                  marginTop: 16,
                  background: loading ? C.accentDim : C.accent,
                  borderRadius: 12,
                  padding: "14px",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : `0 0 24px ${C.accentGlow}`,
                  transition: "all 0.2s",
                  minHeight: 48,
                }}
              >
                <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
                  {loading ? "UPDATING PASSWORD..." : "UPDATE PASSWORD"}
                </span>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span
              onClick={() => navigate("/login")}
              className="press"
              style={{ fontFamily: F.mono, fontSize: 8, color: C.mutedLight, cursor: "pointer", letterSpacing: 1 }}
            >
              ← BACK TO LOG IN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
