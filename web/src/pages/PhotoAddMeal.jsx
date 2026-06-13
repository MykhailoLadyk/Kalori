import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, F } from "../lib/constans";
import { Mono } from "../components/shared/Primitives";

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

export default function PhotoAddMeal() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const parsed = await analyzeMealPhoto(photo);
      setResult(parsed);

      navigate("/add-meal/confirm", {
        state: {
          meal: parsed,
          photoData: photo,
          isAlbum: false,
        },
      });
    } catch {
      setError("Couldn't analyze the photo. Try retaking it.");
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
        onClick={() => navigate("/")}
        className="press"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          width: 36,
          height: 36,
          background: "#00000060",
          backdropFilter: "blur(8px)",
          border: `1px solid ${C.border}`,
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <ChevronLeft />
      </div>

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
          <div style={{ padding: "0 40px", textAlign: "center" }}>
            <Mono size={9} color={C.red}>
              {error}
            </Mono>
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
                onClick={handleRetake}
                className="hover-btn press"
                style={{
                  flex: 1,
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
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
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: analyzing ? C.accent : "#000",
                  }}
                >
                  {analyzing ? "ANALYZING..." : "USE PHOTO"}
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
                border: "4px solid #ffffff40",
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
    </div>
  );
}

async function analyzeMealPhoto(photoDataUrl) {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    name: "Grilled Chicken Bowl",
    calories: 540,
    protein: 38,
    carbs: 52,
    fat: 16,
  };
}
