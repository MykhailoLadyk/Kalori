import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../../../lib/constants";
import { Mono, Tag } from "../../../components/shared/Primitives";
import analyzeFood from "../../../services/analyzeFood";
import { useFavorites } from "../../../hooks/useFavorites";
import { useUser } from "../../../hooks/useUser";
import { useGameStats } from "../../../hooks/useGameStats";
import { IconStar, IconStarOutline, IconSparkles, IconCoin, IconCrown } from "../../shared/DuoIcon";
import InsufficientCoinsModal from "./InsufficientCoinsModal";
import { AI_COIN_COST } from "../../../services/subscriptionService";

const OPTIONS = [
  {
    key: "photo",
    label: "Photo",
    sub: "Take a photo of your meal",
    isAi: true,
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Z"
          fill={color}
          opacity="0.2"
        />
        <circle cx="128" cy="132" r="36" fill={color} opacity="0.2" />
        <path
          d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.72,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.65-3.56L100.28,48h55.44l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8Z"
          fill={color}
        />
        <path
          d="M128,84a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,84Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,164Z"
          fill={color}
        />
      </svg>
    ),
    color: C.blue,
  },
  {
    key: "describe",
    label: "Describe",
    sub: "Describe what you ate",
    isAi: true,
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M216,48H40a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A8,8,0,0,0,216,48Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,112Zm0,32a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,144Zm0,32a8,8,0,0,1,8-8h40a8,8,0,0,1,0,16H88A8,8,0,0,1,80,176Z"
          fill={color}
        />
      </svg>
    ),
    color: C.accent,
  },
  {
    key: "album",
    label: "Album",
    sub: "Choose from your gallery",
    isAi: true,
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M216,24H88a16,16,0,0,0-16,16V72H40A16,16,0,0,0,24,88V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V184h32a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM88,40H216v93.37l-19.19-19.18a16,16,0,0,0-22.62,0L160,128.37l-18.34-18.35a16,16,0,0,0-22.63,0L104,125.37V88h0V40ZM168,216H40V88H88v37.37a16,16,0,0,0,22.63,0h0L128,107.31l18.35,18.34a16,16,0,0,0,22.62,0L184,110.55V168H168Z"
          fill={color}
        />
      </svg>
    ),
    color: C.pink,
  },
  {
    key: "manual",
    label: "Manual",
    sub: "Enter nutrition details",
    isAi: false,
    icon: (color) => (
      <svg width="26" height="26" viewBox="0 0 256 256" fill="none">
        <path
          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"
          fill={color}
          opacity="0.2"
        />
        <path
          d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
          fill={color}
        />
      </svg>
    ),
    color: C.gold,
  },
];

const Spinner = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export function MealAddOptionSelectModal() {
  const navigate = useNavigate();
  const { isPro } = useUser();
  const { gameData, deductCoins } = useGameStats();
  const fileInputRef = useRef(null);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCoinGate, setShowCoinGate] = useState(false);
  const { favorites, recentMeals } = useFavorites();

  const userCoins = gameData?.coins || 0;

  const handleOptionClick = (key, isAi) => {
    if (isAi && !isPro && userCoins < AI_COIN_COST) {
      setShowCoinGate(true);
      return;
    }

    if (key === "album") {
      fileInputRef.current?.click();
      return;
    }
    navigate(`/add-meal/${key}`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isPro && userCoins < AI_COIN_COST) {
      setShowCoinGate(true);
      e.target.value = "";
      return;
    }

    setAlbumLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const photoDataUrl = reader.result;
        const parsed = await analyzeFood(photoDataUrl);

        // Deduct coins for free tier
        if (!isPro) {
          await deductCoins(AI_COIN_COST, "Photo Album Scan");
        }

        navigate("/add-meal/confirm", { state: { meal: parsed, photoData: photoDataUrl, isAlbum: true } });
      } catch (err) {
        if (err.code === "RATE_LIMITED") {
          setError("Daily AI limit reached. Try again tomorrow.");
        } else {
          setError("Couldn't analyze the photo. Try again.");
        }
      } finally {
        setAlbumLoading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (showCoinGate) {
    return <InsufficientCoinsModal coins={userCoins} handleClose={() => setShowCoinGate(false)} />;
  }


  return (
    <div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text }}>Add Meal</div>
        <div style={{ fontFamily: F.body, fontSize: 13, color: C.soft, marginTop: 4 }}>
          How would you like to log it?
        </div>
      </div>

      {favorites.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <IconStar size={12} color={C.gold} />
            <Mono size={8} color={C.gold}>
              Favorites
            </Mono>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
            {favorites.map((fav) => (
              <div
                key={fav.id}
                onClick={() =>
                  navigate("/add-meal/confirm", {
                    state: {
                      meal: {
                        name: fav.name,
                        calories: fav.calories,
                        protein_g: fav.protein,
                        carbs_g: fav.carbs,
                        fat_g: fav.fat,
                        type: fav.type,
                      },
                    },
                  })
                }
                className="hover-card press"
                style={{
                  flexShrink: 0,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  minWidth: 120,
                  maxWidth: 160,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 4,
                  }}
                >
                  {fav.name}
                </div>
                <Mono size={8} color={C.muted}>
                  {fav.calories} kcal
                </Mono>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentMeals.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Mono size={8} color={C.mutedLight}>
            Recently Added
          </Mono>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
              marginTop: 8,
              scrollbarWidth: "none",
            }}
          >
            {recentMeals.map((meal, idx) => (
              <div
                key={`recent-${idx}`}
                onClick={() =>
                  navigate("/add-meal/confirm", {
                    state: {
                      meal: {
                        name: meal.name,
                        calories: meal.calories,
                        protein_g: meal.protein,
                        carbs_g: meal.carbs,
                        fat_g: meal.fat,
                        type: meal.type,
                      },
                    },
                  })
                }
                className="hover-card press"
                style={{
                  flexShrink: 0,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  minWidth: 120,
                  maxWidth: 160,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontFamily: F.body,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.text,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: 4,
                  }}
                >
                  {meal.name}
                </div>
                <Mono size={8} color={C.muted}>
                  {meal.calories} kcal
                </Mono>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Banner for Free Users */}
      {!isPro && (
        <div
          onClick={() => navigate("/premium")}
          className="hover-card press"
          style={{
            background: `linear-gradient(135deg, ${alpha(C.accent, 14)}, ${alpha(C.gold, 10)})`,
            border: `1px solid ${alpha(C.accent, 35)}`,
            borderRadius: 14,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconSparkles size={16} color={C.accent} />
            <div>
              <div style={{ fontFamily: F.head, fontSize: 12, fontWeight: 800, color: C.text }}>
                Upgrade to Kalori Pro
              </div>
              <Mono size={7} color={C.soft}>
                High-limit AI meal scanning with 0 coin cost
              </Mono>
            </div>
          </div>
          <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 800, color: C.accent }}>
            VIEW PRO ›
          </span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {OPTIONS.map(({ key, label, sub, isAi, icon, color }) => {
          const isAlbum = key === "album";
          const isLoading = isAlbum && albumLoading;
          const isDisabled = albumLoading && !isAlbum;

          return (
            <div
              key={key}
              onClick={() => !isDisabled && !isLoading && handleOptionClick(key, isAi)}
              className={isDisabled || isLoading ? "" : "hover-card press"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "14px 16px",
                cursor: isDisabled || isLoading ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.4 : 1,
                position: "relative",
                overflow: "hidden",
                transition: "opacity 0.2s",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: alpha(color, 9),
                  border: `1px solid ${alpha(color, 19)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {icon(color)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: C.text }}>
                    {label}
                  </span>
                  {isAi && !isPro && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        background: alpha(C.gold, 12),
                        border: `1px solid ${alpha(C.gold, 25)}`,
                        borderRadius: 6,
                        padding: "1px 6px",
                      }}
                    >
                      <IconCoin size={10} color={C.gold} />
                      <span style={{ fontFamily: F.mono, fontSize: 8, fontWeight: 800, color: C.gold }}>
                        50
                      </span>
                    </div>
                  )}
                </div>
                <Mono size={8} color={C.muted}>
                  {sub}
                </Mono>
              </div>

              {isLoading ? <Spinner color={color} /> : <span style={{ color: C.muted, fontSize: 18 }}>›</span>}

              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: alpha(color, 3),
                    border: `1px solid ${alpha(color, 19)}`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 16px",
                    animation: "fadeIn 0.2s ease both",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>


      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: alpha(C.red, 9),
            border: `1px solid ${alpha(C.red, 19)}`,
            borderRadius: 10,
          }}
        >
          <Mono size={8} color={C.red}>
            {error}
          </Mono>
        </div>
      )}
    </div>
  );
}
