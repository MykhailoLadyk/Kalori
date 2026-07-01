import { useState } from "react";
import { C, F, alpha } from "../../../lib/constans";
import { Mono } from "../../../components/shared/Primitives";
import { IconTrash } from "../../../components/shared/DuoIcon";
import { supabase } from "../../../services/supabase";

export default function DeleteAccountModal({ handleClose }) {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isConfirmed = confirm === "DELETE";

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: rpcError } = await supabase.rpc('delete_user_account');
      if (rpcError) throw rpcError;
      
      // Account deleted, now sign out client side
      await supabase.auth.signOut();
      
      // Close modal (app will re-render to login page because session is null)
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* icon */}
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: alpha(C.red, 8),
            border: `1px solid ${alpha(C.red, 19)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconTrash size={26} color={C.red} />
        </div>
      </div>

      {/* title */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Delete Account
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          This will permanently delete your account and all data. This action
          cannot be undone.
        </div>
      </div>

      {/* what gets deleted */}
      <div
        style={{
          background: alpha(C.red, 3),
          border: `1px solid ${alpha(C.red, 13)}`,
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 20,
        }}
      >
        <Mono size={8} color={C.red}>
          What will be deleted
        </Mono>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginTop: 8,
          }}
        >
          {[
            "All meal logs",
            "Game progress & XP",
            "Body stats & goals",
            "Account & profile",
          ].map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: C.red,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: F.body, fontSize: 12, color: C.soft }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* confirmation input */}
      <div style={{ marginBottom: 16 }}>
        <Mono size={8} color={C.mutedLight}>
          Type DELETE to confirm
        </Mono>
        <input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          placeholder="DELETE"
          style={{
            width: "100%",
            marginTop: 6,
            background: C.card,
            border: `1px solid ${isConfirmed ? alpha(C.red, 38) : C.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            fontFamily: F.mono,
            fontSize: 13,
            color: isConfirmed ? C.red : C.text,
            outline: "none",
            transition: "border-color 0.2s",
            letterSpacing: 2,
          }}
        />
      </div>

      {error && (
        <div style={{ marginBottom: 12 }}>
          <Mono size={8} color={C.red}>
            {error}
          </Mono>
        </div>
      )}

      {/* buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          onClick={handleClose}
          className="hover-btn press"
          style={{
            flex: 1,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "13px 0",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 700,
              color: C.soft,
            }}
          >
            CANCEL
          </span>
        </div>
        <div
          onClick={isConfirmed && !loading ? handleDelete : undefined}
          className={isConfirmed ? "hover-btn press" : ""}
          style={{
            flex: 1,
            background: isConfirmed ? alpha(C.red, 13) : C.card,
            border: `1px solid ${isConfirmed ? alpha(C.red, 31) : C.border}`,
            borderRadius: 12,
            padding: "13px 0",
            textAlign: "center",
            cursor: isConfirmed ? "pointer" : "not-allowed",
            opacity: isConfirmed ? 1 : 0.4,
            transition: "all 0.2s",
          }}
        >
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 700,
              color: C.red,
            }}
          >
            {loading ? "DELETING..." : "DELETE"}
          </span>
        </div>
      </div>
    </div>
  );
}
