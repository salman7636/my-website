import { useState } from "react";

import CivicSidebar from "./components/CivicSidebar";
import CivicTopBar from "./components/CivicTopBar";

import CivicDashboard from "./pages/CivicDashboard";
import CivicReportIssue from "./pages/CivicReportIssue";
import CivicMyReports from "./pages/CivicMyReports";
import CivicReportDetails from "./pages/CivicReportDetails";
import CivicAIDetection from "./pages/CivicAIDetection";
import CivicRewards from "./pages/CivicRewards";
import CivicImpact from "./pages/CivicImpact";
import CivicNotifications from "./pages/CivicNotifications";
import CivicDownloadReports from "./pages/CivicDownloadReports";
import CivicProfile from "./pages/CivicProfile";
import CivicSettings from "./pages/CivicSettings";

import "./civic-dashboard.css";

function CivicDashboardApp({
  user = {
    name: "Citizen",
    mobile: "",
  },
  onLogout,
}) {
  const [page, setPage] = useState("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  /*
   * Civic Points
   *
   * Stored in localStorage so the balance
   * survives page refreshes.
   *
   * DEFAULT TEST BALANCE:
   * 10,000 Civic Points
   *
   * This allows you to test all redemption
   * options from the Civic Points portal.
   */
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem(
      "civicvision_points"
    );

    return saved
      ? Number(saved)
      : 10000;
  });

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title: "Welcome to CivicVision",
        message:
          "Your citizen dashboard is ready.",
        time: "Just now",
        unread: true,
      },
    ]);

  function navigate(nextPage) {
    setPage(nextPage);
    setSidebarOpen(false);
  }

  function openReportDetails(report) {
    setSelectedReport(report);
    navigate("report-details");
  }

function addReport(report) {
  // Add the new report to the beginning
  // of the reports list.
  setReports((previous) => [
    report,
    ...previous,
  ]);

  // Points earned from this report.
  const earnedPoints = Number(
    report.points || 0
  );

  // Only add points when this report
  // actually earned Civic Points.
  if (earnedPoints > 0) {
    setPoints((previous) => {
      const updated =
        Number(previous) + earnedPoints;

      // Save the NEW balance.
      localStorage.setItem(
        "civicvision_points",
        String(updated)
      );

      return updated;
    });
  }

  // Notification
  setNotifications((previous) => [
    {
      id: Date.now(),
      title: "Report submitted",

      message:
        earnedPoints > 0
          ? `${report.issueType} verified. You earned ${earnedPoints} Civic Points.`
          : `${report.issueType} report submitted successfully.`,

      time: "Just now",
      unread: true,
    },

    ...previous,
  ]);

  // Go to reports page
  navigate("reports");
}

  function markNotificationsRead() {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  }

  function renderPage() {
    if (page === "dashboard") {
      return (
        <CivicDashboard
          user={user}
          reports={reports}
          points={points}
          onNavigate={navigate}
        />
      );
    }

    if (page === "report") {
      return (
        <CivicReportIssue
          onNavigate={navigate}
          onReportCreated={addReport}
        />
      );
    }

    if (page === "reports") {
      return (
        <CivicMyReports
          reports={reports}
          onNavigate={navigate}
          onOpenReport={openReportDetails}
        />
      );
    }

    if (page === "report-details") {
      return (
        <CivicReportDetails
          report={selectedReport}
          onNavigate={navigate}
        />
      );
    }

    if (page === "ai") {
      return (
        <CivicAIDetection
          reports={reports}
          points={points}
          onNavigate={navigate}
        />
      );
    }

    if (page === "rewards") {
      return (
        <CivicRewards
          points={points}
          onNavigate={navigate}
        />
      );
    }

    if (page === "impact") {
      return (
        <CivicImpact
          reports={reports}
          points={points}
          onNavigate={navigate}
        />
      );
    }

    if (page === "notifications") {
      return (
        <CivicNotifications
          notifications={notifications}
          onNavigate={navigate}
          onMarkRead={markNotificationsRead}
        />
      );
    }

    if (page === "download") {
      return (
        <CivicDownloadReports
          reports={reports}
          onNavigate={navigate}
        />
      );
    }

    if (page === "profile") {
      return (
        <CivicProfile
          user={user}
          reports={reports}
          points={points}
        />
      );
    }

    if (page === "settings") {
      return (
        <CivicSettings
          user={user}
          onNavigate={navigate}
          onLogout={onLogout}
        />
      );
    }

    return (
      <div className="dashboard-placeholder">
        <h1>Page not found</h1>

        <p>
          This CivicVision page is not
          available yet.
        </p>

        <button
          onClick={() =>
            navigate("dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="civic-app">

      <CivicSidebar
        currentPage={page}
        open={sidebarOpen}
        onNavigate={navigate}
        onLogout={onLogout}
      />

      <div className="civic-main">

        <CivicTopBar
          user={user}
          unreadCount={
            notifications.filter(
              (item) => item.unread
            ).length
          }
          onMenu={() =>
            setSidebarOpen(
              (value) => !value
            )
          }
          onNavigate={navigate}
        />

        <main className="civic-content">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

export default CivicDashboardApp;