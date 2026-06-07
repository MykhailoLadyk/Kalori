import { useState } from "react";
import { C, F } from "../../../lib/constans";
import { IconSignOut } from "../../../components/shared/DuoIcon";

export default function LogOutModal({ onClose }) {
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {};

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
            background: C.card,
            border: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSignOut size={26} color={C.soft} />
        </div>
      </div>

      {/* title */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Log Out
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            marginTop: 6,
          }}
        >
          You can log back in any time. Your data will be saved.
        </div>
      </div>

      {/* buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          onClick={onClose}
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
          onClick={!loading ? handleLogOut : undefined}
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
              color: C.text,
            }}
          >
            {loading ? "LOGGING OUT..." : "LOG OUT"}
          </span>
        </div>
      </div>
    </div>
  );
}
