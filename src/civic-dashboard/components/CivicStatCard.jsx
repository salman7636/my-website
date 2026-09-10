function CivicStatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="civic-stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-content">

        <span>{label}</span>

        <strong>{value}</strong>

        {description && (
          <small>
            {description}
          </small>
        )}

      </div>

    </div>
  );
}

export default CivicStatCard;