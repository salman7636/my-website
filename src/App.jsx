import { useState } from "react";
import CivicDashboardApp from "./civic-dashboard/CivicDashboardApp";
import "./styles.css";

/* =========================================================
   MODES
   ========================================================= */

const MODES = {
  LOGIN: "login",
  CREATE: "create",
  FORGOT: "forgot",
  DASHBOARD: "dashboard",
};

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const USERS_KEY = "civicvision_users";
const CURRENT_USER_KEY =
  "civicvision_current_user";

/* =========================================================
   HELPERS
   ========================================================= */

function getUsers() {
  try {
    return JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

function normalizeMobile(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function generateOtp() {
  return String(
    Math.floor(100000 + Math.random() * 900000)
  );
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  /* =======================================================
     AUTH MODE
     ======================================================= */

  const [mode, setMode] = useState(() => {
    try {
      const currentUser =
        localStorage.getItem(
          CURRENT_USER_KEY
        );

      return currentUser
        ? MODES.DASHBOARD
        : MODES.LOGIN;
    } catch {
      return MODES.LOGIN;
    }
  });

  /* =======================================================
     USER
     ======================================================= */

  const [currentUser, setCurrentUser] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            CURRENT_USER_KEY
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
    });

  /* =======================================================
     FORM
     ======================================================= */

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  /* =======================================================
     OTP
     ======================================================= */

  const [generatedOtp, setGeneratedOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  /* =======================================================
     UI
     ======================================================= */

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     RESET FORM
     ======================================================= */

  function resetForm() {
    setName("");
    setMobile("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");

    setGeneratedOtp("");
    setOtpSent(false);
    setOtpVerified(false);

    setLoading(false);
    setMessage("");
    setError("");
  }

  /* =======================================================
     CHANGE MODE
     ======================================================= */

  function changeMode(nextMode) {
    resetForm();
    setMode(nextMode);
  }

  /* =======================================================
     MOBILE INPUT
     
     IMPORTANT:
     This is a normal controlled input.
     ======================================================= */

  function handleMobileChange(event) {
    const value =
      event.target.value;

    const numbersOnly =
      normalizeMobile(value);

    setMobile(numbersOnly);

    setError("");
    setMessage("");
  }

  /* =======================================================
     OTP INPUT
     ======================================================= */

  function handleOtpChange(event) {
    const value =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setOtp(value);

    setError("");
  }

  /* =======================================================
     SEND OTP
     ======================================================= */

  function sendOtp() {
    setError("");
    setMessage("");

    const cleanMobile =
      normalizeMobile(mobile);

    if (
      cleanMobile.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    const users = getUsers();

    /* CREATE ACCOUNT */

    if (mode === MODES.CREATE) {
      const exists =
        users.some(
          (user) =>
            user.mobile ===
            cleanMobile
        );

      if (exists) {
        setError(
          "An account with this mobile number already exists."
        );

        return;
      }
    }

    /* LOGIN */

    if (mode === MODES.LOGIN) {
      const exists =
        users.some(
          (user) =>
            user.mobile ===
            cleanMobile
        );

      if (!exists) {
        setError(
          "No account found with this mobile number. Please create an account first."
        );

        return;
      }
    }

    /* FORGOT PASSWORD */

    if (mode === MODES.FORGOT) {
      const exists =
        users.some(
          (user) =>
            user.mobile ===
            cleanMobile
        );

      if (!exists) {
        setError(
          "No account found with this mobile number."
        );

        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      const newOtp =
        generateOtp();

      setGeneratedOtp(newOtp);

      setOtpSent(true);

      setOtp("");

      setLoading(false);

      /*
        FRONTEND DEMO ONLY
      */

      setMessage(
        `Demo OTP: ${newOtp}`
      );
    }, 600);
  }

  /* =======================================================
     VERIFY OTP
     ======================================================= */

  function verifyOtp() {
    setError("");
    setMessage("");

    if (!otpSent) {
      setError(
        "Please request an OTP first."
      );

      return;
    }

    if (
      otp.length !== 6
    ) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    if (
      otp !== generatedOtp
    ) {
      setError(
        "Incorrect OTP. Please try again."
      );

      return;
    }

    setOtpVerified(true);

    setMessage(
      "OTP verified successfully."
    );
  }

  /* =======================================================
     CREATE ACCOUNT
     ======================================================= */

  function createAccount() {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (
      mobile.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (!otpVerified) {
      setError(
        "Please verify your OTP first."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    const users =
      getUsers();

    const exists =
      users.some(
        (user) =>
          user.mobile === mobile
      );

    if (exists) {
      setError(
        "An account with this mobile number already exists."
      );

      return;
    }

    const user = {
      id:
        `CV-${Date.now()}`,

      name:
        name.trim(),

      mobile,

      password,

      createdAt:
        new Date().toISOString(),
    };

    const updatedUsers =
      [
        ...users,
        user,
      ];

    saveUsers(
      updatedUsers
    );

    loginUser(user);
  }

  /* =======================================================
     LOGIN
     ======================================================= */

  function signIn() {
    setError("");
    setMessage("");

    if (
      mobile.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (!otpVerified) {
      setError(
        "Please verify your OTP first."
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );

      return;
    }

    const users =
      getUsers();

    const user =
      users.find(
        (item) =>
          item.mobile ===
          mobile
      );

    if (!user) {
      setError(
        "Account not found."
      );

      return;
    }

    if (
      user.password !==
      password
    ) {
      setError(
        "Incorrect password."
      );

      return;
    }

    loginUser(user);
  }

  /* =======================================================
     LOGIN USER
     ======================================================= */

  function loginUser(user) {
    const safeUser = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
    };

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(
        safeUser
      )
    );

    setCurrentUser(
      safeUser
    );

    resetForm();

    setMode(
      MODES.DASHBOARD
    );
  }

  /* =======================================================
     RESET PASSWORD
     ======================================================= */

  function resetPassword() {
    setError("");
    setMessage("");

    if (
      mobile.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (!otpVerified) {
      setError(
        "Please verify your OTP first."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    const users =
      getUsers();

    const updatedUsers =
      users.map(
        (user) =>
          user.mobile ===
          mobile
            ? {
                ...user,
                password,
              }
            : user
      );

    saveUsers(
      updatedUsers
    );

    const updatedUser =
      updatedUsers.find(
        (user) =>
          user.mobile ===
          mobile
      );

    setMessage(
      "Password reset successfully."
    );

    setTimeout(() => {
      loginUser(
        updatedUser
      );
    }, 700);
  }

  /* =======================================================
     LOGOUT
     ======================================================= */

  function logout() {
    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    setCurrentUser(null);

    resetForm();

    setMode(
      MODES.LOGIN
    );
  }

  /* =======================================================
     DASHBOARD
     ======================================================= */

  if (
    mode === MODES.DASHBOARD &&
    currentUser
  ) {
    return (
      <CivicDashboardApp
        user={currentUser}
        onLogout={logout}
      />
    );
  }

  /* =======================================================
     AUTH PAGE
     ======================================================= */

  const isCreate =
    mode === MODES.CREATE;

  const isForgot =
    mode === MODES.FORGOT;

  const title = isCreate
    ? "Create your account"
    : isForgot
    ? "Reset your password"
    : "Welcome back";

  const subtitle = isCreate
    ? "Join CivicVision and help make your city better."
    : isForgot
    ? "Reset your CivicVision account password."
    : "Sign in to continue to your citizen dashboard.";

  return (
    <div className="auth-page">

      {/* ===================================================
          LEFT BRAND SECTION
          =================================================== */}

      <section className="auth-brand">

        <div className="auth-brand-inner">

          <div className="brand-logo">

            <div className="brand-logo-icon">
              <span>◒</span>
            </div>

            <div>

              <div className="brand-name">
                Civic<span>Vision</span>
              </div>

              <div className="brand-tagline">
                AI-POWERED SMART CITY ISSUE MANAGEMENT
              </div>

            </div>

          </div>

          <div className="brand-kicker">
            ✨ SMART CITY INTELLIGENCE
          </div>

          <h1>
            Cleaner Streets.
            <br />
            Safer Roads.
            <br />
            Smarter Cities.
          </h1>

          <p className="brand-description">
            One platform to report, detect,
            verify and resolve civic issues
            with AI-powered intelligence.
          </p>

          <div className="brand-features">

            <div className="brand-feature">

              <div className="brand-feature-icon">
                ⌖
              </div>

              <div>
                <strong>
                  Real-time reporting
                </strong>

                <span>
                  Report civic issues with GPS and photos.
                </span>
              </div>

            </div>

            <div className="brand-feature">

              <div className="brand-feature-icon">
                ♢
              </div>

              <div>
                <strong>
                  AI-powered verification
                </strong>

                <span>
                  Detect issues, severity and duplicate reports.
                </span>
              </div>

            </div>

            <div className="brand-feature">

              <div className="brand-feature-icon">
                ◒
              </div>

              <div>
                <strong>
                  Community impact
                </strong>

                <span>
                  Help create cleaner and safer neighborhoods.
                </span>
              </div>

            </div>

          </div>

          <div className="brand-footer">
            CivicVision — A Cleaner, Safer, Smarter Tomorrow
          </div>

        </div>

      </section>

      {/* ===================================================
          RIGHT AUTH SECTION
          =================================================== */}

      <section className="auth-panel">

        <div className="auth-card">

          <div className="auth-icon">
            📱
          </div>

          <div className="auth-mini-brand">
            ✨ CIVICVISION
          </div>

          <h2>
            {title}
          </h2>

          <p className="auth-subtitle">
            {subtitle}
          </p>

          {/* ===============================================
              CREATE ACCOUNT NAME
              =============================================== */}

          {isCreate && (

            <div className="auth-field">

              <label>
                FULL NAME
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter your full name"
                autoComplete="name"
              />

            </div>

          )}

          {/* ===============================================
              MOBILE NUMBER
              =============================================== */}

          <div className="auth-field">

            <label>
              MOBILE NUMBER
            </label>

            <div className="mobile-input-wrapper">

              <span className="mobile-prefix">
                +91
              </span>

              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={mobile}
                onChange={
                  handleMobileChange
                }
                placeholder="Enter mobile number"
                autoComplete="tel"
                aria-label="Mobile number"
              />

            </div>

          </div>

          {/* ===============================================
              SEND OTP
              =============================================== */}

          {!otpVerified && (

            <button
              type="button"
              className="auth-primary-button"
              onClick={
                sendOtp
              }
              disabled={
                loading ||
                mobile.length !== 10
              }
            >

              {loading
                ? "Sending OTP..."
                : "Send OTP →"}

            </button>

          )}

          {/* ===============================================
              OTP
              =============================================== */}

          {otpSent &&
            !otpVerified && (

              <div className="otp-section">

                <div className="auth-field">

                  <label>
                    ENTER OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={
                      handleOtpChange
                    }
                    placeholder="Enter 6-digit OTP"
                    autoComplete="one-time-code"
                  />

                </div>

                <button
                  type="button"
                  className="auth-primary-button"
                  onClick={
                    verifyOtp
                  }
                  disabled={
                    otp.length !== 6
                  }
                >
                  Verify OTP
                </button>

              </div>

            )}

          {/* ===============================================
              PASSWORD
              =============================================== */}

          {otpVerified && (

            <>

              <div className="verified-message">
                ✓ Mobile number verified
              </div>

              <div className="auth-field">

                <label>
                  {isForgot
                    ? "NEW PASSWORD"
                    : "PASSWORD"}
                </label>

                <input
                  type="password"
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder={
                    isForgot
                      ? "Enter new password"
                      : "Enter password"
                  }
                  autoComplete={
                    isForgot
                      ? "new-password"
                      : "current-password"
                  }
                />

              </div>

              {(isCreate ||
                isForgot) && (

                <div className="auth-field">

                  <label>
                    CONFIRM PASSWORD
                  </label>

                  <input
                    type="password"
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event
                    ) => {
                      setConfirmPassword(
                        event.target.value
                      );

                      setError("");
                    }}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />

                </div>

              )}

              <button
                type="button"
                className="auth-primary-button"
                onClick={
                  isCreate
                    ? createAccount
                    : isForgot
                    ? resetPassword
                    : signIn
                }
              >
                {isCreate
                  ? "Create Account →"
                  : isForgot
                  ? "Reset Password →"
                  : "Sign In →"}
              </button>

            </>

          )}

          {/* ===============================================
              ERROR
              =============================================== */}

          {error && (

            <div className="auth-error">
              ⚠ {error}
            </div>

          )}

          {/* ===============================================
              SUCCESS / OTP MESSAGE
              =============================================== */}

          {message && (

            <div className="auth-success">
              ✓ {message}
            </div>

          )}

          {/* ===============================================
              LINKS
              =============================================== */}

          {!isCreate &&
            !isForgot && (

              <div className="auth-links">

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      MODES.CREATE
                    )
                  }
                >
                  Create new account
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      MODES.FORGOT
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>

            )}

          {isCreate && (

            <div className="auth-links">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  changeMode(
                    MODES.LOGIN
                  )
                }
              >
                Sign in
              </button>

            </div>

          )}

          {isForgot && (

            <div className="auth-links">

              <span>
                Remember your password?
              </span>

              <button
                type="button"
                onClick={() =>
                  changeMode(
                    MODES.LOGIN
                  )
                }
              >
                Back to sign in
              </button>

            </div>

          )}

          {/* ===============================================
              SECURITY
              =============================================== */}

          <div className="auth-security">
            ♢ Secure authentication • OTP verified • Password protected
          </div>

        </div>

      </section>

    </div>
  );
}

export default App;