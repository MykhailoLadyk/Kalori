import { useState } from "react";
import { C, F, alpha } from "../../../lib/constans";
import { Mono } from "../../shared/Primitives";
import { IconShield, IconCoin } from "../../shared/DuoIcon";
import { shieldPacks } from "../../../lib/constans";
import { useGameStats } from "../../../hooks/useGameStats";

export default function ShopOtherModal() {
  const { shopItems, updateShopItems, gameData, updateGameData } = useGameStats();
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function onPurchase(price, qty) {
    setError(null);
    setMessage(null);
    
    const newCoiins = gameData.coins - price;
    if (newCoiins < 0) {
      setError("Not enough coins.");
      return;
    }
    const newStreakShields = shopItems.streak_shields + parseInt(qty);
    await updateShopItems({ streak_shields: newStreakShields });
    await updateGameData({ coins: newCoiins });
    setMessage(`Purchased ${qty} Streak Shield(s) for ${price} coins!`);
    
    setTimeout(() => setMessage(null), 3000);
  }
  return (
    <div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 20,
          fontWeight: 900,
          color: C.text,
          marginBottom: 16,
        }}
      >
        Other
      </div>

      <div
        style={{
          background: `linear-gradient(135deg, ${alpha(C.orange, 13)}, ${alpha(C.gold, 6)})`,
          border: `1px solid ${alpha(C.orange, 25)}`,
          borderRadius: 18,
          padding: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ animation: "float 2s ease infinite" }}>
            <IconShield size={44} color={C.orange} />
          </div>
          <div>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 20,
                fontWeight: 800,
                color: C.text,
              }}
            >
              Streak Shield
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 12,
                color: C.soft,
                marginTop: 3,
              }}
            >
              Protects your streak from 1 missed day. Activates automatically.
            </div>
          </div>
        </div>
        <div
          style={{
            background: C.border,
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 12,
          }}
        >
          <Mono size={8} color={C.mutedLight}>
            How it works
          </Mono>
          <div
            style={{
              fontFamily: F.body,
              fontSize: 12,
              color: C.soft,
              marginTop: 4,
            }}
          >
            If you miss a day, a Shield activates and keeps your streak alive.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {shieldPacks.map(({ qty, price }, i) => (
            <div
              key={qty}
              onClick={() => onPurchase(price, qty)}
              className="hover-btn press"
              style={{
                flex: 1,
                background: "#FB923C",
                borderRadius: 10,
                padding: "10px 0",
                textAlign: "center",
                animation: `bounceIn 0.4s ease ${i * 80 + 200}ms both`,
              }}
            >
              <div
                style={{
                  fontFamily: F.head,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                {qty}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <IconCoin size={10} color={alpha("#000", 56)} />
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 9,
                    color: alpha("#000", 56),
                    fontWeight: 700,
                  }}
                >
                  {price}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {(error || message) && (
          <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 0.3s ease" }}>
            <Mono size={9} color={error ? C.red : C.accent}>
              {error || message}
            </Mono>
          </div>
        )}
      </div>
    </div>
  );
}
