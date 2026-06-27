import { C, F, themesDefinitions } from "../../../lib/constans";
import { Tag } from "../../../components/shared/Primitives";
import { useState, useEffect } from "react";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";

function resolveThemeId(themeSetting, ownedThemes) {
  if (!themeSetting) return ownedThemes[0]?.id ?? null;

  const matched = ownedThemes.find(
    (theme) => theme.id === themeSetting || theme.name === themeSetting,
  );
  return matched?.id ?? ownedThemes[0]?.id ?? null;
}

export default function ThemeModal({ handleClose }) {
  const { user, updateUser } = useUser();
  const { shopItems } = useGameStats();
  const themesOwned = shopItems?.themesOwned ?? [];
  const ownedThemes = themesDefinitions.filter((theme) =>
    themesOwned.includes(theme.id),
  );

  const [selected, setSelected] = useState(() =>
    resolveThemeId(user?.settings?.theme, ownedThemes),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelected(resolveThemeId(user?.settings?.theme, ownedThemes));
  }, [user, ownedThemes]);

  const handleSelectTheme = async (theme) => {
    setSelected(theme.id);

    await updateUser({
      settings: {
        theme: theme.id,
      },
    });
  };

  const handleApply = () => {
    const selectedTheme = ownedThemes.find((theme) => theme.id === selected);
    if (!selectedTheme) return;

    handleClose();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: F.head,
            fontSize: 20,
            fontWeight: 900,
            color: C.text,
          }}
        >
          Themes
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {ownedThemes.map((theme) => {
          const isSelected = selected === theme.id;

          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              className="press"
              style={{
                background: C.card,
                border: `1px solid ${isSelected ? C.accent : C.border}`,
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", height: 44 }}>
                {theme.colors.map((col, i) => (
                  <div key={i} style={{ flex: 1, background: col }} />
                ))}
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                    }}
                  >
                    {theme.name}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isSelected && <Tag color={C.accent}>Selected</Tag>}
                </div>
              </div>
            </div>
          );
        })}
        {ownedThemes.length === 0 && (
          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "12px 14px",
              color: C.soft,
              fontFamily: F.body,
              fontSize: 13,
            }}
          >
            You do not own any themes yet.
          </div>
        )}
      </div>

      <div
        onClick={!loading ? handleApply : undefined}
        className="hover-btn press"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "13px",
          textAlign: "center",
          cursor: "pointer",
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
          {loading ? "APPLYING..." : "APPLY THEME"}
        </span>
      </div>
    </div>
  );
}
