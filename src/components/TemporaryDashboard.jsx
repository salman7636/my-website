import {
  Leaf,
  LogOut,
  MapPin,
  Sparkles,
} from "lucide-react";

function TemporaryDashboard({
  user,
  onLogout,
}) {
  return (
    <div className="temporary-dashboard">

      <header>

        <div className="brand-header dark">

          <div className="brand-logo">
            <Leaf size={22} />
          </div>

          <div>

            <div className="brand-name">
              Civic<span>Vision</span>
            </div>

            <div className="brand-subtitle">
              AI-POWERED SMART CITY
            </div>

          </div>

        </div>

        <button
          className="logout"
          onClick={onLogout}
        >

          <LogOut size={15} />

          Sign out

        </button>

      </header>

      <main>

        <div className="brand-eyebrow">

          <Sparkles size={15} />

          AUTHENTICATION COMPLETE

        </div>

        <h1>
          Welcome, {user.name || "Citizen"} 👋
        </h1>

        <p>
          Your CivicVision account is ready.
          The Citizen Dashboard will be built next.
        </p>

        <div className="dashboard-placeholder">

          <div className="placeholder-icon">
            <MapPin />
          </div>

          <div>

            <h3>
              Citizen Dashboard
            </h3>

            <p>
              Next: Report potholes, garbage overflow,
              floods, fallen trees and blocked drains.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default TemporaryDashboard;