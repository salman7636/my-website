import { useEffect, useRef, useState } from "react";

import {
  Camera,
  MapPin,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send,
  LoaderCircle,
  ExternalLink,
  Crosshair,
  X,
  Navigation,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

/* =========================================================
   FIX LEAFLET MARKER ICON
   ========================================================= */

const markerIcon = L.divIcon({
  className: "civic-gps-marker",
  html: `
    <div class="civic-marker-pulse"></div>
    <div class="civic-marker-pin">
      <div class="civic-marker-dot"></div>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
  popupAnchor: [0, -23],
});

/* =========================================================
   MAP CENTER COMPONENT
   ========================================================= */

function MapCenter({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return;
    }

    map.setView(
      [latitude, longitude],
      17,
      {
        animate: true,
      }
    );
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function CivicAIDetection({ onNavigate }) {
  /* =======================================================
     REFS
     ======================================================= */

  const videoRef = useRef(null);

  const canvasRef = useRef(null);

  const fileInputRef = useRef(null);

  const streamRef = useRef(null);

  const gpsWatchRef = useRef(null);

  /* =======================================================
     CAMERA STATE
     ======================================================= */

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  /* =======================================================
     IMAGE STATE
     ======================================================= */

  const [image, setImage] =
    useState(null);

  /* =======================================================
     GPS STATE
     ======================================================= */

  const [location, setLocation] =
    useState(null);

  const [gpsLoading, setGpsLoading] =
    useState(true);

  const [gpsError, setGpsError] =
    useState("");

  /* =======================================================
     AI STATE
     ======================================================= */

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysis, setAnalysis] =
    useState(null);

  /* =======================================================
     SUBMISSION
     ======================================================= */

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  /* =======================================================
     LIVE GPS TRACKING
     ======================================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsLoading(false);

      setGpsError(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    gpsWatchRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat:
              position.coords.latitude,

            lon:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,

            heading:
              position.coords.heading,

            speed:
              position.coords.speed,

            timestamp:
              position.timestamp,
          });

          setGpsLoading(false);

          setGpsError("");
        },

        (error) => {
          setGpsLoading(false);

          if (error.code === 1) {
            setGpsError(
              "Location permission was denied."
            );
          } else if (
            error.code === 2
          ) {
            setGpsError(
              "Unable to determine your location."
            );
          } else {
            setGpsError(
              "GPS location timed out."
            );
          }
        },

        {
          enableHighAccuracy: true,

          maximumAge: 3000,

          timeout: 15000,
        }
      );

    return () => {
      if (
        gpsWatchRef.current !== null
      ) {
        navigator.geolocation.clearWatch(
          gpsWatchRef.current
        );
      }
    };
  }, []);

  /* =======================================================
     CAMERA STREAM ATTACHMENT

     This is important for preventing the black screen.
     ======================================================= */

  useEffect(() => {
    if (!cameraOpen) {
      return;
    }

    const video =
      videoRef.current;

    const stream =
      streamRef.current;

    if (!video || !stream) {
      return;
    }

    video.srcObject = stream;

    video.muted = true;

    video.autoplay = true;

    video.playsInline = true;

    const startVideo =
      async () => {
        try {
          await video.play();

          console.log(
            "CivicVision camera started."
          );
        } catch (error) {
          console.error(
            "Camera playback error:",
            error
          );
        }
      };

    if (
      video.readyState >= 1
    ) {
      startVideo();
    } else {
      video.onloadedmetadata =
        startVideo;
    }

    return () => {
      video.onloadedmetadata =
        null;
    };
  }, [cameraOpen]);

  /* =======================================================
     OPEN CAMERA
     ======================================================= */

  async function openCamera() {
    setCameraError("");

    try {
      setCameraLoading(true);

      stopCamera();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera API is not supported."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },

              width: {
                ideal: 1920,
              },

              height: {
                ideal: 1080,
              },
            },

            audio: false,
          }
        );

      streamRef.current =
        stream;

      setCameraOpen(true);

    } catch (error) {
      console.error(
        "CivicVision camera error:",
        error
      );

      setCameraOpen(false);

      let message =
        "Unable to access the camera.";

      if (
        error?.name ===
        "NotAllowedError"
      ) {
        message =
          "Camera permission was denied. Please allow camera access in Chrome.";
      } else if (
        error?.name ===
        "NotFoundError"
      ) {
        message =
          "No camera was found on this device.";
      } else if (
        error?.name ===
        "NotReadableError"
      ) {
        message =
          "The camera is already being used by another application.";
      }

      setCameraError(message);

    } finally {
      setCameraLoading(false);
    }
  }

  /* =======================================================
     STOP CAMERA
     ======================================================= */

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();

      videoRef.current.srcObject =
        null;
    }
  }

  /* =======================================================
     CLOSE CAMERA
     ======================================================= */

  function closeCamera() {
    stopCamera();

    setCameraOpen(false);
  }

  /* =======================================================
     CAPTURE IMAGE
     ======================================================= */

  function captureImage() {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (!video) {
      alert(
        "Camera is not ready."
      );

      return;
    }

    if (!canvas) {
      alert(
        "Capture system is not ready."
      );

      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      alert(
        "Camera is still starting. Please wait a moment."
      );

      return;
    }

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      alert(
        "Unable to capture camera frame."
      );

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const capturedImage =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      );

    setImage(capturedImage);

    setAnalysis(null);

    stopCamera();

    setCameraOpen(false);

    runAIAnalysis(
      capturedImage
    );
  }

  /* =======================================================
     UPLOAD IMAGE
     ======================================================= */

  function handleUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );

      return;
    }

    if (
      file.size >
      15 * 1024 * 1024
    ) {
      alert(
        "Image must be smaller than 15 MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const uploadedImage =
        reader.result;

      setImage(uploadedImage);

      setAnalysis(null);

      setSubmitted(false);

      runAIAnalysis(
        uploadedImage
      );
    };

    reader.onerror = () => {
      alert(
        "Unable to read the image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  /* =======================================================
     AI ANALYSIS

     CURRENTLY FRONTEND DEMO.

     Replace this function with your actual
     PotholeVision AI API later.
     ======================================================= */

  async function runAIAnalysis(
    imageData
  ) {
    if (!imageData) {
      return;
    }

    setAnalyzing(true);

    setAnalysis(null);

    /*
      Simulated AI processing.
    */

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          2200
        )
    );

    /*
      Demo result.

      Your real AI backend should eventually
      return these values.
    */

    const confidence =
      Math.floor(
        Math.random() * 6
      ) + 94;

    const results = [
      {
        severity: "High",
        depth: "Deep",
        size: "Large",
        risk: "High",
        priority: "Urgent",
      },

      {
        severity: "Medium",
        depth: "Moderate",
        size: "Medium",
        risk: "Medium",
        priority: "High",
      },

      {
        severity: "Low",
        depth: "Shallow",
        size: "Small",
        risk: "Low",
        priority: "Normal",
      },
    ];

    const selected =
      results[
        Math.floor(
          Math.random() *
            results.length
        )
      ];

    setAnalysis({
      detected: true,

      issue: "Pothole",

      confidence,

      ...selected,

      analyzedAt:
        new Date().toLocaleString(),
    });

    setAnalyzing(false);
  }

  /* =======================================================
     RETAKE
     ======================================================= */

  function retakeImage() {
    stopCamera();

    setImage(null);

    setAnalysis(null);

    setSubmitted(false);

    setCameraOpen(false);

    setTimeout(() => {
      openCamera();
    }, 150);
  }

  /* =======================================================
     GOOGLE MAPS
     ======================================================= */

  function openGoogleMaps() {
    if (!location) {
      alert(
        "GPS location is not available yet."
      );

      return;
    }

    const url =
      `https://www.google.com/maps?q=` +
      `${location.lat},${location.lon}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =======================================================
     SUBMIT REPORT
     ======================================================= */

  async function submitReport() {
    if (!image) {
      alert(
        "Please capture or upload a pothole image."
      );

      return;
    }

    if (!analysis) {
      alert(
        "Please wait for AI analysis to finish."
      );

      return;
    }

    if (!location) {
      alert(
        "GPS location is not available yet."
      );

      return;
    }

    setSubmitting(true);

    /*
      Frontend-only report object.

      Later this will be sent to your backend.
    */

    const report = {
      id:
        `PTH-${Date.now()}`,

      issueType:
        "Pothole",

      image,

      location: {
        latitude:
          location.lat,

        longitude:
          location.lon,

        accuracy:
          location.accuracy,

        timestamp:
          location.timestamp,
      },

      analysis: {
        detected:
          analysis.detected,

        confidence:
          analysis.confidence,

        severity:
          analysis.severity,

        depth:
          analysis.depth,

        size:
          analysis.size,

        risk:
          analysis.risk,

        priority:
          analysis.priority,
      },

      status:
        "Submitted",

      adminStatus:
        "Awaiting Review",

      createdAt:
        new Date().toISOString(),
    };

    let reports = [];

    try {
      reports =
        JSON.parse(
          localStorage.getItem(
            "civicvision_pothole_reports"
          ) || "[]"
        );
    } catch {
      reports = [];
    }

    localStorage.setItem(
      "civicvision_pothole_reports",
      JSON.stringify([
        report,
        ...reports,
      ])
    );

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          1200
        )
    );

    setSubmitting(false);

    setSubmitted(true);
  }

  /* =======================================================
     CREATE NEW REPORT
     ======================================================= */

  function createAnotherReport() {
    stopCamera();

    setCameraOpen(false);

    setImage(null);

    setAnalysis(null);

    setSubmitted(false);
  }

  /* =======================================================
     SUCCESS SCREEN
     ======================================================= */

  if (submitted) {
    return (
      <div className="cv-ai-detection-page">

        <section className="cv-submitted-card">

          <div className="cv-success-icon">
            <CheckCircle2
              size={44}
            />
          </div>

          <span className="cv-kicker">
            REPORT SUBMITTED
          </span>

          <h2>
            Pothole report submitted
            successfully
          </h2>

          <p>
            Your pothole image, AI assessment
            and GPS coordinates have been
            recorded for administrative review.
          </p>

          <div className="cv-submitted-summary">

            <div>
              <span>
                ISSUE
              </span>

              <strong>
                Pothole
              </strong>
            </div>

            <div>
              <span>
                SEVERITY
              </span>

              <strong>
                {analysis?.severity}
              </strong>
            </div>

            <div>
              <span>
                AI CONFIDENCE
              </span>

              <strong>
                {analysis?.confidence}%
              </strong>
            </div>

            <div>
              <span>
                STATUS
              </span>

              <strong>
                Submitted
              </strong>
            </div>

          </div>

          {location && (
            <div className="cv-submitted-location">

              <MapPin size={18} />

              <span>
                {location.lat.toFixed(
                  6
                )}
                ,{" "}
                {location.lon.toFixed(
                  6
                )}
              </span>

            </div>
          )}

          <div className="cv-submitted-actions">

            <button
              type="button"
              className="cv-primary"
              onClick={
                createAnotherReport
              }
            >
              <Camera size={18} />

              Report Another Pothole
            </button>

            <button
              type="button"
              className="cv-ghost"
              onClick={() =>
                onNavigate?.(
                  "reports"
                )
              }
            >
              View My Reports
            </button>

          </div>

        </section>

      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
     ======================================================= */

  return (
    <div className="cv-ai-detection-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="cv-ai-page-header">

        <div>

          <span className="cv-kicker">
            CIVICVISION AI
          </span>

          <h1>
            AI Pothole Detection
          </h1>

          <p>
            Capture a road image and automatically
            evaluate pothole severity, road risk,
            priority and location.
          </p>

        </div>

        <div className="cv-ai-header-badge">

          <Crosshair
            size={17}
          />

          AI + GPS

        </div>

      </div>

      {/* ===================================================
          CAMERA + GPS
          =================================================== */}

      <div className="cv-ai-workspace">

        {/* =================================================
            CAMERA
            ================================================= */}

        <section className="cv-ai-camera-panel">

          <div className="cv-ai-panel-header">

            <div>

              <span className="cv-kicker">
                STEP 1
              </span>

              <h2>
                Capture road evidence
              </h2>

            </div>

            <ShieldCheck
              size={22}
            />

          </div>

          {/* CAMERA AREA */}

          <div
            className={
              cameraOpen
                ? "cv-ai-camera-box cv-camera-active"
                : "cv-ai-camera-box"
            }
          >

            {cameraOpen ? (

              <div className="cv-real-camera">

                <video
                  ref={videoRef}
                  className="cv-real-camera-video"
                  autoPlay
                  muted
                  playsInline
                />

                {/* CAMERA GUIDE */}

                <div className="cv-camera-guide">

                  <div className="cv-camera-corner top-left" />

                  <div className="cv-camera-corner top-right" />

                  <div className="cv-camera-corner bottom-left" />

                  <div className="cv-camera-corner bottom-right" />

                </div>

                <div className="cv-camera-message">

                  <Navigation
                    size={14}
                  />

                  Point camera at the pothole

                </div>

                {/* CONTROLS */}

                <div className="cv-real-camera-controls">

                  <button
                    type="button"
                    className="cv-camera-cancel"
                    onClick={
                      closeCamera
                    }
                  >

                    <X
                      size={17}
                    />

                    Close

                  </button>

                  <button
                    type="button"
                    className="cv-real-capture"
                    onClick={
                      captureImage
                    }
                  >

                    <Camera
                      size={25}
                    />

                  </button>

                  <div className="cv-camera-control-spacer" />

                </div>

              </div>

            ) : image ? (

              <div className="cv-captured-image-container">

                <img
                  src={image}
                  alt="Captured pothole"
                  className="cv-captured-image"
                />

                <div className="cv-image-label">

                  <CheckCircle2
                    size={15}
                  />

                  Evidence captured

                </div>

              </div>

            ) : (

              <div className="cv-camera-empty">

                <div className="cv-camera-empty-icon">

                  <Camera
                    size={35}
                  />

                </div>

                <h3>
                  Camera ready
                </h3>

                <p>
                  Capture a clear image of the
                  road and pothole.
                </p>

              </div>

            )}

          </div>

          {/* CAMERA ERROR */}

          {cameraError && (

            <div className="cv-camera-error">

              <AlertTriangle
                size={18}
              />

              <span>
                {cameraError}
              </span>

            </div>

          )}

          {/* FILE INPUT */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleUpload
            }
            style={{
              display: "none",
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />

          {/* BUTTONS */}

          {!cameraOpen && (

            <div className="cv-image-actions">

              <button
                type="button"
                className="cv-primary"
                onClick={
                  openCamera
                }
                disabled={
                  cameraLoading
                }
              >

                {cameraLoading ? (

                  <>
                    <LoaderCircle
                      size={18}
                      className="cv-spin"
                    />

                    Starting Camera...
                  </>

                ) : (

                  <>
                    <Camera
                      size={18}
                    />

                    Open Camera
                  </>

                )}

              </button>

              <button
                type="button"
                className="cv-ghost"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <Upload
                  size={18}
                />

                Upload Image

              </button>

              {image && (

                <button
                  type="button"
                  className="cv-ghost"
                  onClick={
                    retakeImage
                  }
                  disabled={
                    analyzing
                  }
                >

                  <RefreshCw
                    size={17}
                  />

                  Retake

                </button>

              )}

            </div>

          )}

          <div className="cv-ai-evidence-note">

            <ShieldCheck
              size={17}
            />

            <span>
              Clear road images produce better AI
              detection results.
            </span>

          </div>

        </section>

        {/* =================================================
            GPS MAP
            ================================================= */}

        <section className="cv-ai-gps-panel">

          <div className="cv-ai-panel-header">

            <div>

              <span className="cv-kicker">
                STEP 2
              </span>

              <h2>
                Live GPS location
              </h2>

            </div>

            <div
              className={
                location
                  ? "cv-gps-live"
                  : "cv-gps-waiting"
              }
            >

              <span />

              {location
                ? "LIVE"
                : "WAITING"}

            </div>

          </div>

          {/* REAL MAP */}

          <div className="cv-real-map">

            {location ? (

              <MapContainer
                center={[
                  location.lat,
                  location.lon,
                ]}
                zoom={17}
                scrollWheelZoom={true}
                zoomControl={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    location.lat,
                    location.lon,
                  ]}
                  icon={
                    markerIcon
                  }
                >

                  <Popup>

                    <strong>
                      CivicVision
                    </strong>

                    <br />

                    Current GPS location

                    <br />

                    Accuracy: ±
                    {Math.round(
                      location.accuracy
                    )}
                    m

                  </Popup>

                </Marker>

                <MapCenter
                  latitude={
                    location.lat
                  }
                  longitude={
                    location.lon
                  }
                />

              </MapContainer>

            ) : (

              <div className="cv-map-loading">

                <LoaderCircle
                  size={28}
                  className="cv-spin"
                />

                <span>
                  Waiting for GPS location...
                </span>

              </div>

            )}

          </div>

          {/* GPS INFORMATION */}

          {gpsLoading ? (

            <div className="cv-gps-status">

              <LoaderCircle
                size={20}
                className="cv-spin"
              />

              <div>

                <strong>
                  Detecting GPS...
                </strong>

                <span>
                  Please allow location access.
                </span>

              </div>

            </div>

          ) : location ? (

            <div className="cv-gps-details">

              <div className="cv-coordinate-card">

                <span>
                  LATITUDE
                </span>

                <strong>
                  {location.lat.toFixed(
                    6
                  )}
                </strong>

              </div>

              <div className="cv-coordinate-card">

                <span>
                  LONGITUDE
                </span>

                <strong>
                  {location.lon.toFixed(
                    6
                  )}
                </strong>

              </div>

              <div className="cv-coordinate-card">

                <span>
                  ACCURACY
                </span>

                <strong>
                  ±
                  {Math.round(
                    location.accuracy
                  )}{" "}
                  m
                </strong>

              </div>

              <div className="cv-coordinate-card">

                <span>
                  TRACKING
                </span>

                <strong className="gps-good">
                  LIVE
                </strong>

              </div>

            </div>

          ) : (

            <div className="cv-gps-error">

              <AlertTriangle
                size={18}
              />

              {gpsError ||
                "GPS unavailable"}

            </div>

          )}

          {/* GOOGLE MAPS */}

          {location && (

            <button
              type="button"
              className="cv-map-button"
              onClick={
                openGoogleMaps
              }
            >

              <ExternalLink
                size={17}
              />

              Open Location in Google Maps

            </button>

          )}

        </section>

      </div>

      {/* ===================================================
          AI ANALYSIS
          =================================================== */}

      <section className="cv-ai-analysis-section">

        <div className="cv-ai-panel-header">

          <div>

            <span className="cv-kicker">
              STEP 3
            </span>

            <h2>
              Automatic AI assessment
            </h2>

            <p>
              AI analysis starts automatically
              after image capture or upload.
            </p>

          </div>

          <div className="cv-ai-status-icon">

            <Crosshair
              size={22}
            />

          </div>

        </div>

        {/* WAITING */}

        {!image &&
          !analyzing && (

            <div className="cv-ai-empty">

              <div className="cv-ai-empty-icon">

                <Crosshair
                  size={30}
                />

              </div>

              <h3>
                Waiting for road evidence
              </h3>

              <p>
                Capture or upload an image
                to begin AI pothole detection.
              </p>

            </div>

          )}

        {/* ANALYZING */}

        {analyzing && (

          <div className="cv-ai-analyzing">

            <div className="cv-ai-loader">

              <LoaderCircle
                size={34}
                className="cv-spin"
              />

            </div>

            <div>

              <span className="cv-kicker">
                AI PROCESSING
              </span>

              <h3>
                Analyzing pothole...
              </h3>

              <p>
                Evaluating pothole size, depth,
                severity, road risk and repair priority.
              </p>

            </div>

          </div>

        )}

        {/* AI RESULT */}

        {analysis &&
          !analyzing && (

            <div className="cv-ai-result-card">

              <div className="cv-ai-result-top">

                <div className="cv-ai-detected">

                  <div className="cv-ai-check">

                    <CheckCircle2
                      size={22}
                    />

                  </div>

                  <div>

                    <span>
                      AI DETECTION
                    </span>

                    <h3>
                      Pothole Detected
                    </h3>

                  </div>

                </div>

                <div className="cv-ai-confidence">

                  <strong>
                    {analysis.confidence}%
                  </strong>

                  <span>
                    confidence
                  </span>

                </div>

              </div>

              {/* METRICS */}

              <div className="cv-ai-metrics-grid">

                <div className="cv-ai-metric">

                  <span>
                    SEVERITY
                  </span>

                  <strong
                    className={
                      `severity-${analysis.severity.toLowerCase()}`
                    }
                  >
                    {analysis.severity}
                  </strong>

                </div>

                <div className="cv-ai-metric">

                  <span>
                    DEPTH
                  </span>

                  <strong>
                    {analysis.depth}
                  </strong>

                </div>

                <div className="cv-ai-metric">

                  <span>
                    SIZE
                  </span>

                  <strong>
                    {analysis.size}
                  </strong>

                </div>

                <div className="cv-ai-metric">

                  <span>
                    ROAD RISK
                  </span>

                  <strong>
                    {analysis.risk}
                  </strong>

                </div>

                <div className="cv-ai-metric">

                  <span>
                    PRIORITY
                  </span>

                  <strong>
                    {analysis.priority}
                  </strong>

                </div>

                <div className="cv-ai-metric">

                  <span>
                    ISSUE
                  </span>

                  <strong>
                    Pothole
                  </strong>

                </div>

              </div>

              {/* RECOMMENDATION */}

              <div className="cv-ai-recommendation">

                <AlertTriangle
                  size={20}
                />

                <div>

                  <strong>
                    Recommended action
                  </strong>

                  <p>
                    {analysis.severity ===
                    "High"
                      ? "Immediate road inspection and repair is recommended."
                      : analysis.severity ===
                        "Medium"
                      ? "Schedule road inspection and repair."
                      : "Monitor the location and schedule maintenance if required."}
                  </p>

                </div>

              </div>

              <div className="cv-ai-analysis-footer">

                <span>
                  Analyzed{" "}
                  {analysis.analyzedAt}
                </span>

                <span>
                  AI verification complete
                </span>

              </div>

            </div>

          )}

      </section>

      {/* ===================================================
          ADMIN SUBMISSION
          =================================================== */}

      {analysis &&
        location && (

          <section className="cv-admin-submit-card">

            <div>

              <span className="cv-kicker">
                STEP 4
              </span>

              <h2>
                Submit to CivicVision Admin
              </h2>

              <p>
                Submit the pothole image together
                with AI analysis and exact GPS
                coordinates for administrative review.
              </p>

            </div>

            <div className="cv-admin-submit-info">

              <div>

                <CheckCircle2
                  size={17}
                />

                Image evidence ready

              </div>

              <div>

                <CheckCircle2
                  size={17}
                />

                AI analysis complete

              </div>

              <div>

                <CheckCircle2
                  size={17}
                />

                GPS location captured

              </div>

            </div>

            <button
              type="button"
              className="cv-submit-admin"
              onClick={
                submitReport
              }
              disabled={
                submitting
              }
            >

              {submitting ? (

                <>
                  <LoaderCircle
                    size={19}
                    className="cv-spin"
                  />

                  Sending to Admin...
                </>

              ) : (

                <>
                  <Send
                    size={19}
                  />

                  Submit Pothole Report
                </>

              )}

            </button>

          </section>

        )}

    </div>
  );
}

export default CivicAIDetection;