import { useState } from "react";
import { C, F, alpha } from "../../../lib/constants";
import { Mono } from "../../shared/Primitives";
import { useUser } from "../../../hooks/useUser";
import { useStats } from "../../../hooks/useStats";
import { logWeight } from "../../../services/weightService";
import { calcMacros, calculateTargets } from "../../../lib/macroCalc";
import { getTodayDateString } from "../../../lib/dateUtils";

export function WeightLogModal({ handleClose, initialDate }) {
  const { user, updateUser } = useUser();
  const { refreshStats } = useStats();

  const userUnit = user?.settings?.weight_unit || "kg";
  const [weight, setWeight] = useState(user?.settings?.weight || "");
  const [unit, setUnit] = useState(userUnit);
  const [date, setDate] = useState(initialDate || getTodayDateString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!weight || Number(weight) <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await logWeight(user.id, { weight: Number(weight), unit, date });

      const weightKg = unit === "lbs" ? Number(weight) * 0.453592 : Number(weight);
      const settings = { ...user?.settings, weight: Number(weight), weight_unit: unit };

      // Recompute daily targets from the new weight (mirrors BodyStatsModal).
      // Skipped when body stats are incomplete so we don't clobber targets
      // with the default 2000-kcal fallback.
      const hasBodyStats = Number(settings.height) > 0 && Number(user?.age) > 0;
      let targets = user?.targets;

      if (hasBodyStats) {
        const goal = settings.weight_goal || "maintain";
        const { calories, water } = calculateTargets({
          weight: weightKg,
          height: settings.height,
          age: user.age,
          sex: settings.sex || "male",
          activity_level: settings.activity_level || "moderate",
          goal,
        });
        targets = { calories, water, ...calcMacros({ weight: weightKg, calories, goal }) };
      }

      // Update current weight in user settings
      if (updateUser) {
        await updateUser({ settings, targets });
      }

      if (refreshStats) {
        await refreshStats();
      }
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to log weight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 6 }}>
        Log Weight
      </div>
      <div style={{ fontFamily: F.body, fontSize: 13, color: C.soft, marginBottom: 18 }}>
        Record your weigh-in to track progress over time.
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["kg", "lbs"].map((u) => (
          <div
            key={u}
            onClick={() => setUnit(u)}
            className="press"
            style={{
              flex: 1,
              padding: "10px",
              textAlign: "center",
              borderRadius: 10,
              border: `1px solid ${unit === u ? C.accent : C.border}`,
              background: unit === u ? alpha(C.accent, 15) : C.card,
              cursor: "pointer",
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 700,
              color: unit === u ? C.accent : C.muted,
              transition: "all 0.2s",
            }}
          >
            {u.toUpperCase()}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <Mono size={8} color={C.mutedLight}>
          Date
        </Mono>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-card input-field"
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 14px",
            marginTop: 6,
            fontFamily: F.mono,
            fontSize: 13,
            color: C.text,
            outline: "none",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Mono size={8} color={C.mutedLight}>
          Weight ({unit})
        </Mono>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: C.card,
            border: `1px solid ${error ? alpha(C.red, 50) : C.border}`,
            borderRadius: 12,
            marginTop: 6,
            padding: "0 14px",
          }}
        >
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 74.5"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "14px 0",
              fontFamily: F.head,
              fontSize: 22,
              fontWeight: 900,
              color: C.text,
              outline: "none",
            }}
          />
          <Mono size={10} color={C.muted}>
            {unit}
          </Mono>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 14 }}>
          <Mono size={8} color={C.red}>
            {error}
          </Mono>
        </div>
      )}

      <div
        onClick={!loading ? handleSubmit : undefined}
        className="hover-btn press text-center cursor-pointer"
        style={{
          background: loading ? C.accentDim : C.accent,
          borderRadius: 12,
          padding: "14px",
          minHeight: 48,
        }}
      >
        <span className="font-mono font-bold" style={{ fontSize: 11, color: loading ? C.accent : "#000" }}>
          {loading ? "SAVING..." : "SAVE WEIGHT"}
        </span>
      </div>
    </div>
  );
}
