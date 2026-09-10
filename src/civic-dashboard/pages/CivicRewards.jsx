import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Medal,
  Smartphone,
  WalletCards,
} from "lucide-react";

import { useState } from "react";

function CivicRewards({
  points = 0,
  onNavigate,
}) {
  const [showRedeem, setShowRedeem] =
    useState(false);

  const [selectedPoints, setSelectedPoints] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [paymentValue, setPaymentValue] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const redemptionOptions = [
    {
      points: 1000,
      value: 10,
    },
    {
      points: 2000,
      value: 20,
    },
    {
      points: 3000,
      value: 3,
    },
    {
      points: 10000,
      value: 10,
    },
  ];

  function openRedeem() {
    setShowRedeem(true);
    setSelectedPoints(null);
    setPaymentMethod("");
    setPaymentValue("");
    setSubmitted(false);
  }

  function closeRedeem() {
    setShowRedeem(false);
    setSelectedPoints(null);
    setPaymentMethod("");
    setPaymentValue("");
    setSubmitted(false);
  }

  function handleSubmit() {
    if (
      !selectedPoints ||
      !paymentMethod ||
      !paymentValue.trim()
    ) {
      return;
    }

    const currentPoints =
      Number(
        localStorage.getItem(
          "civicvision_points"
        )
      ) || points;

    if (
      currentPoints <
      selectedPoints.points
    ) {
      return;
    }

    /*
     * Calculate remaining points.
     */

    const remainingPoints =
      currentPoints -
      selectedPoints.points;

    /*
     * Save remaining points permanently.
     */

    localStorage.setItem(
      "civicvision_points",
      String(remainingPoints)
    );

    /*
     * Save redemption request.
     */

    const redemption = {
      id: `RED-${Date.now()}`,

      points:
        selectedPoints.points,

      value:
        selectedPoints.value,

      method:
        paymentMethod,

      destination:
        paymentValue.trim(),

      status: "Processing",

      createdAt:
        new Date().toLocaleString(),
    };

    localStorage.setItem(
      "civicvision_last_redemption",
      JSON.stringify(redemption)
    );

    /*
     * Show success message first.
     */

    setSubmitted(true);

    /*
     * Refresh after 1.8 seconds.
     * The points will remain reduced
     * because they were saved above.
     */

    setTimeout(() => {
      window.location.reload();
    }, 1800);
  }

  /*
   * =========================================================
   * REDEMPTION PORTAL
   * =========================================================
   */

  if (showRedeem) {
    return (
      <div className="civic-redeem-page">

        <div className="redeem-header">

          <button
            className="redeem-back-button"
            onClick={closeRedeem}
          >
            <ArrowLeft size={16} />
            Back to Civic Points
          </button>

          <span className="rewards-eyebrow">
            CIVICVISION REDEMPTION
          </span>

          <h1>
            Redeem Civic Points
          </h1>

          <p>
            Convert your earned Civic Points
            into a payout.
          </p>

        </div>

        {/* SUCCESS SCREEN */}

        {submitted ? (

          <section className="redeem-success-card">

            <div className="redeem-success-icon">
              <CheckCircle2 size={35} />
            </div>

            <span className="rewards-eyebrow">
              REQUEST SUBMITTED
            </span>

            <h2>
              Redemption request received
            </h2>

            <p>
              Your redemption request has
              been submitted successfully.
              The payout will be processed
              to your selected account.
            </p>

            <div className="redeem-success-summary">

              <div>
                <span>
                  Civic Points
                </span>

                <strong>
                  {selectedPoints.points.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>
                  Redemption Value
                </span>

                <strong>
                  ₹{selectedPoints.value}
                </strong>
              </div>

              <div>
                <span>
                  Method
                </span>

                <strong>
                  {paymentMethod === "bank"
                    ? "Bank Transfer"
                    : "UPI"}
                </strong>
              </div>

            </div>

            <p className="redeem-refresh-note">
              Updating your Civic Points...
            </p>

          </section>

        ) : (

          <>

            {/* AVAILABLE POINTS */}

            <section className="redeem-balance-card">

              <div className="redeem-balance-icon">
                <Medal size={24} />
              </div>

              <div>

                <span>
                  AVAILABLE CIVIC POINTS
                </span>

                <strong>
                  {points.toLocaleString()}
                </strong>

              </div>

              <div className="redeem-balance-note">

                Minimum redemption:
                <strong>
                  {" "}1,000 points
                </strong>

              </div>

            </section>

            {/* STEP 1 */}

            <section className="redeem-section">

              <div className="redeem-section-heading">

                <div className="redeem-step">
                  01
                </div>

                <div>

                  <span>
                    REDEMPTION AMOUNT
                  </span>

                  <h2>
                    Select Civic Points
                  </h2>

                  <p>
                    Choose how many Civic Points
                    you want to redeem.
                  </p>

                </div>

              </div>

              <div className="redeem-options-grid">

                {redemptionOptions.map(
                  (option) => {

                    const selected =
                      selectedPoints?.points ===
                      option.points;

                    const insufficient =
                      points < option.points;

                    return (
                      <button
                        key={option.points}
                        className={`redeem-option ${
                          selected
                            ? "selected"
                            : ""
                        } ${
                          insufficient
                            ? "insufficient"
                            : ""
                        }`}
                        disabled={
                          insufficient
                        }
                        onClick={() =>
                          setSelectedPoints(
                            option
                          )
                        }
                      >

                        <div className="redeem-option-icon">
                          <IndianRupee
                            size={19}
                          />
                        </div>

                        <div className="redeem-option-info">

                          <strong>
                            {option.points.toLocaleString()}
                            {" "}
                            Points
                          </strong>

                          <span>
                            Redeem for ₹
                            {option.value}
                          </span>

                          {insufficient && (
                            <small>
                              Not enough points
                            </small>
                          )}

                        </div>

                        {selected && (
                          <CheckCircle2
                            size={19}
                            className="redeem-selected-icon"
                          />
                        )}

                      </button>
                    );
                  }
                )}

              </div>

            </section>

            {/* STEP 2 */}

            {selectedPoints && (

              <section className="redeem-section">

                <div className="redeem-section-heading">

                  <div className="redeem-step">
                    02
                  </div>

                  <div>

                    <span>
                      PAYOUT METHOD
                    </span>

                    <h2>
                      Where should we send it?
                    </h2>

                    <p>
                      Choose your preferred
                      payout destination.
                    </p>

                  </div>

                </div>

                <div className="payout-method-grid">

                  <button
                    className={`payout-method ${
                      paymentMethod === "bank"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setPaymentMethod(
                        "bank"
                      );

                      setPaymentValue("");
                    }}
                  >

                    <div className="payout-icon">
                      <Building2 size={22} />
                    </div>

                    <div>

                      <strong>
                        Bank Transfer
                      </strong>

                      <span>
                        Direct transfer to
                        your bank account.
                      </span>

                    </div>

                    {paymentMethod ===
                      "bank" && (
                      <CheckCircle2
                        size={18}
                        className="payout-check"
                      />
                    )}

                  </button>

                  <button
                    className={`payout-method ${
                      paymentMethod === "upi"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setPaymentMethod(
                        "upi"
                      );

                      setPaymentValue("");
                    }}
                  >

                    <div className="payout-icon">
                      <Smartphone size={22} />
                    </div>

                    <div>

                      <strong>
                        UPI ID
                      </strong>

                      <span>
                        Receive directly
                        through your UPI.
                      </span>

                    </div>

                    {paymentMethod ===
                      "upi" && (
                      <CheckCircle2
                        size={18}
                        className="payout-check"
                      />
                    )}

                  </button>

                </div>

              </section>

            )}

            {/* STEP 3 */}

            {paymentMethod && (

              <section className="redeem-section">

                <div className="redeem-section-heading">

                  <div className="redeem-step">
                    03
                  </div>

                  <div>

                    <span>
                      PAYOUT DETAILS
                    </span>

                    <h2>
                      Enter your details
                    </h2>

                    <p>
                      Enter the destination
                      account for your payout.
                    </p>

                  </div>

                </div>

                <div className="payout-input-card">

                  {paymentMethod ===
                    "bank" ? (

                    <>
                      <label>
                        BANK ACCOUNT NUMBER
                      </label>

                      <div className="payout-input-wrapper">

                        <CreditCard
                          size={17}
                        />

                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter bank account number"
                          value={paymentValue}
                          onChange={(event) =>
                            setPaymentValue(
                              event.target.value
                            )
                          }
                        />

                      </div>
                    </>

                  ) : (

                    <>
                      <label>
                        UPI ID
                      </label>

                      <div className="payout-input-wrapper">

                        <WalletCards
                          size={17}
                        />

                        <input
                          type="text"
                          placeholder="example@upi"
                          value={paymentValue}
                          onChange={(event) =>
                            setPaymentValue(
                              event.target.value
                            )
                          }
                        />

                      </div>
                    </>

                  )}

                </div>

              </section>

            )}

            {/* SUMMARY */}

            {selectedPoints &&
              paymentMethod && (

                <section className="redeem-summary-card">

                  <div>

                    <span>
                      REDEMPTION SUMMARY
                    </span>

                    <h2>
                      {selectedPoints.points.toLocaleString()}
                      {" "}
                      Civic Points
                    </h2>

                    <p>
                      Payout value:
                      {" "}
                      <strong>
                        ₹{selectedPoints.value}
                      </strong>
                    </p>

                  </div>

                  <button
                    className="redeem-primary-button"
                    disabled={
                      !paymentValue.trim()
                    }
                    onClick={
                      handleSubmit
                    }
                  >
                    Redeem Now
                    <ArrowRight size={16} />
                  </button>

                </section>

              )}

          </>

        )}

      </div>
    );
  }

  /*
   * =========================================================
   * CIVIC POINTS MAIN PAGE
   * =========================================================
   */

  return (
    <div className="civic-rewards-page">

      {/* HEADER */}

      <div className="rewards-page-header">

        <div>

          <span className="rewards-eyebrow">
            CIVIC CONTRIBUTION
          </span>

          <h1>
            Civic Points
          </h1>

          <p>
            Earn points by making meaningful
            contributions to your city.
          </p>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="rewards-summary-grid">

        <div className="rewards-total-card">

          <div className="rewards-total-icon">
            <Medal size={27} />
          </div>

          <div>

            <span>
              TOTAL CIVIC POINTS
            </span>

            <strong>
              {points.toLocaleString()}
            </strong>

            <small>
              Your contribution score
            </small>

          </div>

        </div>

        <div className="rewards-info-card">

          <div className="rewards-info-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>

            <span>
              REDEMPTION STARTS AT
            </span>

            <strong>
              1,000 Points
            </strong>

          </div>

        </div>

        <div className="rewards-info-card">

          <div className="rewards-info-icon">
            <IndianRupee size={19} />
          </div>

          <div>

            <span>
              STARTING VALUE
            </span>

            <strong>
              ₹10
            </strong>

          </div>

        </div>

      </div>

      {/* REDEEM */}

      <section className="redeem-cta-card">

        <div className="redeem-cta-icon">
          <WalletCards size={25} />
        </div>

        <div className="redeem-cta-content">

          <span>
            POINTS REDEMPTION
          </span>

          <h2>
            Redeem your Civic Points
          </h2>

          <p>
            Convert your Civic Points into
            a payout through Bank Transfer
            or UPI.
          </p>

        </div>

        <button
          className="redeem-open-button"
          onClick={openRedeem}
          disabled={points < 1000}
        >
          Redeem Points
          <ArrowRight size={16} />
        </button>

      </section>

      {/* HOW IT WORKS */}

      <section className="rewards-panel">

        <div className="rewards-panel-header">

          <div>

            <span className="rewards-eyebrow">
              CIVICVISION REWARDS
            </span>

            <h2>
              How Civic Points work
            </h2>

          </div>

        </div>

        <div className="rewards-flow">

          <div className="reward-flow-card">

            <div className="reward-flow-icon">
              <Medal size={20} />
            </div>

            <strong>
              Report a clean bin
            </strong>

            <span>
              Submit a clear image of a
              garbage bin that is empty
              or available.
            </span>

            <b>
              +30 Civic Points
            </b>

          </div>

          <div className="reward-flow-card">

            <div className="reward-flow-icon">
              <CheckCircle2 size={20} />
            </div>

            <strong>
              AI verification
            </strong>

            <span>
              CivicVision analyzes the
              submitted evidence before
              awarding points.
            </span>

            <b>
              AI Verified
            </b>

          </div>

          <div className="reward-flow-card">

            <div className="reward-flow-icon">
              <WalletCards size={20} />
            </div>

            <strong>
              Redeem your points
            </strong>

            <span>
              Convert available points
              through Bank Transfer or UPI.
            </span>

            <b>
              Redeem from 1,000
            </b>

          </div>

        </div>

      </section>

      {/* REDEMPTION OPTIONS */}

      <section className="rewards-panel">

        <div className="rewards-panel-header">

          <div>

            <span className="rewards-eyebrow">
              REDEMPTION OPTIONS
            </span>

            <h2>
              Available payout bundles
            </h2>

          </div>

        </div>

        <div className="redemption-table">

          {redemptionOptions.map(
            (option) => (

              <div
                className="redemption-table-row"
                key={option.points}
              >

                <span>
                  {option.points.toLocaleString()}
                  {" "}
                  Civic Points
                </span>

                <strong>
                  ₹{option.value}
                </strong>

              </div>

            )
          )}

        </div>

      </section>

      {/* INFO */}

      <div className="rewards-info-banner">

        <CheckCircle2 size={19} />

        <div>

          <strong>
            Only verified Civic Points
            can be redeemed
          </strong>

          <p>
            Points are awarded only when
            CivicVision verifies an eligible
            clean-bin contribution.
          </p>

        </div>

      </div>

    </div>
  );
}

export default CivicRewards;