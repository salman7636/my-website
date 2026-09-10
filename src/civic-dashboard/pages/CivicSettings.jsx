import {
  Bell,
  Camera,
  CheckCircle2,
  Lock,
  MapPin,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";

function CivicSettings() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Control your CivicVision preferences."
    >
      <div className="settings-grid">

        <div className="dashboard-card settings-card">

          <div className="settings-card-header">
            <div className="settings-icon">
              <Bell size={21} />
            </div>

            <div>
              <h3>
                Notifications
              </h3>

              <p>
                Manage civic activity alerts.
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Report updates
              </strong>

              <span>
                Receive updates when report
                status changes.
              </span>
            </div>

            <div className="settings-toggle active">
              <span />
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Civic Points
              </strong>

              <span>
                Receive notifications when points
                are earned.
              </span>
            </div>

            <div className="settings-toggle active">
              <span />
            </div>
          </div>

        </div>

        <div className="dashboard-card settings-card">

          <div className="settings-card-header">
            <div className="settings-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3>
                Privacy & Security
              </h3>

              <p>
                Keep your civic account protected.
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Secure account
              </strong>

              <span>
                Your account is protected by
                authentication.
              </span>
            </div>

            <CheckCircle2
              size={21}
              className="settings-check"
            />
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Authentication
              </strong>

              <span>
                Password-protected citizen account.
              </span>
            </div>

            <Lock
              size={19}
              className="settings-muted"
            />
          </div>

        </div>

        <div className="dashboard-card settings-card">

          <div className="settings-card-header">
            <div className="settings-icon">
              <Camera size={21} />
            </div>

            <div>
              <h3>
                Camera
              </h3>

              <p>
                Configure evidence capture.
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                Camera access
              </strong>

              <span>
                Camera permission is requested
                when you create a report.
              </span>
            </div>

            <Camera size={19} />
          </div>

        </div>

        <div className="dashboard-card settings-card">

          <div className="settings-card-header">
            <div className="settings-icon">
              <MapPin size={21} />
            </div>

            <div>
              <h3>
                Location
              </h3>

              <p>
                Configure report location access.
              </p>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <strong>
                GPS location
              </strong>

              <span>
                Location is requested when
                submitting a civic report.
              </span>
            </div>

            <MapPin size={19} />
          </div>

        </div>

      </div>

      <div className="settings-footer">

        <SettingsIcon size={18} />

        <span>
          CivicVision frontend demonstration
          settings.
        </span>

      </div>

    </DashboardLayout>
  );
}

export default CivicSettings;