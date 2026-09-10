import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Target,
  Trash2,
  Award,
} from "lucide-react";

function CivicAIAnalysis({
  analysis,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="ai-analysis-card ai-loading">

        <div className="ai-loading-icon">
          <BrainCircuit size={30} />
        </div>

        <h3>
          Analyzing civic issue...
        </h3>

        <p>
          CivicVision AI is analyzing the
          submitted image and checking
          whether the garbage bin is full
          or empty.
        </p>

        <div className="ai-progress">
          <div />
        </div>

        <small>
          Running AI verification
        </small>

      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const isGarbage =
    analysis.detection ===
    "Garbage Overflow";

  const isEmpty =
    analysis.binStatus === "Empty";

  return (
    <div className="ai-analysis-card">

      {/* HEADER */}

      <div className="ai-analysis-header">

        <div className="ai-analysis-title">

          <div className="ai-analysis-icon">
            <BrainCircuit size={23} />
          </div>

          <div>
            <strong>
              AI Verification Complete
            </strong>

            <span>
              CivicVision intelligence engine
            </span>
          </div>

        </div>

        <div className="verified-badge">
          <CheckCircle2 size={15} />
          Verified
        </div>

      </div>

      {/* DETECTION */}

      <div className="ai-result-main">

        <div>

          <span className="result-label">
            DETECTED ISSUE
          </span>

          <h2>
            {analysis.detection}
          </h2>

          <div className="confidence">
            <ShieldCheck size={16} />

            {analysis.confidence}%
            confidence
          </div>

        </div>

      </div>

      {/* GARBAGE BIN STATUS */}

      {isGarbage && (
        <div
          className={`bin-status-card ${
            isEmpty
              ? "bin-empty"
              : "bin-full"
          }`}
        >

          <div className="bin-status-icon">

            {isEmpty ? (
              <CheckCircle2 size={26} />
            ) : (
              <Trash2 size={26} />
            )}

          </div>

          <div className="bin-status-content">

            <span>
              AI BIN ANALYSIS
            </span>

            <strong>
              {isEmpty
                ? "Bin is Empty"
                : "Bin is Full / Overflowing"}
            </strong>

            <p>
              {isEmpty
                ? "The garbage bin appears empty or sufficiently available."
                : "The garbage bin appears full and requires civic attention."}
            </p>

          </div>

        </div>
      )}

      {/* METRICS */}

      <div className="ai-result-grid">

        <div className="ai-result-item">
          <AlertTriangle size={18} />

          <div>
            <span>
              Severity
            </span>

            <strong>
              {analysis.severity}
            </strong>
          </div>
        </div>

        <div className="ai-result-item">
          <ShieldCheck size={18} />

          <div>
            <span>
              Safety Risk
            </span>

            <strong>
              {analysis.risk}
            </strong>
          </div>
        </div>

        <div className="ai-result-item">
          <Target size={18} />

          <div>
            <span>
              Priority
            </span>

            <strong>
              {analysis.priority}
            </strong>
          </div>
        </div>

        <div className="ai-result-item">
          <Award size={18} />

          <div>
            <span>
              Civic Points
            </span>

            <strong>
              +{analysis.points || 0}
            </strong>
          </div>
        </div>

      </div>

      {/* POINT RESULT */}

      {isGarbage && (
        <div
          className={`ai-points ${
            isEmpty
              ? "points-earned"
              : "points-not-earned"
          }`}
        >

          <div className="points-icon">
            {isEmpty ? "★" : "0"}
          </div>

          <span>

            {isEmpty ? (
              <>
                Great contribution!
                You earned
                <strong>
                  {" "}
                  +30 Civic Points
                </strong>
                {" "}for reporting a clean
                / available garbage bin.
              </>
            ) : (
              <>
                No points awarded.
                This bin is full or
                overflowing and requires
                civic attention.
              </>
            )}

          </span>

        </div>
      )}

      {/* OTHER ISSUES */}

      {!isGarbage && (
        <div className="ai-points points-not-earned">

          <div className="points-icon">
            0
          </div>

          <span>
            This civic issue does not
            qualify for points.
          </span>

        </div>
      )}

    </div>
  );
}

export default CivicAIAnalysis;