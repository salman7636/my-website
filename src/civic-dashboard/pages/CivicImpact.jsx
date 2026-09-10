import {
  BarChart3,
  CheckCircle2,
  Leaf,
  MapPin,
  Target,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";

function CivicImpact({
  reports = [],
  points = 0,
}) {
  const totalReports = reports.length;

  const resolvedReports =
    reports.filter(
      (report) =>
        report.status === "Resolved"
    ).length;

  const verifiedReports =
    reports.filter(
      (report) =>
        report.analysis?.authentic !== false
    ).length;

  const pointsEarned = reports.reduce(
    (total, report) =>
      total +
      Number(report.points || 0),
    0
  );

  return (
    <DashboardLayout
      title="My Impact"
      subtitle="See how your civic contributions are helping your city."
    >
      {/* OVERVIEW */}
      <div className="impact-stat-grid">

        <div className="dashboard-card impact-stat-card">

          <div className="impact-stat-icon">
            <MapPin size={23} />
          </div>

          <div>
            <span>TOTAL REPORTS</span>

            <strong>
              {totalReports}
            </strong>

            <small>
              Civic issues reported
            </small>
          </div>

        </div>

        <div className="dashboard-card impact-stat-card">

          <div className="impact-stat-icon">
            <CheckCircle2 size={23} />
          </div>

          <div>
            <span>VERIFIED REPORTS</span>

            <strong>
              {verifiedReports}
            </strong>

            <small>
              Evidence verified
            </small>
          </div>

        </div>

        <div className="dashboard-card impact-stat-card">

          <div className="impact-stat-icon">
            <Target size={23} />
          </div>

          <div>
            <span>RESOLVED ISSUES</span>

            <strong>
              {resolvedReports}
            </strong>

            <small>
              Issues completed
            </small>
          </div>

        </div>

        <div className="dashboard-card impact-stat-card">

          <div className="impact-stat-icon">
            <Leaf size={23} />
          </div>

          <div>
            <span>CIVIC POINTS</span>

            <strong>
              {points.toLocaleString()}
            </strong>

            <small>
              Contribution score
            </small>
          </div>

        </div>

      </div>

      {/* IMPACT SCORE */}
      <div className="dashboard-card impact-score-card">

        <div className="impact-score-header">

          <div>

            <span className="card-eyebrow">
              YOUR CIVIC CONTRIBUTION
            </span>

            <h2>
              Community Impact Score
            </h2>

            <p>
              Every verified report helps
              CivicVision build a clearer
              picture of your city's needs.
            </p>

          </div>

          <div className="impact-score-circle">
            <TrendingUp size={25} />

            <strong>
              {Math.min(
                100,
                totalReports * 10 +
                  resolvedReports * 10
              )}
            </strong>

            <span>
              IMPACT
            </span>
          </div>

        </div>

        <div className="impact-progress">

          <div
            className="impact-progress-fill"
            style={{
              width: `${Math.min(
                100,
                totalReports * 10 +
                  resolvedReports * 10
              )}%`,
            }}
          />

        </div>

      </div>

      {/* CONTRIBUTION BREAKDOWN */}
      <div className="dashboard-card">

        <div className="section-header">

          <div>

            <span className="card-eyebrow">
              CONTRIBUTION BREAKDOWN
            </span>

            <h2>
              Your civic activity
            </h2>

          </div>

          <BarChart3 size={24} />

        </div>

        <div className="impact-breakdown">

          <div className="impact-breakdown-item">

            <div className="impact-breakdown-number">
              {totalReports}
            </div>

            <div>
              <strong>
                Reports submitted
              </strong>

              <span>
                Issues you've brought
                to CivicVision
              </span>
            </div>

          </div>

          <div className="impact-breakdown-item">

            <div className="impact-breakdown-number">
              {verifiedReports}
            </div>

            <div>
              <strong>
                Reports verified
              </strong>

              <span>
                Evidence accepted by
                the verification system
              </span>
            </div>

          </div>

          <div className="impact-breakdown-item">

            <div className="impact-breakdown-number">
              {pointsEarned}
            </div>

            <div>
              <strong>
                Points earned
              </strong>

              <span>
                Civic Points from
                eligible contributions
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* MESSAGE */}
      <div className="impact-message-card">

        <div className="impact-message-icon">
          <Leaf size={25} />
        </div>

        <div>

          <strong>
            Every report can make a difference.
          </strong>

          <p>
            Keep reporting genuine civic
            issues with clear photos and
            accurate locations. CivicVision
            turns citizen observations into
            actionable civic intelligence.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CivicImpact;