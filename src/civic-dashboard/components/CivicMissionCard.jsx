import {
  CheckCircle2,
  Target,
} from "lucide-react";

function CivicMissionCard({
  title = "Help your city",
  description =
    "Submit a genuine civic report.",
  progress = 0,
  target = 1,
}) {
  const percentage = Math.min(
    100,
    Math.round(
      (progress / Math.max(target, 1)) *
        100
    )
  );

  return (
    <div className="mission-card">

      <div className="mission-header">

        <div className="mission-icon">
          <Target size={20} />
        </div>

        <span>
          CIVIC MISSION
        </span>

      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

      <div className="mission-progress">

        <div>
          <span>
            {progress} / {target}
          </span>

          <strong>
            {percentage}%
          </strong>
        </div>

        <div className="mission-progress-bar">
          <div
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

      </div>

      {percentage >= 100 && (
        <div className="mission-complete">
          <CheckCircle2 size={15} />
          Mission complete
        </div>
      )}

    </div>
  );
}

export default CivicMissionCard;