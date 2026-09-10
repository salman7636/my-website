const issues = [
  {
    id: "pothole",
    icon: "🚧",
    label: "Pothole",
    description: "Road damage or pothole",
  },
  {
    id: "garbage",
    icon: "🗑️",
    label: "Garbage Overflow",
    description: "Garbage bin condition",
  },
  {
    id: "flood",
    icon: "🌊",
    label: "Flood / Waterlogging",
    description: "Water accumulation",
  },
  {
    id: "tree",
    icon: "🌳",
    label: "Fallen Tree",
    description: "Fallen or dangerous tree",
  },
  {
    id: "drain",
    icon: "🚰",
    label: "Blocked Drain",
    description: "Blocked drainage system",
  },
];

export default function CivicIssueSelector({ onSelect }) {
  return (
    <div className="cv-issue-grid">
      {issues.map((issue) => (
        <button
          key={issue.id}
          type="button"
          className="cv-issue-card"
          onClick={() => onSelect(issue)}
        >
          <span className="cv-issue-card-icon">
            {issue.icon}
          </span>

          <b>{issue.label}</b>

          <small>
            {issue.description}
          </small>

          <span className="cv-issue-action">
            Open camera →
          </span>
        </button>
      ))}
    </div>
  );
}