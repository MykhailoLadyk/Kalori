import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, F, alpha } from "../lib/constants";
import { Mono, Tag } from "../components/shared/Primitives";
import analyzeFood from "../services/analyzeFood";
import { useUser } from "../hooks/useUser";
import { useGameStats } from "../hooks/useGameStats";
import { useNotifications } from "../context/NotificationContext";
import { IconSparkles, IconCoin, IconCrown } from "../components/shared/DuoIcon";
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

const CaptureIcon = () => (
  <svg width="28" height="28" viewBox="0 0 256 256" fill="none">
    <circle cx="128" cy="128" r="96" fill="#fff" opacity="0.15" />
    <circle cx="128" cy="128" r="80" fill="#fff" />
  </svg>
);

const Spinner = ({ color = "#000", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ animation: "spin 1s linear infinite" }}
  >
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function PhotoAddMeal() {
  const navigate = useNavigate();
  const { isPro } = useUser();
  const { gameData, refreshGameData } = useGameStats();
  const { addNotification } = useNotifications();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCoinGate, setShowCoinGate] = useState(false);

  const userCoins = gameData?.coins || 0;

  const loadingSteps = ["Analyzing image...", "Identifying food...", "Estimating calories...", "Calculating macros..."];
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (analyzing) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % loadingSteps.length);
      }, 1500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  useEffect(() => {
    if (!analyzing) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [analyzing]);

  useEffect(() => {
    document.body.classList.add("photo-div");

    let active = true;
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (!active) return;
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    }
    startCamera();

    return () => {
      document.body.classList.remove("photo-div");
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);

    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const handleRetake = async () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setError("Camera access denied or unavailable.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!isPro && userCoins < AI_COIN_COST) {
      setShowCoinGate(true);
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const parsed = await analyzeFood(photo);
      setResult(true);

      // Server already deducted coins atomically for free users
      await refreshGameData();
      if (!isPro) {
        addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Photo Scan)` });
      }

      navigate("/add-meal/confirm", {
        state: {
          meal: parsed,
          photoData: photo,
          isAlbum: false,
        },
      });
    } catch (err) {
      if (err.code === "RATE_LIMITED") {
        setError("Daily AI limit reached. Try again tomorrow or add meals manually.");
      } else if (err.code === "INSUFFICIENT_COINS") {
        setShowCoinGate(true);
      } else {
        setError(err.code === "NO_FOOD_DETECTED" ? (err.message || "No food detected in photo.") : "Couldn't analyze the photo. Try retaking it.");
        await refreshGameData();
        if (!isPro) {
          addNotification({ type: "coins_deducted", amount: -AI_COIN_COST, name: `-${AI_COIN_COST} coins (AI Photo Scan)` });
        }
      }
    } finally {
      setAnalyzing(false);
    }
  };


  return (
    <div
      className="photo-div"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        position: "relative",
        background: "#000",
        animation: "fadeIn 0.22s ease both",
      }}
    >
      {/* Floating Back Button */}
      <div
        onClick={!analyzing ? () => navigate("/") : undefined}
        className={analyzing ? "" : "press"}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          width: 36,
          height: 36,
          background: alpha("#000", 38),
          backdropFilter: "blur(8px)",
          border: `1px solid ${C.border}`,
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: analyzing ? "not-allowed" : "pointer",
          opacity: analyzing ? 0.35 : 1,
          pointerEvents: analyzing ? "none" : "auto",
        }}
      >
        <ChevronLeft />
      </div>

      {/* Top Floating Coins Status Pill (Free Tier) */}
      {!isPro && (
        <div
          onClick={!analyzing ? () => navigate("/premium") : undefined}
          className={analyzing ? "" : "press"}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            background: alpha("#000", 45),
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(C.gold, 35)}`,
            borderRadius: 20,
            padding: "7px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: analyzing ? "not-allowed" : "pointer",
            opacity: analyzing ? 0.4 : 1,
            pointerEvents: analyzing ? "none" : "auto",
          }}
        >
          <IconCoin size={14} color={C.gold} />
          <span style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 800, color: C.gold }}>
            50 COINS
          </span>
          <span style={{ fontFamily: F.mono, fontSize: 9, color: alpha("#fff", 70) }}>
            ({userCoins} <IconCoin size={11} color={C.gold} />)
          </span>
        </div>
      )}


      {/* Camera Viewport / Captured Photo */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {error ? (
          <div style={{ padding: "0 40px", textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
            <Mono size={9} color={C.red}>
              {error}
            </Mono>
            <label
              className="hover-btn press"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: "16px 24px",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.soft,
                }}
              >
                UPLOAD FROM GALLERY
              </span>
            </label>
          </div>
        ) : photo ? (
          <img
            src={photo}
            alt="captured meal"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Bottom Controls */}
      {!result && !error && (
        <div
          style={{
            height: "20vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            padding: "0 18px 0 18px",
          }}
        >
          {photo ? (
            <div style={{ display: "flex", gap: 14, width: "100%" }}>
              <div
                onClick={!analyzing ? handleRetake : undefined}
                className={analyzing ? "" : "hover-btn press"}
                style={{
                  flex: 1,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "16px",
                  textAlign: "center",
                  cursor: analyzing ? "not-allowed" : "pointer",
                  opacity: analyzing ? 0.4 : 1,
                  pointerEvents: analyzing ? "none" : "auto",
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.soft,
                  }}
                >
                  RETAKE
                </span>
              </div>
              <div
                onClick={!analyzing ? handleAnalyze : undefined}
                className="hover-btn press"
                style={{
                  flex: 2,
                  background: analyzing ? C.accentDim : C.accent,
                  borderRadius: 14,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: analyzing ? "not-allowed" : "pointer",
                }}
              >
                {analyzing && <Spinner color={C.accent} size={14} />}
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: analyzing ? C.accent : "#000",
                  }}
                >
                  {analyzing
                    ? loadingSteps[loadingStepIndex].toUpperCase()
                    : isPro
                    ? "USE PHOTO"
                    : <>USE PHOTO ({AI_COIN_COST} <IconCoin size={11} color="#000" />)</>}
                </span>
              </div>
            </div>

          ) : (
            <div
              onClick={handleCapture}
              className="press"
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: `4px solid ${alpha("#fff", 25)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <CaptureIcon />
            </div>
          )}
        </div>
      )}

      <Modal id={showCoinGate} close={() => setShowCoinGate(false)}>
        <InsufficientCoinsModal coins={userCoins} handleClose={() => setShowCoinGate(false)} />
      </Modal>
    </div>
  );
}



