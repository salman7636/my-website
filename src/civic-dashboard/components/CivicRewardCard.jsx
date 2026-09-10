import {
  Award,
  Leaf,
  Sparkles,
} from "lucide-react";

function CivicRewardCard({
  points = 0,
}) {
  return (
    <div className="civic-reward-card">

      <div className="reward-card-icon">
        <Award size={25} />
      </div>

      <div className="reward-card-content">

        <span>
          CIVIC POINTS
        </span>

        <strong>
          {points.toLocaleString()}
        </strong>

        <p>
          Points earned through verified
          civic contributions.
        </p>

      </div>

      <Sparkles
        size={21}
        className="reward-sparkle"
      />

    </div>
  );
}

export default CivicRewardCard;