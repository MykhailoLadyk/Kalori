import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../lib/constants";
import { Mono, Tag } from "../components/shared/Primitives";
import {
  IconCheck,
  IconSparkles,
  IconCrown,
  IconCoin,
  IconFire,
  IconShield,
  IconTarget,
} from "../components/shared/DuoIcon";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../context/NotificationContext";
import {
  PRO_PLANS,
  PRO_FEATURES,
  getSubscriptionDetails,
} from "../services/subscriptionService";

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

export default function Premium() {
  const navigate = useNavigate();
  const { user, subscription, isPro } = useUser();
  const { addNotification } = useNotifications();

  const [selectedPlanId, setSelectedPlanId] = useState("6months");
  const subDetails = getSubscriptionDetails(subscription);

  const handleSubscribeClick = () => {
    addNotification({
      type: "info",
      name: "Unavailable at the moment",
    });
  };

  const selectedPlan = PRO_PLANS.find((p) => p.id === selectedPlanId) || PRO_PLANS[1];

  return (
    <div
      className="flex flex-col flex-1"
      style={{
        minHeight: "100vh",
        padding: "16px 22px 40px",
        animation: "fadeIn 0.25s ease both",
      }}
    >
      {/* Top Bar with Back Button */}
      <div
        className="flex items-center"
        style={{
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          onClick={() => navigate(-1)}
          className="press flex items-center justify-center bg-card"
          style={{
            width: 36,
            height: 36,
            border: `1px solid ${C.border}`,
            borderRadius: 11,
            color: C.soft,
            cursor: "pointer",
          }}
        >
          <ChevronLeft />
        </div>
        <div className="font-head font-black text-primary" style={{ fontSize: 18 }}>
          Kalori Pro
        </div>
      </div>

      {/* Hero Badge & Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: `linear-gradient(135deg, ${alpha(C.gold, 25)}, ${alpha(C.accent, 20)})`,
            border: `1px solid ${alpha(C.gold, 40)}`,
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 12,
          }}
        >
          <IconCrown size={16} color={C.gold} />
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            PREMIUM MEMBERSHIP
          </span>
        </div>

        <h1
          style={{
            fontFamily: F.head,
            fontSize: 26,
            fontWeight: 900,
            color: C.text,
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          Supercharge Your Nutrition
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: 13,
            color: C.soft,
            maxWidth: 320,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Unlock high-limit AI meal scanning, smart macro insights, and zero coin friction.
        </p>
      </div>

      {/* If already subscribed: Current Status Card */}
      {isPro && (
        <div
          style={{
            background: `linear-gradient(135deg, ${alpha(C.accent, 15)}, ${alpha(C.panel, 80)})`,
            border: `1px solid ${alpha(C.accent, 40)}`,
            borderRadius: 18,
            padding: "16px",
            marginBottom: 20,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconCrown size={18} color={C.gold} />
              <span style={{ fontFamily: F.head, fontSize: 16, fontWeight: 800, color: C.text }}>
                Current Subscription
              </span>
            </div>
            <Tag color={subDetails.status === "active" ? C.accent : C.gold}>
              {subDetails.statusLabel.toUpperCase()}
            </Tag>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Mono size={9} color={C.muted}>Plan</Mono>
              <Mono size={9} color={C.text}>{subDetails.planName}</Mono>
            </div>
            {subDetails.periodEnd && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Mono size={9} color={C.muted}>
                  {subDetails.cancelAtPeriodEnd ? "Expires On" : "Renews On"}
                </Mono>
                <Mono size={9} color={C.text}>
                  {subDetails.periodEnd.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Mono>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Mono size={9} color={C.muted}>Daily AI Quota</Mono>
              <Mono size={9} color={C.accent}>100 scans / day</Mono>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Plans Selection */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 9,
            color: C.mutedLight,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Select Your Plan
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PRO_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className="press"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${alpha(C.accent, 14)}, ${C.card})`
                    : C.card,
                  border: `2px solid ${isSelected ? C.accent : C.border}`,
                  borderRadius: 18,
                  padding: "16px 18px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? `0 0 20px ${alpha(C.accent, 20)}` : "none",
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 18,
                      background: `linear-gradient(135deg, ${C.gold}, #F59E0B)`,
                      color: "#000",
                      fontFamily: F.mono,
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: 1,
                      padding: "3px 10px",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? C.accent : C.muted}`,
                          background: isSelected ? C.accent : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && (
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#000" }} />
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: F.head,
                          fontSize: 17,
                          fontWeight: 800,
                          color: C.text,
                        }}
                      >
                        {plan.name}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: F.body,
                        fontSize: 12,
                        color: C.soft,
                        marginTop: 4,
                        marginLeft: 26,
                      }}
                    >
                      {plan.billingDesc}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: F.head, fontSize: 20, fontWeight: 900, color: isSelected ? C.accent : C.text }}>
                      {plan.price}
                    </div>
                    {plan.pricePerMonth && (
                      <Mono size={8} color={C.gold}>
                        {plan.pricePerMonth}
                      </Mono>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 9,
            color: C.mutedLight,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Everything in Pro
        </div>

        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {PRO_FEATURES.map((feat, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: alpha(C.accent, 15),
                  border: `1px solid ${alpha(C.accent, 30)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconCheck size={16} color={C.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.head, fontSize: 14, fontWeight: 800, color: C.text }}>
                  {feat.title}
                </div>
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.soft, marginTop: 2, lineHeight: 1.4 }}>
                  {feat.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free vs Pro Comparison Pill */}
      <div
        style={{
          background: alpha(C.gold, 8),
          border: `1px solid ${alpha(C.gold, 25)}`,
          borderRadius: 16,
          padding: "14px 16px",
          marginBottom: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <IconCoin size={16} color={C.gold} />
          <span style={{ fontFamily: F.head, fontSize: 13, fontWeight: 800, color: C.text }}>
            Free Tier vs. Kalori Pro
          </span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: 12, color: C.soft, lineHeight: 1.5 }}>
          Free accounts can use AI food scans anytime by spending <strong style={{ color: C.gold }}>50 coins</strong> per scan. Upgrading to Pro gives you <strong style={{ color: C.accent }}>100 scans/day</strong> with 0 coin costs.
        </div>
      </div>

      {/* Call to Action Button */}
      <div style={{ marginTop: "auto" }}>
        <button
          type="button"
          onClick={handleSubscribeClick}
          className="hover-btn press"
          style={{
            width: "100%",
            background: `linear-gradient(135deg, ${C.accent}, #34D399)`,
            border: "none",
            borderRadius: 14,
            padding: "16px",
            fontFamily: F.mono,
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 1,
            color: "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: `0 4px 20px ${alpha(C.accent, 35)}`,
          }}
        >
          <IconCrown size={18} color="#000" />
          <span>SUBSCRIBE FOR {selectedPlan.price.toUpperCase()}</span>
        </button>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Mono size={8} color={C.muted}>
            Cancel anytime in account settings · Secure recurring billing
          </Mono>
        </div>
      </div>
    </div>
  );
}
