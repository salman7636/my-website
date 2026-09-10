import {
  CheckCircle2,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import { useState } from "react";

import { getCurrentLocation } from "../services/civicLocationService";

function CivicLocationCapture({
  location,
  onLocation,
}) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLocation() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getCurrentLocation();

      onLocation?.(result);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to get your location."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="location-capture">

      <div className="location-icon">
        <MapPin size={22} />
      </div>

      <div className="location-details">

        <span className="card-eyebrow">
          REPORT LOCATION
        </span>

        <h3>
          {location
            ? "Location captured"
            : "Add your location"}
        </h3>

        {location ? (

          <p>
            {location.lat.toFixed(6)},{" "}
            {location.lon.toFixed(6)}
            {" "}
            · Accuracy{" "}
            {location.accuracy}m
          </p>

        ) : (

          <p>
            GPS location helps civic teams
            find the reported issue.
          </p>

        )}

      </div>

      {location ? (

        <CheckCircle2
          size={22}
          className="location-success"
        />

      ) : (

        <button
          type="button"
          className="secondary-button"
          onClick={handleLocation}
          disabled={loading}
        >

          {loading ? (
            <>
              <LoaderCircle
                size={17}
                className="spin"
              />
              Locating...
            </>
          ) : (
            <>
              <MapPin size={17} />
              Get Location
            </>
          )}

        </button>

      )}

      {error && (
        <div className="location-error">
          {error}
        </div>
      )}

    </div>
  );
}

export default CivicLocationCapture;