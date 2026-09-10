import {
  Bell,
  CheckCheck,
  Info,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";

function CivicNotifications({
  notifications = [],
  onNavigate,
  onMarkRead,
}) {
  const items = notifications || [];

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated about your CivicVision activity."
      actions={
        items.some((item) => item.unread) ? (
          <button
            className="secondary-button"
            onClick={onMarkRead}
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        ) : null
      }
    >
      <div className="notifications-page">

        {/* HEADER CARD */}
        <div className="dashboard-card notifications-summary">

          <div className="notifications-summary-icon">
            <Bell size={26} />
          </div>

          <div>
            <span className="card-eyebrow">
              CIVICVISION ALERTS
            </span>

            <h2>
              Your civic activity
            </h2>

            <p>
              Important updates about your
              reports and Civic Points appear here.
            </p>
          </div>

          <div className="notification-count-large">
            {items.filter(
              (item) => item.unread
            ).length}

            <span>
              unread
            </span>
          </div>

        </div>

        {/* NOTIFICATION LIST */}
        <div className="dashboard-card notifications-list">

          <div className="section-header">

            <div>
              <span className="card-eyebrow">
                RECENT ACTIVITY
              </span>

              <h2>
                Notifications
              </h2>
            </div>

            <Bell size={23} />

          </div>

          {items.length === 0 ? (

            <div className="notification-empty">

              <div className="notification-empty-icon">
                <Bell size={25} />
              </div>

              <h3>
                No notifications yet
              </h3>

              <p>
                New CivicVision updates will
                appear here.
              </p>

            </div>

          ) : (

            <div className="notification-items">

              {items.map((item) => {

                const isReport =
                  item.title
                    ?.toLowerCase()
                    .includes("report");

                const isWelcome =
                  item.title
                    ?.toLowerCase()
                    .includes("welcome");

                const Icon = isReport
                  ? ShieldCheck
                  : isWelcome
                  ? Sparkles
                  : Info;

                return (
                  <div
                    key={item.id}
                    className={`notification-item ${
                      item.unread
                        ? "notification-unread"
                        : ""
                    }`}
                  >

                    <div className="notification-item-icon">
                      <Icon size={19} />
                    </div>

                    <div className="notification-item-content">

                      <div className="notification-item-title">

                        <strong>
                          {item.title}
                        </strong>

                        {item.unread && (
                          <span className="unread-dot" />
                        )}

                      </div>

                      <p>
                        {item.message}
                      </p>

                      <small>
                        {item.time}
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* REPORT CTA */}
        <div className="notifications-cta">

          <div className="notifications-cta-icon">
            <ShieldCheck size={24} />
          </div>

          <div>

            <strong>
              Have you spotted a civic issue?
            </strong>

            <p>
              Submit a report and help your
              city respond faster.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() =>
              onNavigate("report")
            }
          >
            Report Issue
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default CivicNotifications;