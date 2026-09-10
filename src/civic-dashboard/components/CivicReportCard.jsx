import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MapPin,
} from "lucide-react";

function CivicReportCard({
  report,
  onClick,
}) {
  const issue =
    report?.issueType ||
    report?.type ||
    "Civic Issue";

  const status =
    report?.status ||
    "Submitted";

  const location =
    typeof report?.location === "string"
      ? report.location
      : report?.location
      ? `${Number(
          report.location.lat
        ).toFixed(5)}, ${Number(
          report.location.lon
        ).toFixed(5)}`
      : "Location unavailable";

  const points =
    Number(report?.points || 0);

  return (
    <button
      className="report-list-item"
      onClick={() =>
        onClick?.(report)
      }
    >

      <div className="report-list-image">

        {report?.image ? (
          <img
            src={report.image}
            alt={issue}
          />
        ) : (
          <div className="report-list-image-empty">
            <ClipboardList size={23} />
          </div>
        )}

      </div>

      <div className="report-list-content">

        <div className="report-list-top">

          <span className="report-list-id">
            {report?.id ||
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
          {report?.description ||
            `AI verified ${issue} from submitted evidence.`}
        </p>

        <div className="report-list-meta">

          <span>
            <MapPin size={12} />
            {location}
          </span>

          {report?.analysis
            ?.confidence && (
            <span>
              <CheckCircle2
                size={12}
              />
              AI{" "}
              {
                report.analysis
                  .confidence
              }%
            </span>
          )}

        </div>

      </div>

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

export default CivicReportCard;