import {
  Check,
  Circle,
} from "lucide-react";

function CivicStatusTimeline({
  report,
}) {
  const status =
    report?.status || "Submitted";

  const statuses = [
    {
      id: "Submitted",
      label: "Report Submitted",
      description:
        "Your civic report was received.",
    },
    {
      id: "Verified",
      label: "AI Verified",
      description:
        "Evidence was analyzed.",
    },
    {
      id: "Assigned",
      label: "Assigned",
      description:
        "The issue was assigned for action.",
    },
    {
      id: "Resolved",
      label: "Resolved",
      description:
        "The civic issue was resolved.",
    },
  ];

  const currentIndex =
    statuses.findIndex(
      (item) => item.id === status
    );

  const safeIndex =
    currentIndex >= 0
      ? currentIndex
      : 0;

  return (
    <div className="status-timeline">

      {statuses.map(
        (item, index) => {
          const complete =
            index <= safeIndex;

          return (
            <div
              key={item.id}
              className={`timeline-item ${
                complete
                  ? "complete"
                  : ""
              }`}
            >

              <div className="timeline-marker">

                {complete ? (
                  <Check size={14} />
                ) : (
                  <Circle size={9} />
                )}

              </div>

              <div className="timeline-content">

                <strong>
                  {item.label}
                </strong>

                <span>
                  {item.description}
                </span>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}

export default CivicStatusTimeline;