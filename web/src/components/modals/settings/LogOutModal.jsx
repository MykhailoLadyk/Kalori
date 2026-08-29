import { useState } from "react";
import { useTranslation } from "react-i18next";
import { C, F } from "../../../lib/constants";
import { IconSignOut } from "../../../components/shared/DuoIcon";
import { supabase } from "../../../services/supabase";

export default function LogOutModal({ handleClose }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      handleClose();
    } catch (err) {
    } finally {
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
          {t("settings.logOut")}
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            marginTop: 6,
          }}
        >
          {t("settings.logOutSub")}
        </div>
      </div>

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
            {t("common.cancel")}
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
            {loading ? t("settings.saving") : t("settings.logOut").toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
