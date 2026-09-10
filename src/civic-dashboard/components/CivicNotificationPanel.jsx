import {
  Bell,
  CheckCircle2,
} from "lucide-react";

function CivicNotificationPanel({
  notifications = [],
}) {
  return (
    <div className="notification-panel">

      {notifications.length === 0 ? (

        <div className="notification-panel-empty">

          <Bell size={22} />

          <span>
            No notifications
          </span>

        </div>

      ) : (

        notifications
          .slice(0, 5)
          .map((item) => (
            <div
              className={`notification-panel-item ${
                item.unread
                  ? "unread"
                  : ""
              }`}
              key={item.id}
            >

              <div>
                <CheckCircle2 size={17} />
              </div>

              <section>

                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.message}
                </p>

                <small>
                  {item.time}
                </small>

              </section>

            </div>
          ))

      )}

    </div>
  );
}

export default CivicNotificationPanel;