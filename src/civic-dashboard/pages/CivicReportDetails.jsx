import React, { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Target,
  CalendarDays,
  FileText,
  Trash2,
  Award,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import CivicStatusTimeline from "../components/CivicStatusTimeline";

function CivicReportDetails({
  report,
  onNavigate,
}) {
  // =========================================
  // REPORT NOT FOUND
  // =========================================

  if (!report) {
    return (
      <DashboardLayout
        title="Report Details"
        subtitle="Report information is unavailable."
      >
        <div className="dashboard-placeholder">
          <FileText size={40} />

          <h2>Report not found</h2>

          <p>
            This report could not be loaded.
          </p>

          <button
            className="primary-action"
            onClick={() =>
              onNavigate("reports")
            }
          >
            Back to My Reports
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================
  // AI ANALYSIS
  // =========================================

  const analysis =
    report.analysis || {};

  const isGarbage =
    report.issueType ===
    "Garbage Overflow";

  const isEmptyBin =
    analysis.binStatus === "Empty";

  const isFullBin =
    analysis.binStatus === "Full";

  // =========================================
  // PAGE
  // =========================================

  return (
    <DashboardLayout
      title="Report Details"
      subtitle={`Track the complete lifecycle of ${report.id}`}
      actions={
        <button
          className="secondary-action"
          onClick={() =>
            onNavigate("reports")
          }
        >
          <ArrowLeft size={17} />
          Back to My Reports
        </button>
      }
    >
      <div className="report-details-page">

        {/* =====================================
            REPORT HEADER
        ====================================== */}

        <div className="report-details-top">

          <div className="report-details-identity">

            <div className="report-details-icon">
              <FileText size={23} />
            </div>

            <div>

              <span className="section-eyebrow">
                CIVIC REPORT
              </span>

              <h2>
                {report.issueType}
              </h2>

              <p>
                Report ID:{" "}
                <strong>
                  {report.id}
                </strong>
              </p>

            </div>

          </div>

          <div className="report-status-badge">

            <CheckCircle2 size={16} />

            {report.status}

          </div>

        </div>

        {/* =====================================
            MAIN GRID
        ====================================== */}

        <div className="report-details-grid">

          {/* ===================================
              LEFT COLUMN
          ==================================== */}

          <div className="report-details-main">

            {/* =================================
                EVIDENCE
            ================================== */}

            {report.image && (
              <div className="details-card evidence-card">

                <div className="details-card-header">

                  <div>

                    <span className="section-eyebrow">
                      EVIDENCE
                    </span>

                    <h3>
                      Submitted Image
                    </h3>

                  </div>

                </div>

                <div className="evidence-image-wrapper">

                  <img
                    src={report.image}
                    alt={report.issueType}
                    className="evidence-image"
                  />

                </div>

                <div className="evidence-description">

                  <FileText size={17} />

                  <span>
                    {report.description}
                  </span>

                </div>

              </div>
            )}

            {/* =================================
                AI VERIFICATION
            ================================== */}

            <div className="details-card">

              <div className="details-card-header">

                <div>

                  <span className="section-eyebrow">
                    AI INTELLIGENCE
                  </span>

                  <h3>
                    AI Verification
                  </h3>

                </div>

                <div className="ai-mini-badge">

                  <BrainCircuit size={15} />

                  AI Verified

                </div>

              </div>

              {/* AI MAIN RESULT */}

              <div className="details-ai-main">

                <div>

                  <span className="result-label">
                    DETECTED ISSUE
                  </span>

                  <h2>
                    {analysis.detection ||
                      report.issueType}
                  </h2>

                  <div className="details-confidence">

                    <ShieldCheck size={16} />

                    {analysis.confidence ||
                      0}
                    % confidence

                  </div>

                </div>

              </div>

              {/* =================================
                  GARBAGE BIN STATUS
              ================================== */}

              {isGarbage && (
                <div
                  className={`bin-status-card ${
                    isEmptyBin
                      ? "bin-empty"
                      : "bin-full"
                  }`}
                >

                  <div className="bin-status-icon">

                    {isEmptyBin ? (
                      <CheckCircle2
                        size={26}
                      />
                    ) : (
                      <Trash2
                        size={26}
                      />
                    )}

                  </div>

                  <div className="bin-status-content">

                    <span>
                      AI BIN ANALYSIS
                    </span>

                    <strong>
                      {isEmptyBin
                        ? "Bin is Empty"
                        : isFullBin
                        ? "Bin is Full / Overflowing"
                        : "Bin Status Detected"}
                    </strong>

                    <p>
                      {isEmptyBin
                        ? "The garbage bin appears empty or sufficiently available."
                        : isFullBin
                        ? "The garbage bin appears full or overflowing and requires civic attention."
                        : "CivicVision AI analyzed the submitted garbage bin image."}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================
                  AI METRICS
              ================================== */}

              <div className="details-metric-grid">

                {/* SEVERITY */}

                <div className="details-metric">

                  <ShieldCheck
                    size={18}
                  />

                  <div>

                    <span>
                      Severity
                    </span>

                    <strong>
                      {analysis.severity ||
                        "Unknown"}
                    </strong>

                  </div>

                </div>

                {/* SAFETY RISK */}

                <div className="details-metric">

                  <ShieldCheck
                    size={18}
                  />

                  <div>

                    <span>
                      Safety Risk
                    </span>

                    <strong>
                      {analysis.risk ||
                        "Unknown"}
                    </strong>

                  </div>

                </div>

                {/* PRIORITY */}

                <div className="details-metric">

                  <Target size={18} />

                  <div>

                    <span>
                      Priority
                    </span>

                    <strong>
                      {analysis.priority ||
                        "Normal"}
                    </strong>

                  </div>

                </div>

                {/* CIVIC POINTS */}

                <div className="details-metric">

                  <Award size={18} />

                  <div>

                    <span>
                      Civic Points
                    </span>

                    <strong>
                      +
                      {report.points ||
                        0}
                    </strong>

                  </div>

                </div>

              </div>

              {/* =================================
                  POINT RESULT
              ================================== */}

              {isGarbage && (
                <div
                  className={`ai-points ${
                    isEmptyBin
                      ? "points-earned"
                      : "points-not-earned"
                  }`}
                >

                  <div className="points-icon">

                    {isEmptyBin
                      ? "★"
                      : "0"}

                  </div>

                  <span>

                    {isEmptyBin ? (
                      <>
                        Great contribution!
                        You earned{" "}
                        <strong>
                          +30 Civic Points
                        </strong>{" "}
                        for reporting an
                        empty garbage bin.
                      </>
                    ) : (
                      <>
                        No points awarded.
                        This bin is full or
                        overflowing and
                        requires civic
                        attention.
                      </>
                    )}

                  </span>

                </div>
              )}

              {/* OTHER CIVIC ISSUES */}

              {!isGarbage && (
                <div className="ai-points points-not-earned">

                  <div className="points-icon">
                    0
                  </div>

                  <span>
                    This civic issue does not
                    qualify for Civic Points.
                  </span>

                </div>
              )}

            </div>

            {/* =================================
                STATUS TIMELINE
            ================================== */}

            <CivicStatusTimeline
              report={report}
            />

          </div>

          {/* ===================================
              RIGHT COLUMN
          ==================================== */}

          <aside className="report-details-side">

            {/* =================================
                LOCATION
            ================================== */}

            {/* ================= GPS LOCATION CARD ================= */}

<div className="report-location-card">
  <div className="details-card-header">
    <div>
      <span className="section-eyebrow">LIVE GPS LOCATION</span>
      <h3>Location Verified</h3>
    </div>

    <div className="gps-live-badge">
      <MapPin size={15} />
      Live
    </div>
  </div>

  {report.location ? (
    <>
      {/* GPS MAP PREVIEW — intentionally uses local UI only.
          Do not use AsyncImage here because it is not imported and
          causes the Reports page to crash at runtime. */}
      <div className="gps-map-preview">
        <div className="gps-map-grid" aria-hidden="true">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
        <div className="gps-pin">
          <MapPin size={26} />
        </div>
        <div className="gps-map-label">
          GPS location captured
        </div>
      </div>

      {/* Coordinates */}
      <div className="report-location-values">
        <div className="report-location-value">
          <span>LATITUDE</span>
          <strong>{report.location.lat}</strong>
        </div>

        <div className="report-location-value">
          <span>LONGITUDE</span>
          <strong>{report.location.lon}</strong>
        </div>

        <div className="report-location-value">
          <span>GPS ACCURACY</span>
          <strong>±{report.location.accuracy} meters</strong>
        </div>

        <div className="report-location-value">
          <span>TRACK STATUS</span>
          <strong className="gps-status">LIVE TRACKED</strong>
        </div>
      </div>

      {/* Buttons */}
      <div className="gps-buttons">
        <button
          type="button"
          className="gps-open-btn"
          onClick={() => {
            const { lat, lon } = report.location;
            window.open(
              `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lon)}`,
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          <MapPin size={16} />
          Open in Google Maps
        </button>

        <button
          type="button"
          className="gps-copy-btn"
          onClick={async () => {
            const { lat, lon } = report.location;
            const coordinates = `${lat}, ${lon}`;
            try {
              await navigator.clipboard.writeText(coordinates);
              alert("Coordinates copied successfully.");
            } catch {
              window.prompt("Copy these coordinates:", coordinates);
            }
          }}
        >
          Copy Coordinates
        </button>
      </div>
    </>
  ) : (
    <p className="muted-text">
      GPS location unavailable.
    </p>
  )}
</div>

            {/* =================================
                REPORT INFORMATION
            ================================== */}

            <div className="details-card">

              <div className="details-card-header">

                <div>

                  <span className="section-eyebrow">
                    REPORT INFORMATION
                  </span>

                  <h3>
                    Details
                  </h3>

                </div>

              </div>

              <div className="report-info-list">

                {/* CREATED */}

                <div>

                  <CalendarDays
                    size={17}
                  />

                  <span>
                    Created
                  </span>

                  <strong>
                    {report.createdAt}
                  </strong>

                </div>

                {/* CIVIC POINTS */}

                <div>

                  <Award size={17} />

                  <span>
                    Civic Points
                  </span>

                  <strong>
                    +
                    {report.points ||
                      0}
                  </strong>

                </div>

                {/* ISSUE TYPE */}

                <div>

                  <Target size={17} />

                  <span>
                    Issue Type
                  </span>

                  <strong>
                    {report.issueType}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================
                IMPACT CARD
            ================================== */}

            <div className="details-impact-card">

              <div className="impact-card-icon">
                <Target size={22} />
              </div>

              <h3>
                Your report makes a
                difference.
              </h3>

              <p>
                Verified civic reports help
                authorities identify problems
                faster and improve public
                infrastructure.
              </p>

            </div>

          </aside>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default CivicReportDetails;