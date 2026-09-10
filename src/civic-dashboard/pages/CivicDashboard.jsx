import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  MapPinPlus,
  Medal,
  Plus,
  ShieldCheck,
  Target,
} from "lucide-react";

function CivicDashboard({
  user,
  reports = [],
  points = 0,
  onNavigate,
}) {
  const totalReports = reports.length;

  const resolvedReports = reports.filter(
    (report) =>
      report.status === "Resolved"
  ).length;

  const verifiedReports = reports.filter(
    (report) =>
      report.analysis?.authentic ||
      report.status === "Verified"
  ).length;

  const recentReports =
    reports.slice(0, 3);

  return (
    <div className="civic-dashboard-page">

      {/* =====================================================
          HERO
         ===================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <span className="dashboard-eyebrow">
            AI-POWERED CIVIC INTELLIGENCE
          </span>

          <h1>
            Welcome,{" "}
            <span>
              {user?.name || "Citizen"}
            </span>
          </h1>

          <p>
            Monitor your civic contributions
            and community impact.
          </p>

        </div>

        <button
          className="dashboard-report-button"
          onClick={() =>
            onNavigate("report")
          }
        >
          <Plus size={17} />
          Report Issue
        </button>

      </section>

      {/* =====================================================
          INTRO
         ===================================================== */}

      <section className="dashboard-intro">

        <div className="intro-icon">
          <ShieldCheck size={18} />
        </div>

        <div>
          <span>
            CIVICVISION PLATFORM
          </span>

          <h2>
            Make your city better,
            one report at a time.
          </h2>

          <p>
            Report potholes, garbage,
            flooding, blocked drains and
            other civic issues. CivicVision
            verifies your report and helps
            route it toward resolution.
          </p>
        </div>

      </section>

      {/* =====================================================
          STATISTICS
         ===================================================== */}

      <section className="dashboard-stats-grid">

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <span>
              TOTAL REPORTS
            </span>

            <strong>
              {totalReports}
            </strong>

            <small>
              Your civic submissions
            </small>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              RESOLVED
            </span>

            <strong>
              {resolvedReports}
            </strong>

            <small>
              Issues resolved
            </small>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <Medal size={21} />
          </div>

          <div>
            <span>
              CIVIC POINTS
            </span>

            <strong>
              {points.toLocaleString()}
            </strong>

            <small>
              Community contribution
            </small>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <span>
              AI VERIFIED
            </span>

            <strong>
              {verifiedReports}
            </strong>

            <small>
              Verified civic evidence
            </small>
          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
         ===================================================== */}

      <section className="dashboard-panel">

        <div className="dashboard-panel-header">

          <div>
            <span className="panel-eyebrow">
              GET STARTED
            </span>

            <h2>
              Quick Actions
            </h2>

            <p>
              Start a civic activity
            </p>
          </div>

        </div>

        <div className="quick-actions-grid">

          <button
            className="quick-action-card"
            onClick={() =>
              onNavigate("report")
            }
          >

            <div className="quick-action-icon">
              <MapPinPlus size={22} />
            </div>

            <div className="quick-action-content">

              <strong>
                Report a Civic Issue
              </strong>

              <span>
                Capture an issue using
                your camera and location.
              </span>

            </div>

            <ArrowRight
              size={17}
              className="quick-action-arrow"
            />

          </button>

          <button
            className="quick-action-card"
            onClick={() =>
              onNavigate("ai")
            }
          >

            <div className="quick-action-icon">
              <BrainCircuit size={22} />
            </div>

            <div className="quick-action-content">

              <strong>
                AI Detection
              </strong>

              <span>
                Analyze civic problems
                using AI verification.
              </span>

            </div>

            <ArrowRight
              size={17}
              className="quick-action-arrow"
            />

          </button>

          <button
            className="quick-action-card"
            onClick={() =>
              onNavigate("rewards")
            }
          >

            <div className="quick-action-icon">
              <Medal size={22} />
            </div>

            <div className="quick-action-content">

              <strong>
                Civic Points
              </strong>

              <span>
                View your civic points
                and contribution history.
              </span>

            </div>

            <ArrowRight
              size={17}
              className="quick-action-arrow"
            />

          </button>

          <button
            className="quick-action-card"
            onClick={() =>
              onNavigate("impact")
            }
          >

            <div className="quick-action-icon">
              <Target size={22} />
            </div>

            <div className="quick-action-content">

              <strong>
                My Impact
              </strong>

              <span>
                See how your reports
                help improve your city.
              </span>

            </div>

            <ArrowRight
              size={17}
              className="quick-action-arrow"
            />

          </button>

        </div>

      </section>

      {/* =====================================================
          LOWER DASHBOARD
         ===================================================== */}

      <div className="dashboard-lower-grid">

        {/* RECENT REPORTS */}

        <section className="dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-eyebrow">
                ACTIVITY
              </span>

              <h2>
                Recent Reports
              </h2>
            </div>

            <button
              className="panel-link"
              onClick={() =>
                onNavigate("reports")
              }
            >
              View all
              <ArrowRight size={14} />
            </button>

          </div>

          {recentReports.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">
                <ClipboardList size={23} />
              </div>

              <strong>
                No reports yet
              </strong>

              <p>
                Your recent civic reports
                will appear here.
              </p>

              <button
                onClick={() =>
                  onNavigate("report")
                }
              >
                Create your first report
              </button>

            </div>

          ) : (

            <div className="dashboard-recent-list">

              {recentReports.map(
                (report) => {

                  const issue =
                    report.issueType ||
                    report.type ||
                    "Civic Issue";

                  return (
                    <button
                      key={report.id}
                      className="dashboard-recent-item"
                      onClick={() =>
                        onNavigate(
                          "reports"
                        )
                      }
                    >

                      <div className="recent-image">

                        {report.image ? (
                          <img
                            src={report.image}
                            alt={issue}
                          />
                        ) : (
                          <Activity
                            size={20}
                          />
                        )}

                      </div>

                      <div className="recent-info">

                        <strong>
                          {issue}
                        </strong>

                        <span>
                          {report.id ||
                            "Civic report"}
                        </span>

                      </div>

                      <span
                        className={`recent-status ${(
                          report.status ||
                          "Submitted"
                        )
                          .toLowerCase()
                          .replaceAll(
                            " ",
                            "-"
                          )}`}
                      >
                        {report.status ||
                          "Submitted"}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* AI VERIFICATION */}

        <section className="dashboard-panel ai-dashboard-panel">

          <div className="dashboard-panel-header">

            <div>
              <span className="panel-eyebrow">
                INTELLIGENCE
              </span>

              <h2>
                AI Verification
              </h2>

              <p>
                CivicVision analyzes evidence
                before submission.
              </p>
            </div>

            <div className="ai-panel-icon">
              <BrainCircuit size={22} />
            </div>

          </div>

          <div className="ai-dashboard-content">

            <div className="ai-feature">

              <div className="ai-feature-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>
                  Evidence Verification
                </strong>

                <span>
                  AI checks whether submitted
                  evidence matches the issue.
                </span>
              </div>

            </div>

            <div className="ai-feature">

              <div className="ai-feature-icon">
                <MapPinPlus size={18} />
              </div>

              <div>
                <strong>
                  Location Intelligence
                </strong>

                <span>
                  GPS information helps map
                  civic problems accurately.
                </span>
              </div>

            </div>

            <button
              className="ai-dashboard-button"
              onClick={() =>
                onNavigate("ai")
              }
            >
              Open AI Detection
              <ArrowRight size={15} />
            </button>

          </div>

        </section>

      </div>

    </div>
  );
}

export default CivicDashboard;