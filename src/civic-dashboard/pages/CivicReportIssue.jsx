import { useEffect, useRef, useState } from "react";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crosshair,
  FileImage,
  FileVideo,
  LoaderCircle,
  Map,
  MapPin,
  Navigation,
  ShieldCheck,
  Upload,
  Video,
  X,
  Zap,
} from "lucide-react";

import CivicIssueSelector from "../components/CivicIssueSelector";
import { startCamera, stopCamera, captureFrame } from "../services/civicCameraService";
import { analyzeIssue } from "../services/civicAIService";

function CivicReportIssue({
  onNavigate,
  onReportCreated,
}) {
  const [selected, setSelected] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [location, setLocation] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const gpsWatchRef = useRef(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /*
    =========================================================
    CONTINUOUS GPS
    =========================================================
  */

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by this browser.");
      return;
    }

    setGpsActive(true);

    gpsWatchRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });

          setGpsError("");
        },
        (err) => {
          console.error("GPS error:", err);

          setGpsActive(false);

          if (err.code === 1) {
            setGpsError(
              "Location permission denied. Please allow GPS access."
            );
          } else {
            setGpsError(
              "Unable to get your current GPS location."
            );
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 10000,
        }
      );

    return () => {
      if (gpsWatchRef.current !== null) {
        navigator.geolocation.clearWatch(
          gpsWatchRef.current
        );
      }
    };
  }, []);

  /*
    =========================================================
    SELECT ISSUE
    =========================================================
  */

  async function handleIssueSelect(issue) {
    setSelected(issue);

    setImage(null);
    setVideo(null);
    setAnalysis(null);
    setError("");

    setCameraOpen(true);
    setCameraLoading(true);

    try {
      const stream = await startCamera();

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);

      setError(
        "Camera access failed. You can still upload photo/video evidence."
      );
    } finally {
      setCameraLoading(false);
    }
  }

  /*
    =========================================================
    CAMERA CAPTURE
    =========================================================
  */

  async function handleCapture() {
    if (!videoRef.current) return;

    if (!location) {
      setError(
        "GPS location is required before capturing evidence."
      );
      return;
    }

    try {
      const frame = await captureFrame(
        videoRef.current
      );

      setImage(frame);
      setError("");

      await runAI(frame, null);
    } catch (err) {
      console.error(err);
      setError("Unable to capture image.");
    }
  }

  /*
    =========================================================
    IMAGE UPLOAD
    =========================================================
  */

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!location) {
      setError(
        "Please allow GPS location before uploading evidence."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result;

      setImage(result);
      setVideo(null);
      setError("");

      await runAI(result, null);
    };

    reader.readAsDataURL(file);
  }

  /*
    =========================================================
    VIDEO UPLOAD
    =========================================================
  */

  function handleVideoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!location) {
      setError(
        "Please allow GPS location before uploading evidence."
      );
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    const videoUrl = URL.createObjectURL(file);

    setVideo(videoUrl);
    setImage(null);
    setError("");

    runAI(null, videoUrl);
  }

  /*
    =========================================================
    AI ANALYSIS
    =========================================================
  */

  async function runAI(
    imageEvidence,
    videoEvidence
  ) {
    if (!selected) return;

    setLoadingAI(true);
    setAnalysis(null);

    try {
      const result = await analyzeIssue(
        selected.label || selected.name || selected.id,
        imageEvidence,
        videoEvidence
      );

      setAnalysis(result);
    } catch (err) {
      console.error(err);

      setError(
        "AI analysis failed. Please try again."
      );
    } finally {
      setLoadingAI(false);
    }
  }

  /*
    =========================================================
    RETAKE / RESET
    =========================================================
  */

  function handleRetake() {
    setImage(null);
    setVideo(null);
    setAnalysis(null);
    setError("");

    if (streamRef.current) {
      stopCamera(streamRef.current);
    }

    streamRef.current = null;

    setCameraOpen(false);
    setSelected(null);
  }

  /*
    =========================================================
    MAP
    =========================================================
  */

  function openMap() {
    if (!location) return;

    const url =
      `https://www.google.com/maps/search/?api=1&query=` +
      `${location.lat},${location.lon}`;

    window.open(url, "_blank");
  }

  function startTracking() {
    if (!navigator.geolocation) {
      setGpsError("GPS is not supported.");
      return;
    }

    setGpsActive(true);

    if (gpsWatchRef.current !== null) {
      navigator.geolocation.clearWatch(
        gpsWatchRef.current
      );
    }

    gpsWatchRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        () => {
          setGpsActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
  }

  /*
    =========================================================
    SUBMIT REPORT
    =========================================================
  */

  async function handleSubmit() {
    if (!selected) {
      setError("Please select an issue.");
      return;
    }

    if (!image && !video) {
      setError(
        "Please capture or upload photo/video evidence."
      );
      return;
    }

    if (!location) {
      setError(
        "Exact GPS location is required before submission."
      );
      return;
    }

    if (!analysis) {
      setError(
        "Please wait for AI verification."
      );
      return;
    }

    setSubmitting(true);
    setError("");

    /*
      ONLY EMPTY GARBAGE EARNS POINTS.
      EVERY VALID EMPTY GARBAGE REPORT = +30.
    */

    let points = 0;

    if (
      selected.id === "garbage" &&
      analysis.binStatus === "Empty"
    ) {
      points = 30;
    }

    const report = {
      id: `CV-${Date.now()}`,

      issueType:
        analysis.detected ||
        selected.label ||
        selected.name ||
        selected.id,

      status: "Submitted",

      severity:
        analysis.severity || "Medium",

      risk:
        analysis.risk || "Medium",

      priority:
        analysis.priority || "High",

      confidence:
        Number(analysis.confidence || 0),

      description:
        analysis.binStatus === "Empty"
          ? "AI verified that the submitted garbage bin is empty."
          : analysis.binStatus === "Full"
          ? "AI detected a full or overflowing garbage bin."
          : `AI verified ${selected.label || selected.name || selected.id}.`,

      image,

      video,

      location,

      gpsAccuracy:
        location.accuracy,

      analysis,

      points,

      eligibleForReward:
        points > 0,

      reward: 0,

      date: "Just now",

      createdAt:
        new Date().toLocaleString(),

      verifiedAt:
        new Date().toLocaleString(),

      assignedAt: null,

      resolvedAt: null,
    };

    console.log(
      "CIVICVISION FINAL REPORT",
      report
    );

    if (
      typeof onReportCreated ===
      "function"
    ) {
      onReportCreated(report);
    }

    if (streamRef.current) {
      stopCamera(streamRef.current);
      streamRef.current = null;
    }

    setSubmitting(false);

    onNavigate?.("reports");
  }

  /*
    =========================================================
    MAP EMBED URL
    =========================================================
  */

  const mapUrl = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        location.lon - 0.005
      },${
        location.lat - 0.005
      },${
        location.lon + 0.005
      },${
        location.lat + 0.005
      }&layer=mapnik&marker=${
        location.lat
      },${
        location.lon
      }`
    : null;

  /*
    =========================================================
    PAGE
    =========================================================
  */

  return (
    <div className="cv-report-page">

      {/* HEADER */}

      <div className="cv-page-title">

        <div>

          <span className="cv-kicker">
            CIVIC INTELLIGENCE
          </span>

          <h1>
            Report an Issue
          </h1>

          <p>
            Submit photo or video evidence.
            CivicVision AI will automatically
            verify the issue, assess risk and
            attach your live GPS location.
          </p>

        </div>

        <button
          type="button"
          className="cv-ghost"
          onClick={() =>
            onNavigate?.("dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>

      {/* ISSUE SELECTOR */}

      {!selected && (

        <section className="cv-panel">

          <div className="cv-panel-head">

            <div>

              <span className="cv-kicker">
                STEP 1
              </span>

              <h3>
                Select the civic issue
              </h3>

            </div>

            <ShieldCheck size={21} />

          </div>

          <p className="cv-muted">
            Choose what you want to report.
          </p>

          <CivicIssueSelector
            onSelect={
              handleIssueSelect
            }
          />

        </section>

      )}

      {/* REPORT WORKSPACE */}

      {selected && (

        <div className="cv-report-workspace">

          {/* EVIDENCE */}

          <section className="cv-panel">

            <div className="cv-panel-head">

              <div>

                <span className="cv-kicker">
                  STEP 2
                </span>

                <h3>
                  Evidence
                </h3>

              </div>

              <FileImage size={21} />

            </div>

            {/* CAMERA */}

            {!image && !video && (

              <div
                style={{
                  position: "relative",
                  background: "#07120f",
                  borderRadius: "16px",
                  overflow: "hidden",
                  minHeight: "360px",
                  display: "grid",
                  placeItems: "center",
                  marginTop: "16px",
                }}
              >

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: "100%",
                    height: "360px",
                    objectFit: "cover",
                  }}
                />

                {cameraLoading && (

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      background:
                        "rgba(0,0,0,.5)",
                    }}
                  >

                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >

                      <LoaderCircle
                        size={38}
                        className="cv-spin"
                      />

                      <p>
                        Starting camera...
                      </p>

                    </div>

                  </div>

                )}

              </div>

            )}

            {/* IMAGE PREVIEW */}

            {image && (

              <div
                style={{
                  position: "relative",
                  marginTop: "16px",
                }}
              >

                <img
                  src={image}
                  alt="Civic evidence"
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

              </div>

            )}

            {/* VIDEO PREVIEW */}

            {video && (

              <video
                src={video}
                controls
                style={{
                  width: "100%",
                  maxHeight: "420px",
                  marginTop: "16px",
                  borderRadius: "16px",
                  background: "#07120f",
                }}
              />

            )}

            {/* EVIDENCE ACTIONS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, 1fr)",
                gap: "10px",
                marginTop: "14px",
              }}
            >

              {!image && !video && (

                <button
                  type="button"
                  className="cv-primary"
                  onClick={handleCapture}
                  disabled={
                    cameraLoading ||
                    !location
                  }
                >
                  <Camera size={18} />
                  Take Photo
                </button>

              )}

              <button
                type="button"
                className="cv-ghost"
                onClick={() =>
                  imageInputRef.current?.click()
                }
              >
                <Upload size={18} />
                Upload Photo
              </button>

              <button
                type="button"
                className="cv-ghost"
                onClick={() =>
                  videoInputRef.current?.click()
                }
              >
                <Video size={18} />
                Upload Video
              </button>

              {!image && !video && (

                <button
                  type="button"
                  className="cv-ghost"
                  onClick={handleRetake}
                >
                  <X size={18} />
                  Cancel
                </button>

              )}

            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={
                handleImageUpload
              }
            />

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={
                handleVideoUpload
              }
            />

            {(image || video) && (

              <button
                type="button"
                className="cv-ghost"
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
                onClick={handleRetake}
                disabled={loadingAI}
              >
                <Camera size={18} />
                Replace Evidence
              </button>

            )}

          </section>

          {/* GPS */}

          <section className="cv-panel">

            <div className="cv-panel-head">

              <div>

                <span className="cv-kicker">
                  STEP 3
                </span>

                <h3>
                  Live GPS Location
                </h3>

              </div>

              <Navigation size={21} />

            </div>

            <div
              className="cv-location-card"
              style={{
                marginTop: "16px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >

                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "11px",
                    display: "grid",
                    placeItems: "center",
                    background:
                      gpsActive
                        ? "#e8f5ef"
                        : "#fff1f1",
                    color:
                      gpsActive
                        ? "#087553"
                        : "#b42318",
                  }}
                >

                  <Crosshair
                    size={19}
                  />

                </div>

                <div>

                  <strong>
                    {gpsActive
                      ? "GPS ACTIVE"
                      : "GPS UNAVAILABLE"}
                  </strong>

                  <span>
                    {location
                      ? `Accuracy ±${Math.round(
                          location.accuracy
                        )}m`
                      : gpsError ||
                        "Waiting for GPS..."}
                  </span>

                </div>

              </div>

            </div>

            {location && (

              <>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >

                  <div className="cv-ai-metric">
                    <span>
                      LATITUDE
                    </span>

                    <strong>
                      {location.lat.toFixed(7)}
                    </strong>
                  </div>

                  <div className="cv-ai-metric">
                    <span>
                      LONGITUDE
                    </span>

                    <strong>
                      {location.lon.toFixed(7)}
                    </strong>
                  </div>

                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >

                  <button
                    type="button"
                    className="cv-ghost"
                    onClick={openMap}
                  >
                    <MapPin size={17} />
                    View on Map
                  </button>

                  <button
                    type="button"
                    className="cv-primary"
                    onClick={startTracking}
                  >
                    <Crosshair size={17} />
                    Track Location
                  </button>

                </div>

                {mapUrl && (

                  <iframe
                    title="CivicVision GPS Map"
                    src={mapUrl}
                    style={{
                      width: "100%",
                      height: "300px",
                      border: 0,
                      borderRadius: "15px",
                      marginTop: "12px",
                    }}
                    loading="lazy"
                  />

                )}

              </>

            )}

          </section>

          {/* AI */}

          <section className="cv-panel">

            <div className="cv-panel-head">

              <div>

                <span className="cv-kicker">
                  STEP 4
                </span>

                <h3>
                  CivicVision AI Detection
                </h3>

              </div>

              <Zap size={21} />

            </div>

            {!image && !video && (

              <div className="cv-empty-state">

                <FileImage size={30} />

                <strong>
                  Evidence required
                </strong>

                <span>
                  Upload a photo or video
                  to start AI verification.
                </span>

              </div>

            )}

            {loadingAI && (

              <div
                className="cv-ai-loading"
                style={{
                  marginTop: "18px",
                }}
              >

                <LoaderCircle
                  size={24}
                  className="cv-spin"
                />

                <div>

                  <b>
                    CivicVision AI analyzing...
                  </b>

                  <span>
                    Detecting issue, severity,
                    risk and priority.
                  </span>

                </div>

              </div>

            )}

            {analysis &&
              !loadingAI && (

                <div
                  className="cv-ai-result"
                  style={{
                    marginTop: "18px",
                  }}
                >

                  <div>

                    <span className="cv-kicker">
                      AI VERIFICATION
                    </span>

                    <h3>
                      {analysis.detected}
                    </h3>

                  </div>

                  <strong>
                    {analysis.confidence}%
                    <small>
                      confidence
                    </small>
                  </strong>

                  <div className="cv-ai-metrics">

                    <div className="cv-ai-metric">
                      <span>
                        SEVERITY
                      </span>

                      <strong>
                        {analysis.severity}
                      </strong>
                    </div>

                    <div className="cv-ai-metric">
                      <span>
                        RISK
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

                  </div>

                  {analysis.damage && (

                    <div
                      style={{
                        marginTop: "14px",
                        padding: "14px",
                        borderRadius: "12px",
                        background: "#f7faf8",
                      }}
                    >

                      <span className="cv-kicker">
                        DAMAGE ASSESSMENT
                      </span>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "5px",
                        }}
                      >
                        {analysis.damage}
                      </strong>

                      <p
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        {analysis.recommendation}
                      </p>

                    </div>

                  )}

                  {/* GARBAGE */}

                  {selected.id ===
                    "garbage" && (

                    <div
                      style={{
                        marginTop: "14px",
                        padding: "16px",
                        borderRadius: "13px",
                        background:
                          analysis.binStatus ===
                          "Empty"
                            ? "#edf8f3"
                            : "#fff2f2",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >

                        <Zap size={18} />

                        <b>
                          Garbage Bin Status
                        </b>

                      </div>

                      <h2
                        style={{
                          margin:
                            "8px 0 4px",
                        }}
                      >
                        {analysis.binStatus ===
                        "Empty"
                          ? "EMPTY — +30 Civic Points"
                          : "FULL / OVERFLOWING — +0 Civic Points"}
                      </h2>

                      <span>
                        {analysis.binStatus ===
                        "Empty"
                          ? "AI verified an empty bin. This valid report earns 30 Civic Points."
                          : "AI detected a full or overflowing bin. This report earns 0 Civic Points."}
                      </span>

                    </div>

                  )}

                  {/* VERIFIED */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "15px",
                    }}
                  >

                    <CheckCircle2
                      size={19}
                    />

                    <strong>
                      AI Verification Complete
                    </strong>

                  </div>

                </div>

              )}

          </section>

          {/* ERROR */}

          {error && (

            <div className="cv-error">
              <AlertTriangle size={17} />
              {error}
            </div>

          )}

          {/* SUBMIT */}

          <section className="cv-panel">

            <div className="cv-panel-head">

              <div>

                <span className="cv-kicker">
                  STEP 5
                </span>

                <h3>
                  Submit Civic Report
                </h3>

              </div>

              <ShieldCheck size={21} />

            </div>

            <p className="cv-muted">

              Your report will include the
              uploaded evidence, AI assessment,
              GPS coordinates and location
              accuracy.

            </p>

            <button
              type="button"
              className="cv-primary"
              style={{
                width: "100%",
                marginTop: "14px",
              }}
              onClick={handleSubmit}
              disabled={
                submitting ||
                loadingAI ||
                !analysis ||
                !location ||
                (!image && !video)
              }
            >

              {submitting ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="cv-spin"
                  />
                  Submitting Report...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Submit Civic Report
                </>
              )}

            </button>

          </section>

        </div>

      )}

    </div>
  );
}

export default CivicReportIssue;