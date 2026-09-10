import {
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function BrandSide() {
  return (
    <aside className="brand-side">

      <div className="brand-header">

        <div className="brand-logo">
          <Leaf size={23} />
        </div>

        <div>
          <div className="brand-name">
            Civic<span>Vision</span>
          </div>

          <div className="brand-subtitle">
            AI-POWERED SMART CITY ISSUE MANAGEMENT
          </div>
        </div>

      </div>

      <div className="brand-main">

        <div className="brand-eyebrow">
          <Sparkles size={15} />
          SMART CITY INTELLIGENCE
        </div>

        <h2>
          Cleaner Streets.
          <br />
          Safer Roads.
          <br />
          Smarter Cities.
        </h2>

        <p>
          One platform to report, detect, verify and
          resolve civic issues with AI-powered intelligence.
        </p>

        <div className="brand-features">

          <Feature
            icon={<MapPin />}
            title="Real-time reporting"
            text="Report civic issues with GPS and photos."
          />

          <Feature
            icon={<ShieldCheck />}
            title="AI-powered verification"
            text="Detect issues, severity and duplicate reports."
          />

          <Feature
            icon={<Leaf />}
            title="Community impact"
            text="Help create cleaner and safer neighborhoods."
          />

        </div>

      </div>

      <div className="brand-bottom">
        CivicVision — A Cleaner, Safer, Smarter Tomorrow
      </div>

    </aside>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

    </div>
  );
}

export default BrandSide;