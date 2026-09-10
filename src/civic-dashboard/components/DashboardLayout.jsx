function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <section className="dashboard-layout">

      <div className="page-heading">

        <div>
          <h1>{title}</h1>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="page-actions">
            {actions}
          </div>
        )}

      </div>

      {children}

    </section>
  );
}

export default DashboardLayout;