import {
  Check,
  CheckCircle2,
  Edit3,
  MapPin,
  Medal,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

function CivicProfile({
  user,
  reports = [],
  points = 0,
}) {
  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState(user?.name || "Citizen");

  const [savedName, setSavedName] =
    useState(user?.name || "Citizen");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const currentName =
      user?.name || "Citizen";

    setName(currentName);
    setSavedName(currentName);
  }, [user?.name]);

  const totalReports =
    reports.length;

  const verifiedReports =
    reports.filter(
      (report) =>
        report.analysis?.authentic ||
        report.status === "Verified"
    ).length;

  const initials = savedName
    ? savedName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) =>
          part.charAt(0)
        )
        .join("")
        .toUpperCase()
    : "C";

  function handleEdit() {
    setMessage("");
    setName(savedName);
    setEditing(true);
  }

  function handleCancel() {
    setName(savedName);
    setMessage("");
    setEditing(false);
  }

  function handleSave() {
    const cleanName =
      name.trim();

    if (!cleanName) {
      setMessage(
        "Please enter your full name."
      );
      return;
    }

    setSavedName(cleanName);

    try {
      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "civicvision_current_user"
          )
        );

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: cleanName,
        };

        localStorage.setItem(
          "civicvision_current_user",
          JSON.stringify(updatedUser)
        );

        const storedUsers =
          JSON.parse(
            localStorage.getItem(
              "civicvision_users"
            )
          ) || [];

        const updatedUsers =
          storedUsers.map((item) => {
            if (
              item.mobile ===
              currentUser.mobile
            ) {
              return {
                ...item,
                name: cleanName,
              };
            }

            return item;
          });

        localStorage.setItem(
          "civicvision_users",
          JSON.stringify(
            updatedUsers
          )
        );
      }
    } catch (error) {
      console.error(
        "Unable to update profile:",
        error
      );
    }

    setEditing(false);

    setMessage(
      "Profile name updated successfully."
    );

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-page-header">

        <div>
          <span className="profile-eyebrow">
            CITIZEN ACCOUNT
          </span>

          <h1>
            Profile
          </h1>

          <p>
            Manage your CivicVision
            citizen profile.
          </p>
        </div>

      </div>

      {/* PROFILE + ACTIVITY */}

      <div className="profile-top-grid">

        {/* PROFILE CARD */}

        <section className="profile-main-card">

          <div className="profile-cover">
            <div className="profile-cover-pattern" />
          </div>

          <div className="profile-main-content">

            <div className="profile-avatar-large">
              {initials}
            </div>

            <div className="profile-identity">

              <div className="profile-name-row">

                {editing ? (

                  <div className="profile-name-editor">

                    <input
                      autoFocus
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      maxLength={60}
                    />

                    <div className="profile-edit-actions">

                      <button
                        className="profile-save-button"
                        onClick={handleSave}
                      >
                        <Save size={14} />
                        Save
                      </button>

                      <button
                        className="profile-cancel-button"
                        onClick={handleCancel}
                      >
                        <X size={14} />
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <>
                    <h2>
                      {savedName}
                    </h2>

                    <button
                      className="profile-edit-button"
                      onClick={handleEdit}
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>
                  </>

                )}

              </div>

              <span className="profile-role">
                CivicVision Citizen
              </span>

              <div className="profile-meta">

                <span>
                  <UserRound size={13} />
                  {savedName}
                </span>

                <span>
                  <MapPin size={13} />
                  Citizen account
                </span>

              </div>

            </div>

            <div className="profile-verified">

              <CheckCircle2 size={14} />

              Verified

            </div>

          </div>

        </section>

        {/* ACTIVITY CARD */}

        <section className="profile-activity-card">

          <span className="profile-eyebrow">
            CIVIC ACTIVITY
          </span>

          <h2>
            Your contribution
          </h2>

          <div className="profile-activity-list">

            <div className="profile-activity-item">

              <div className="profile-activity-icon">
                <Medal size={17} />
              </div>

              <div>
                <span>
                  Civic Points
                </span>

                <strong>
                  {points.toLocaleString()}
                </strong>
              </div>

            </div>

            <div className="profile-activity-item">

              <div className="profile-activity-icon">
                <MapPin size={17} />
              </div>

              <div>
                <span>
                  Reports
                </span>

                <strong>
                  {totalReports}
                </strong>
              </div>

            </div>

            <div className="profile-activity-item">

              <div className="profile-activity-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <span>
                  Verified
                </span>

                <strong>
                  {verifiedReports}
                </strong>
              </div>

            </div>

          </div>

        </section>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="profile-success-message">

          <CheckCircle2 size={16} />

          <span>
            {message}
          </span>

        </div>
      )}

      {/* ACCOUNT INFORMATION */}

      <section className="profile-details-card">

        <div className="profile-details-header">

          <div>
            <span className="profile-eyebrow">
              ACCOUNT INFORMATION
            </span>

            <h2>
              Citizen details
            </h2>
          </div>

          {!editing && (
            <button
              className="profile-pencil-button"
              onClick={handleEdit}
              title="Edit profile"
            >
              <Edit3 size={18} />
            </button>
          )}

        </div>

        <div className="profile-details-grid">

          <div className="profile-detail">

            <span>
              FULL NAME
            </span>

            <strong>
              {savedName}
            </strong>

          </div>

          <div className="profile-detail">

            <span>
              MOBILE NUMBER
            </span>

            <strong>
              {user?.mobile ||
                "Not available"}
            </strong>

          </div>

          <div className="profile-detail">

            <span>
              ACCOUNT TYPE
            </span>

            <strong>
              Citizen
            </strong>

          </div>

          <div className="profile-detail">

            <span>
              STATUS
            </span>

            <strong className="profile-active">

              <Check size={13} />

              Active

            </strong>

          </div>

        </div>

      </section>

      {/* CONTRIBUTION */}

      <section className="profile-contribution-card">

        <div className="profile-contribution-icon">
          <Medal size={20} />
        </div>

        <div>

          <strong>
            Your civic contribution matters
          </strong>

          <p>
            Continue submitting genuine
            civic evidence to help your city
            identify problems faster.
          </p>

        </div>

      </section>

    </div>
  );
}

export default CivicProfile;