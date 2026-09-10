import { useMemo, useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  Filter,
  Plus,
  Search,
} from "lucide-react";

import CivicEmptyState from "../components/CivicEmptyState";

function CivicMyReports({
  reports = [],
  onNavigate,
  onOpenReport,
  navigate,
  openReport,
}) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const goToReport = onNavigate || navigate;
  const viewReport = onOpenReport || openReport;

  const filters = [
    "All",
    "Submitted",
    "Verified",
    "Assigned",
    "In Progress",
    "Resolved",
  ];

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const status =
        report.status || "Submitted";

      const matchesFilter =
        filter === "All" ||
        status === filter;

      const issue =
        report.issueType ||
        report.type ||
        "";

      const id =
        report.id || "";

      const matchesSearch =
        !query ||
        issue.toLowerCase().includes(query) ||
        id.toLowerCase().includes(query);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [reports, filter, search]);

  const totalReports = reports.length;

  const activeReports =
    reports.filter(
      (report) =>
        !["Resolved", "Closed"].includes(
          report.status
        )
    ).length;

  const resolvedReports =
    reports.filter(
      (report) =>
        report.status === "Resolved"
    ).length;

  const verifiedReports =
    reports.filter(
      (report) =>
        report.analysis?.authentic ||
        report.status === "Verified"
    ).length;

  function formatDate(report) {
    if (report.createdAt) {
      return report.createdAt;
    }

    if (report.date) {
      return report.date;
    }

    return "Recently submitted";
  }

  function formatLocation(report) {
    if (!report.location) {
      return "Location unavailable";
    }

    if (
      typeof report.location === "string"
    ) {
      return report.location;
    }

    if (
      report.location.lat !== undefined &&
      report.location.lon !== undefined
    ) {
      return `${Number(
        report.location.lat
      ).toFixed(5)}, ${Number(
        report.location.lon
      ).toFixed(5)}`;
    }

    return "GPS captured";
  }

  return (
    <div className="my-reports-page">

      {/* =====================================================
          HEADER
         ===================================================== */}

      <div className="my-reports-header">

        <div>
          <span className="page-eyebrow">
            REPORT MANAGEMENT
          </span>

          <h1>
            My Reports
          </h1>

          <p>
            Track every civic issue from
            submission to resolution.
          </p>
        </div>

        <button
          className="my-reports-primary"
          onClick={() =>
            goToReport?.("report")
          }
        >
          <Plus size={17} />
          Report New Issue
        </button>

      </div>

      {/* =====================================================
          STATISTICS
         ===================================================== */}

      <div className="reports-stat-grid">

        <div className="reports-stat-card">

          <div className="reports-stat-icon">
            <ClipboardList size={20} />
          </div>

          <div>
            <span>
              TOTAL REPORTS
            </span>

            <strong>
              {totalReports}
            </strong>

            <small>
              All submitted reports
            </small>
          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon">
            <Search size={20} />
          </div>

          <div>
            <span>
              ACTIVE REPORTS
            </span>

            <strong>
              {activeReports}
            </strong>

            <small>
              Currently being processed
            </small>
          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon">
            <Filter size={20} />
          </div>

          <div>
            <span>
              VERIFIED
            </span>

            <strong>
              {verifiedReports}
            </strong>

            <small>
              AI verified reports
            </small>

          </div>

        </div>

        <div className="reports-stat-card">

          <div className="reports-stat-icon">
            ✓
          </div>

          <div>
            <span>
              RESOLVED
            </span>

            <strong>
              {resolvedReports}
            </strong>

            <small>
              Successfully resolved
            </small>
          </div>

        </div>

      </div>

      {/* =====================================================
          SEARCH + FILTER
         ===================================================== */}

      <div className="reports-toolbar">

        <div className="reports-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search reports by issue or ID..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="reports-filter">

          {filters.map((item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      {/* =====================================================
          REPORT LIST
         ===================================================== */}

      <section className="reports-list-card">

        <div className="reports-list-header">

          <div>
            <span className="page-eyebrow">
              YOUR ACTIVITY
            </span>

            <h2>
              Submitted Reports
            </h2>
          </div>

          <span className="reports-count">
            {filteredReports.length}{" "}
            report
            {filteredReports.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {filteredReports.length === 0 ? (

          <CivicEmptyState
            title={
              reports.length === 0
                ? "No reports yet"
                : "No matching reports"
            }
            text={
              reports.length === 0
                ? "Create your first civic report and help improve your city."
                : "Try another search or filter."
            }
          />

        ) : (

          <div className="reports-list">

            {filteredReports.map(
              (report) => {

                const issue =
                  report.issueType ||
                  report.type ||
                  "Civic Issue";

                const location =
                  formatLocation(report);

                const date =
                  formatDate(report);

                const status =
                  report.status ||
                  "Submitted";

                const points =
                  Number(
                    report.points || 0
                  );

                const image =
                  report.image;

                const binStatus =
                  report.analysis
                    ?.binStatus;

                return (
                  <button
                    key={report.id}
                    className="report-list-item"
                    onClick={() =>
                      viewReport?.(report)
                    }
                  >

                    {/* IMAGE */}

                    <div className="report-list-image">

                      {image ? (
                        <img
                          src={image}
                          alt={issue}
                        />
                      ) : (
                        <div className="report-list-image-empty">
                          <ClipboardList
                            size={23}
                          />
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="report-list-content">

                      <div className="report-list-top">

                        <span className="report-list-id">
                          {report.id ||
                            "CIVIC REPORT"}
                        </span>

                        <span
                          className={`report-status ${status
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )}`}
                        >
                          {status}
                        </span>

                      </div>

                      <h3>
                        {issue}
                      </h3>

                      <p>
                        {report.description ||
                          `AI verified ${issue} from submitted evidence.`}
                      </p>

                      <div className="report-list-meta">

                        <span>
                          📍 {location}
                        </span>

                        <span>
                          🕒 {date}
                        </span>

                        {report.analysis
                          ?.confidence && (
                          <span>
                            ✓ AI{" "}
                            {
                              report.analysis
                                .confidence
                            }%
                          </span>
                        )}

                      </div>

                      {issue ===
                        "Garbage Overflow" &&
                        binStatus && (
                          <div
                            className={`bin-mini ${
                              binStatus ===
                              "Empty"
                                ? "empty"
                                : "full"
                            }`}
                          >
                            {binStatus ===
                            "Empty"
                              ? "✓ Bin Empty"
                              : "⚠ Bin Full / Overflowing"}
                          </div>
                        )}

                    </div>

                    {/* POINTS */}

                    <div className="report-list-points">

                      <span>
                        CIVIC POINTS
                      </span>

                      <strong>
                        +{points}
                      </strong>

                      <small>
                        {points > 0
                          ? "Earned"
                          : "No points"}
                      </small>

                    </div>

                    <ArrowRight
                      className="report-list-arrow"
                      size={18}
                    />

                  </button>
                );
              }
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default CivicMyReports;