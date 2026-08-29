import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { C, F, alpha } from "../lib/constants";
import { Mono } from "../components/shared/Primitives";
import { IconStar, IconStarOutline, IconSparkles, IconCoin, IconCrown } from "../components/shared/DuoIcon";
import { useFavorites } from "../hooks/useFavorites";
import { useMeals } from "../hooks/useMeals";
import { useGameStats } from "../hooks/useGameStats";
import { useNotifications } from "../context/NotificationContext";
import { useUser } from "../hooks/useUser";
import { getLocalYMD } from "../lib/dateUtils";
import analyzeFood from "../services/analyzeFood";
import analyzeFoodDesc from "../services/analyzeFoodDesc";
import { Modal } from "../components/modals/Modal";
import InsufficientCoinsModal from "../components/modals/home/InsufficientCoinsModal";
import { AI_COIN_COST } from "../services/subscriptionService";

const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

export default function ConfirmMeal() {
  const { t } = useTranslation();
  const { addMeal, selectedDate } = useMeals();
  const { syncProgress, gameData, refreshGameData } = useGameStats();
  const { addNotification } = useNotifications();
  const { user, isPro } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const FIELD_CONFIG = [
    { key: "calories", label: t("meal.calories"), unit: "kcal", color: C.accent },
    { key: "protein", label: t("meal.protein"), unit: "g", color: C.blue },
    { key: "carbs", label: t("meal.carbs"), unit: "g", color: C.gold },
    { key: "fat", label: t("meal.fat"), unit: "g", color: C.pink },
  ];

  const userCoins = gameData?.coins || 0;
  const [showCoinGate, setShowCoinGate] = useState(false);


  const result = location.state?.meal;
  const photo = location.state?.photoData;
  const isAlbum = location.state?.isAlbum;
  const initialDescription = location.state?.description;
  // Get macro value from meal_total or sum from foods array
  const getMacro = (data, field) => {
    if (data?.meal_total?.[field] != null) return data.meal_total[field];
    if (data?.foods?.length > 0) {
      return data.foods.reduce((sum, f) => sum + (f[field] || 0), 0);
    }
    if (data?.[field] != null) return data[field];
    return "";
  };

  const [form, setForm] = useState({
    name: result?.name || result?.foods?.[0]?.name || "",
    calories: getMacro(result, "calories"),
    protein: getMacro(result, "protein_g"),
    carbs: getMacro(result, "carbs_g"),
    fat: getMacro(result, "fat_g"),
    type: result?.type ?? "breakfast",
  });

  const [confidence, setConfidence] = useState(result?.confidence || null);
  const [notes, setNotes] = useState(result?.notes || null);
  const [questions, setQuestions] = useState(result?.questions || []);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [customClarification, setCustomClarification] = useState("");
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isBusy = refining || loading;

  useEffect(() => {
    if (!isBusy) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBusy]);

  const { isFavorite, addFavorite, removeFavorite, getFavoriteByName } = useFavorites();
  const formIsFav = isFavorite(form.name);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSelectOption = (qIdx, opt) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: prev[qIdx] === opt ? null : opt,
    }));
  };

  const handleRefine = async () => {
    const answers = Object.entries(selectedAnswers)
      .filter(([_, opt]) => Boolean(opt))
      .map(([idx, opt]) => `${questions[idx]?.question || "Detail"}: ${opt}`);

    if (customClarification.trim()) {
      answers.push(customClarification.trim());
    }

    const clarificationQuery = answers.join(". ");
    if (!clarificationQuery) return;

    if (!isPro && userCoins < AI_COIN_COST) {
      setShowCoinGate(true);
      return;
    }

    try {
      setRefining(true);
      setRefineError(null);

      let refined;
      if (photo) {
        refined = await analyzeFood(photo, clarificationQuery);
      } else if (initialDescription) {
        refined = await analyzeFoodDesc(initialDescription, clarificationQuery);
      } else if (form.name) {
        refined = await analyzeFoodDesc(form.name, clarificationQuery);
      }

      if (refined) {
        // Server already deducted coins atomically for free users
        await refreshGameData();
        if (!isPro) {
          addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Refinement)` });
        }

        setForm((prev) => ({
          ...prev,
          name: refined.name || prev.name,
          calories: getMacro(refined, "calories"),
          protein: getMacro(refined, "protein_g"),
          carbs: getMacro(refined, "carbs_g"),
          fat: getMacro(refined, "fat_g"),
        }));
        if (refined.confidence) setConfidence(refined.confidence);
        if (refined.notes) setNotes(refined.notes);
        if (refined.questions) setQuestions(refined.questions);
        setSelectedAnswers({});
        setCustomClarification("");
      }
    } catch (err) {
      if (err.code === "RATE_LIMITED") {
        setRefineError("Daily AI limit reached.");
      } else if (err.code === "INSUFFICIENT_COINS") {
        setShowCoinGate(true);
      } else {
        setRefineError(err.code === "NO_FOOD_DETECTED" ? (err.message || "Couldn't refine food in image.") : (err.message || "Couldn't refine estimate. Try again."));
        await refreshGameData();
        if (!isPro) {
          addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Refinement)` });
        }
      }
    } finally {
      setRefining(false);
    }
  };


  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.name.trim().length > 100) newErrors.name = "Max 100 characters";

    const fields = [
      { key: "calories", max: 20000 },
      { key: "protein", max: 5000 },
      { key: "carbs", max: 5000 },
      { key: "fat", max: 5000 },
    ];
    fields.forEach(({ key, max }) => {
      const val = form[key];
      const n = Number(val);
      if (val === "" || val == null) newErrors[key] = "Required";
      else if (isNaN(n)) newErrors[key] = "Invalid";
      else if (n < 0) newErrors[key] = "Cannot be negative";
      else if (n > max) newErrors[key] = `Max ${max}`;
    });
    return newErrors;
  };

  const handleConfirm = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const mealDateStr = getLocalYMD(selectedDate);
      const todayStr = getLocalYMD(new Date());
      const isToday = mealDateStr === todayStr;

      const mealObj = {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fat: Number(form.fat || 0),
        date: mealDateStr,
      };
      await addMeal(mealObj);

      if (isToday) {
        await syncProgress(mealDateStr, true);
      }
      navigate("/");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="sy flex flex-col flex-1" style={{ animation: "fadeIn 0.22s ease both" }}>
      <div className="flex items-center" style={{ gap: 12, padding: "8px 22px 16px" }}>
        <div
          onClick={!isBusy ? () => navigate("/") : undefined}
          className={isBusy ? "flex items-center justify-center bg-card" : "press flex items-center justify-center bg-card"}
          style={{
            width: 36,
            height: 36,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            color: C.soft,
            cursor: isBusy ? "not-allowed" : "pointer",
            opacity: isBusy ? 0.35 : 1,
            pointerEvents: isBusy ? "none" : "auto",
          }}
        >
          <ChevronLeft />
        </div>
        <div className="font-head font-black text-primary" style={{ fontSize: 18 }}>
          {t("meal.confirmMeal")}
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "0 22px 22px" }}>
        {photo && (
          <div
            className="w-full relative overflow-hidden"
            style={{ height: 180, borderRadius: 16, marginBottom: 16, border: `1px solid ${C.border}` }}
          >
            <img src={photo} alt="meal" className="w-full h-full" style={{ objectFit: "cover" }} />
            {!isAlbum && (
              <div
                onClick={!isBusy ? () => navigate("/add-meal/photo") : undefined}
                className={isBusy ? "absolute" : "hover-btn press absolute"}
                style={{
                  bottom: 10,
                  right: 10,
                  background: alpha("#000", 63),
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "6px 12px",
                  cursor: isBusy ? "not-allowed" : "pointer",
                  opacity: isBusy ? 0.4 : 1,
                  pointerEvents: isBusy ? "none" : "auto",
                }}
              >
                <span className="font-mono font-bold" style={{ fontSize: 9, color: "#fff" }}>
                  {t("meal.retake")}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="font-body text-soft" style={{ fontSize: 13, marginBottom: 14 }}>
          {t("meal.reviewAndAdjust")}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Mono size={8} color={C.mutedLight}>
            {t("meal.mealType")}
          </Mono>
          <div className="flex" style={{ gap: 6, marginTop: 8 }}>
            {MEAL_TYPES.map((type) => (
              <div
                key={type}
                onClick={() => handleChange("type", type)}
                className="press flex-1 text-center cursor-pointer"
                style={{
                  padding: "9px 0",
                  borderRadius: 9,
                  background: form.type === type ? C.accent : C.card,
                  border: `1px solid ${form.type === type ? C.accent : C.border}`,
                  transition: "all 0.2s",
                }}
              >
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: 8, color: form.type === type ? "#000" : C.muted }}
                >
                  {t(`home.${type}`).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="flex justify-between" style={{ marginBottom: 5 }}>
            <Mono size={8} color={C.mutedLight}>
              {t("meal.name")}
            </Mono>
            {errors.name && (
              <Mono size={8} color={C.red}>
                {errors.name}
              </Mono>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("meal.namePlaceholder")}
              maxLength={50}
              className="w-full bg-card input-field"
              style={{
                flex: 1,
                border: `1px solid ${errors.name ? alpha(C.red, 50) : C.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                transition: "border-color 0.2s",
                minHeight: 46,
              }}
              onFocus={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.accent)}
              onBlur={(e) => (e.target.style.borderColor = errors.name ? alpha(C.red, 50) : C.border)}
            />
            <div
              onClick={() => {
                if (formIsFav) {
                  const fav = getFavoriteByName(form.name);
                  if (fav) removeFavorite(fav.id);
                } else {
                  addFavorite({
                    name: form.name,
                    calories: Number(form.calories) || 0,
                    protein: Number(form.protein) || 0,
                    carbs: Number(form.carbs) || 0,
                    fat: Number(form.fat) || 0,
                    type: form.type,
                  });
                }
              }}
              className="press flex items-center justify-center"
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                background: formIsFav ? alpha(C.gold, 9) : C.card,
                border: `1px solid ${formIsFav ? alpha(C.gold, 25) : C.border}`,
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {formIsFav ? <IconStar size={20} color={C.gold} /> : <IconStarOutline size={20} color={C.muted} />}
            </div>
          </div>
        </div>

        <div
          className="bg-card text-center"
          style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", marginBottom: 14 }}
        >
          <Mono size={8} color={C.mutedLight}>
            {t("meal.calories")}
          </Mono>
          <div className="flex items-center justify-center" style={{ gap: 6, marginTop: 6 }}>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => handleChange("calories", e.target.value)}
              className="font-head font-black text-accent text-right"
              style={{ width: 110, background: "transparent", border: "none", fontSize: 36, outline: "none" }}
            />
            <Mono size={11} color={C.muted}>
              kcal
            </Mono>
          </div>
          {errors.calories && (
            <div style={{ marginTop: 4 }}>
              <Mono size={8} color={C.red}>
                {errors.calories}
              </Mono>
            </div>
          )}
        </div>

        <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
          {FIELD_CONFIG.slice(1).map(({ key, label, unit, color }) => (
            <div
              key={key}
              className="flex-1 text-center"
              style={{
                background: alpha(color, 7),
                border: `1px solid ${alpha(color, 19)}`,
                borderRadius: 12,
                padding: "10px",
              }}
            >
              <Mono size={7} color={color}>
                {label}
              </Mono>
              <div className="flex items-baseline justify-center" style={{ gap: 3, marginTop: 4 }}>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="font-head text-primary text-right"
                  style={{
                    width: 42,
                    background: "transparent",
                    border: "none",
                    fontSize: 16,
                    fontWeight: 800,
                    outline: "none",
                  }}
                />
                <Mono size={8} color={C.muted}>
                  {unit}
                </Mono>
              </div>
              {errors[key] && (
                <div style={{ marginTop: 2 }}>
                  <Mono size={7} color={C.red}>
                    {errors[key]}
                  </Mono>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Confidence, Notes, Questions & Clarification */}
        {(confidence || notes || questions?.length > 0 || photo || initialDescription) && (
          <div
            className="bg-card"
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: "16px",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div className="flex items-center justify-between">
              <Mono size={8} color={C.mutedLight}>
                {t("meal.aiInsights")}
              </Mono>
              {confidence && (
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 8,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    textTransform: "uppercase",
                    background:
                      confidence.toLowerCase() === "high"
                        ? alpha(C.accent, 15)
                        : confidence.toLowerCase() === "medium"
                        ? alpha(C.gold, 15)
                        : alpha(C.orange || C.red, 15),
                    color:
                      confidence.toLowerCase() === "high"
                        ? C.accent
                        : confidence.toLowerCase() === "medium"
                        ? C.gold
                        : C.orange || C.red,
                    border: `1px solid ${
                      confidence.toLowerCase() === "high"
                        ? alpha(C.accent, 30)
                        : confidence.toLowerCase() === "medium"
                        ? alpha(C.gold, 30)
                        : alpha(C.orange || C.red, 30)
                    }`,
                  }}
                >
                  {t("meal.confidence", { level: confidence })}
                </span>
              )}
            </div>

            {notes && (
              <div className="font-body text-soft" style={{ fontSize: 12, lineHeight: 1.5 }}>
                {notes}
              </div>
            )}

            {questions?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                {questions.map((q, qIdx) => (
                  <div key={qIdx}>
                    <div className="font-body text-primary font-semibold" style={{ fontSize: 12, marginBottom: 6 }}>
                      {q.question}
                    </div>
                    <div className="flex flex-wrap" style={{ gap: 6 }}>
                      {q.options?.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === opt;
                        return (
                          <button
                            type="button"
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, opt)}
                            className="press"
                            style={{
                              background: isSelected ? C.accent : alpha(C.border, 40),
                              color: isSelected ? "#000" : C.soft,
                              border: `1px solid ${isSelected ? C.accent : C.border}`,
                              borderRadius: 8,
                              padding: "6px 10px",
                              fontFamily: F.mono,
                              fontSize: 9,
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 4 }}>
              <input
                type="text"
                value={customClarification}
                onChange={(e) => setCustomClarification(e.target.value)}
                placeholder={t("meal.clarifyPlaceholder")}
                className="w-full bg-card input-field"
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontFamily: F.body,
                  fontSize: 12,
                  color: C.text,
                  outline: "none",
                }}
              />
            </div>

            {(Object.values(selectedAnswers).some(Boolean) || customClarification.trim()) && (
              <div
                onClick={!refining ? handleRefine : undefined}
                className="hover-btn press flex items-center justify-center cursor-pointer"
                style={{
                  background: refining ? C.accentDim : alpha(C.accent, 15),
                  border: `1px solid ${C.accent}`,
                  borderRadius: 10,
                  padding: "12px",
                  gap: 6,
                  cursor: refining ? "not-allowed" : "pointer",
                }}
              >
                <IconSparkles size={14} color={C.accent} />
                <span className="font-mono font-bold" style={{ fontSize: 10, color: C.accent }}>
                  {refining
                    ? t("meal.updatingEstimate")
                    : isPro
                    ? t("meal.refineEstimate")
                    : <>{t("meal.refineEstimate")} · {AI_COIN_COST} <IconCoin size={11} color={C.accent} /></>}
                </span>
              </div>
            )}

            {refineError && (
              <Mono size={8} color={C.red}>
                {refineError}
              </Mono>
            )}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex" style={{ gap: 10, marginTop: 8 }}>
          <div
            onClick={!isBusy ? () => navigate("/") : undefined}
            className={isBusy ? "flex-1 bg-card text-center cursor-pointer" : "hover-btn press flex-1 bg-card text-center cursor-pointer"}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "15px",
              minHeight: 50,
              opacity: isBusy ? 0.4 : 1,
              cursor: isBusy ? "not-allowed" : "pointer",
              pointerEvents: isBusy ? "none" : "auto",
            }}
          >
            <span className="font-mono font-bold" style={{ fontSize: 10, color: C.soft }}>
              {t("common.cancel")}
            </span>
          </div>
          <div
            onClick={!isBusy ? handleConfirm : undefined}
            className={isBusy ? "text-center cursor-pointer" : "hover-btn press text-center cursor-pointer"}
            style={{
              flex: 2,
              background: isBusy ? C.accentDim : C.accent,
              borderRadius: 12,
              padding: "15px",
              minHeight: 50,
              cursor: isBusy ? "not-allowed" : "pointer",
            }}
          >
            <span className="font-mono font-bold" style={{ fontSize: 11, color: isBusy ? C.accent : "#000" }}>
              {loading ? t("meal.saving") : refining ? t("meal.refining") : t("meal.addMeal")}
            </span>
          </div>
        </div>
      </div>

      <Modal id={showCoinGate} close={() => setShowCoinGate(false)}>
        <InsufficientCoinsModal coins={userCoins} handleClose={() => setShowCoinGate(false)} />
      </Modal>
    </div>
  );
}

