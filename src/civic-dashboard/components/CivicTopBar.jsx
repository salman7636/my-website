import {
  Bell,
  Menu,
} from "lucide-react";

function CivicTopBar({
  user,
  unreadCount,
  onMenu,
  onNavigate,
}) {
  const firstLetter =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "C";

  return (
    <header className="civic-topbar">

      <button
        className="hamburger-button"
        onClick={onMenu}
      >
        <Menu size={23} />
      </button>

      <div className="topbar-title">

        <span>
          Citizen Portal
        </span>

        <small>
          AI-powered civic intelligence
        </small>

      </div>

      <div className="topbar-actions">

        <button
          className="notification-button"
          onClick={() =>
            onNavigate(
              "notifications"
            )
          }
        >

          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="notification-count">
              {unreadCount}
            </span>
          )}

        </button>

        <button
          className="topbar-user"
          onClick={() =>
            onNavigate("profile")
          }
        >

          <div className="avatar">
            {firstLetter}
          </div>

          <div className="topbar-user-info">

            <strong>
              {user?.name ||
                "Citizen"}
            </strong>

            <span>
              Citizen
            </span>

          </div>

        </button>

      </div>

    </header>
  );
}

export default CivicTopBar;