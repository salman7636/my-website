import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  LockKeyhole,
  Smartphone,
  Sparkles,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import BrandSide from "./components/BrandSide";
import InputField from "./components/InputField";
import PasswordInput from "./components/PasswordInput";
import CivicDashboardApp from "./civic-dashboard/CivicDashboardApp";

const MODES = {
  LOGIN: "login",
  CREATE: "create",
  FORGOT: "forgot",
  DASHBOARD: "dashboard",
};

function App() {
  /*
    IMPORTANT:
    If a user is already logged in, keep the dashboard open
    even after browser refresh.
  */
  const [mode, setMode] = useState(() => {
    try {
      const currentUser = localStorage.getItem(
        "civicvision_current_user"
      );

      return currentUser
        ? MODES.DASHBOARD
        : MODES.LOGIN;
    } catch {
      return MODES.LOGIN;
    }
  });

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isCreate = mode === MODES.CREATE;
  const isForgot = mode === MODES.FORGOT;

  // --------------------------------------------------
  // RESET AUTH STATE
  // --------------------------------------------------

  function resetState() {
    setMobile("");
    setName("");
    setOtp("");
    setDevOtp("");
    setPassword("");
    setNewPassword("");

    setOtpSent(false);
    setVerified(false);

    setShowPassword(false);

    setMessage("");
    setError("");
  }

  function changeMode(nextMode) {
    resetState();
    setMode(nextMode);
  }

  // --------------------------------------------------
  // MOBILE NUMBER
  // --------------------------------------------------

  function cleanMobile(value) {
    return value
      .replace(/[^\d+]/g, "")
      .slice(0, 15);
  }

  // --------------------------------------------------
  // SEND OTP
  // --------------------------------------------------

  function sendOtp() {
    setError("");
    setMessage("");

    if (
      isCreate &&
      name.trim().length < 2
    ) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (
      mobile.replace(/\D/g, "").length < 10
    ) {
      setError(
        "Please enter a valid mobile number."
      );

      return;
    }

    /*
      FRONTEND DEVELOPMENT OTP

      Later this can become:

      React
        ↓
      FastAPI
        ↓
      SMS Provider
        ↓
      Mobile
    */

    const generatedOtp = String(
      Math.floor(
        100000 +
        Math.random() * 900000
      )
    );

    setDevOtp(generatedOtp);
    setOtpSent(true);

    setMessage(
      "OTP sent successfully. Use the development OTP shown below."
    );
  }

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  function verifyOtp() {
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

    if (otp !== devOtp) {
      setError(
        "Incorrect OTP. Please try again."
      );

      return;
    }

    setVerified(true);

    setMessage(
      "Mobile number verified successfully."
    );
  }

  // --------------------------------------------------
  // CREATE ACCOUNT
  // --------------------------------------------------

  function createAccount() {
    setError("");
    setMessage("");

    if (!verified) {
      setError(
        "Please verify your mobile number first."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem(
          "civicvision_users"
        ) || "[]"
      );
    } catch {
      users = [];
    }

    // DUPLICATE MOBILE CHECK

    const existingUser = users.find(
      (user) =>
        user.mobile === mobile
    );

    if (existingUser) {
      setError(
        "An account already exists with this mobile number. Please sign in."
      );

      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      mobile: mobile,
      password: password,
    };

    users.push(newUser);

    localStorage.setItem(
      "civicvision_users",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "civicvision_current_user",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        mobile: newUser.mobile,
      })
    );

    setMode(MODES.DASHBOARD);
  }

  // --------------------------------------------------
  // SIGN IN
  // --------------------------------------------------

  function signIn() {
    setError("");
    setMessage("");

    if (!verified) {
      setError(
        "Please verify your mobile number first."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Please enter your password."
      );

      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem(
          "civicvision_users"
        ) || "[]"
      );
    } catch {
      users = [];
    }

    const user = users.find(
      (item) =>
        item.mobile === mobile &&
        item.password === password
    );

    if (!user) {
      setError(
        "Invalid mobile number or password."
      );

      return;
    }

    localStorage.setItem(
      "civicvision_current_user",
      JSON.stringify({
        id: user.id,
        name: user.name,
        mobile: user.mobile,
      })
    );

    setMode(MODES.DASHBOARD);
  }

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  function resetPassword() {
    setError("");
    setMessage("");

    if (!verified) {
      setError(
        "Please verify your mobile number first."
      );

      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must contain at least 8 characters."
      );

      return;
    }

    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem(
          "civicvision_users"
        ) || "[]"
      );
    } catch {
      users = [];
    }

    const index = users.findIndex(
      (user) =>
        user.mobile === mobile
    );

    if (index === -1) {
      setError(
        "No account found with this mobile number."
      );

      return;
    }

    users[index].password =
      newPassword;

    localStorage.setItem(
      "civicvision_users",
      JSON.stringify(users)
    );

    setMessage(
      "Password reset successfully. You can now sign in."
    );

    setTimeout(() => {
      changeMode(MODES.LOGIN);
    }, 1000);
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  function logout() {
    /*
      Remove only the active login session.

      IMPORTANT:
      We DO NOT remove:
      - civicvision_users
      - cv_reports
      - cv_points

      Therefore the user's data remains available
      when they log in again.
    */

    localStorage.removeItem(
      "civicvision_current_user"
    );

    resetState();

    setMode(MODES.LOGIN);
  }

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  if (mode === MODES.DASHBOARD) {
    let currentUser = {};

    try {
      currentUser = JSON.parse(
        localStorage.getItem(
          "civicvision_current_user"
        ) || "{}"
      );
    } catch {
      currentUser = {};
    }

    /*
      Safety check:
      If somehow the session was removed,
      return to login.
    */

    if (!currentUser?.id) {
      return null;
    }

    return (
      <CivicDashboardApp
        user={currentUser}
        onLogout={logout}
      />
    );
  }

  // --------------------------------------------------
  // AUTHENTICATION PAGE
  // --------------------------------------------------

  return (
    <div className="auth-page">

      <BrandSide />

      <main className="auth-side">

        <div className="auth-card">

          {/* MOBILE BRAND */}

          <div className="mobile-brand">

            <div className="mobile-logo">
              <span>Civic</span>
            </div>

            <div>

              <div className="mobile-brand-name">
                Civic
                <span>Vision</span>
              </div>

              <div className="mobile-brand-subtitle">
                AI-POWERED SMART CITY
              </div>

            </div>

          </div>

          {/* BACK BUTTON */}

          {mode !== MODES.LOGIN && (
            <button
              className="back-button"
              onClick={() =>
                changeMode(
                  MODES.LOGIN
                )
              }
            >
              <ChevronLeft size={17} />
              Back
            </button>
          )}

          {/* HEADING */}

          <div className="auth-heading">

            <div className="heading-icon">

              {isCreate ? (
                <UserRound />
              ) : isForgot ? (
                <LockKeyhole />
              ) : (
                <Smartphone />
              )}

            </div>

            <div className="eyebrow">

              <Sparkles size={14} />

              CIVICVISION

            </div>

            <h1>
              {isCreate
                ? "Create your account"
                : isForgot
                ? "Reset your password"
                : "Welcome back"}
            </h1>

            <p>
              {isCreate
                ? "Join CivicVision and help make your city better."
                : isForgot
                ? "Verify your mobile number to reset your password."
                : "Sign in to continue to your citizen dashboard."}
            </p>

          </div>

          {/* CREATE NAME */}

          {isCreate && (
            <InputField
              label="Full Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your full name"
              icon={<UserRound size={18} />}
            />
          )}

          {/* MOBILE */}

          <InputField
            label="Mobile Number"
            value={mobile}
            onChange={(event) =>
              setMobile(
                cleanMobile(
                  event.target.value
                )
              )
            }
            placeholder="Enter mobile number"
            icon={<Smartphone size={18} />}
          />

          {/* OTP */}

          {!verified && (
            <>

              <button
                className="primary-button"
                onClick={
                  otpSent
                    ? verifyOtp
                    : sendOtp
                }
              >

                {otpSent
                  ? "Verify OTP"
                  : "Send OTP"}

                <ArrowRight size={18} />

              </button>

              {otpSent && (
                <>

                  <div className="dev-otp">

                    <span>
                      Development OTP
                    </span>

                    <strong>
                      {devOtp}
                    </strong>

                  </div>

                  <InputField
                    label="Enter OTP"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    icon={
                      <ShieldCheck
                        size={18}
                      />
                    }
                  />

                  <button
                    className="text-button"
                    onClick={sendOtp}
                  >
                    Resend OTP
                  </button>

                </>
              )}

            </>
          )}

          {/* VERIFIED */}

          {verified && (
            <div className="verified-box">

              <CheckCircle2 size={19} />

              <span>
                Mobile number verified
              </span>

            </div>
          )}

          {/* PASSWORD */}

          {!isForgot && verified && (
            <PasswordInput
              label="Password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              showPassword={showPassword}
              setShowPassword={
                setShowPassword
              }
            />
          )}

          {/* FORGOT PASSWORD */}

          {isForgot && verified && (
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              placeholder="Create a new password"
              showPassword={showPassword}
              setShowPassword={
                setShowPassword
              }
            />
          )}

          {/* ACTION BUTTON */}

          {verified && (
            <button
              className="primary-button"
              onClick={
                isCreate
                  ? createAccount
                  : isForgot
                  ? resetPassword
                  : signIn
              }
            >

              {isCreate
                ? "Create Account"
                : isForgot
                ? "Reset Password"
                : "Sign In"}

              <ArrowRight size={18} />

            </button>
          )}

          {/* MESSAGE */}

          {message && (
            <div className="success-message">

              <CheckCircle2
                size={17}
              />

              {message}

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="error-message">

              {error}

            </div>
          )}

          {/* LOGIN LINKS */}

          {mode === MODES.LOGIN && (
            <div className="login-links">

              <button
                onClick={() =>
                  changeMode(
                    MODES.CREATE
                  )
                }
              >
                Create new account
              </button>

              <button
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

          {/* CREATE LINK */}

          {isCreate && (
            <div className="bottom-link">

              Already have an account?

              <button
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

          {/* FORGOT LINK */}

          {isForgot && (
            <div className="bottom-link">

              Remember your password?

              <button
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

          {/* SECURITY */}

          <div className="security-note">

            <ShieldCheck size={15} />

            Secure authentication • OTP verified • Password protected

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;