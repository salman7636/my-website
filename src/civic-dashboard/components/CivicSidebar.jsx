import {
  Bell,
  BrainCircuit,
  ChevronRight,
  FileDown,
  Home,
  Leaf,
  LogOut,
  MapPinPlus,
  Medal,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  X,
} from "lucide-react";

function CivicSidebar({
  currentPage,
  open,
  onNavigate,
  onLogout,
}) {
  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "report",
      label: "Report Civic Issue",
      icon: MapPinPlus,
    },
    {
      id: "reports",
      label: "My Reports",
      icon: ShieldCheck,
    },
    {
      id: "ai",
      label: "AI Detection",
      icon: BrainCircuit,
    },
    {
      id: "rewards",
      label: "Civic Points",
      icon: Medal,
    },
    {
      id: "impact",
      label: "My Impact",
      icon: Target,
    },
    {
      id: "download",
      label: "Download Reports",
      icon: FileDown,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "profile",
      label: "Profile",
      icon: UserRound,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            onNavigate(currentPage)
          }
        />
      )}

      <aside
        className={`civic-sidebar ${
          open
            ? "sidebar-open"
            : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            <Leaf size={23} />
          </div>

          <div>
            <div className="sidebar-brand-name">
              Civic<span>Vision</span>
            </div>

            <div className="sidebar-subtitle">
              CITIZEN INTELLIGENCE
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() =>
              onNavigate(currentPage)
            }
          >
            <X size={20} />
          </button>

        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          {items.map((item) => {
            const Icon = item.icon;

            const active =
              currentPage === item.id;

            return (
              <button
                key={item.id}
                className={`sidebar-item ${
                  active
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onNavigate(item.id)
                }
              >

                <Icon size={18} />

                <span>
                  {item.label}
                </span>

                {active && (
                  <ChevronRight
                    size={15}
                    className="sidebar-arrow"
                  />
                )}

              </button>
            );
          })}

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-points">

            <div className="points-icon">
              ★
            </div>

            <div>
              <span>
                Civic Points
              </span>

              <strong>
                Help improve your city
              </strong>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={onLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>

        </div>

      </aside>
    </>
  );
}

export default CivicSidebar;