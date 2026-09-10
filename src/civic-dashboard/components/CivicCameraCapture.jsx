import {
  Camera,
  RotateCcw,
  X,
} from "lucide-react";

import {
  captureFrame,
  startCamera,
  stopCamera,
} from "../services/civicCameraService";

import { useEffect, useRef, useState } from "react";

function CivicCameraCapture({
  onCapture,
  onClose,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [error, setError] =
    useState("");

  const [ready, setReady] =
    useState(false);

  async function openCamera() {
    try {
      setError("");

      const stream =
        await startCamera();

      streamRef.current =
        stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();

        setReady(true);
      }
    } catch (err) {
      setError(
        err?.message ||
          "Unable to access camera."
      );
    }
  }

  useEffect(() => {
    openCamera();

    return () => {
      stopCamera(
        streamRef.current
      );
    };
  }, []);

  function handleCapture() {
    try {
      const image =
        captureFrame(
          videoRef.current
        );

      stopCamera(
        streamRef.current
      );

      onCapture?.(image);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to capture image."
      );
    }
  }

  return (
    <div className="camera-capture">

      <div className="camera-header">

        <strong>
          Capture Evidence
        </strong>

        <button
          type="button"
          onClick={onClose}
        >
          <X size={19} />
        </button>

      </div>

      <div className="camera-preview">

        <video
          ref={videoRef}
          playsInline
          muted
        />

        {!ready && (
          <div className="camera-loading">
            <Camera size={27} />
            <span>
              Starting camera...
            </span>
          </div>
        )}

      </div>

      {error && (
        <div className="camera-error">
          {error}
        </div>
      )}

      <div className="camera-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={openCamera}
        >
          <RotateCcw size={17} />
          Restart
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleCapture}
          disabled={!ready}
        >
          <Camera size={18} />
          Capture
        </button>

      </div>

    </div>
  );
}

export default CivicCameraCapture;