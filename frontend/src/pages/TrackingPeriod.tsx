function TrackingPeriod() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">TRACKING PERIOD</p>
          <h2>Winter Arc</h2>
          <p className="page-subtitle">
            September 1 — December 31, 2026
          </p>
        </div>

        <button className="secondary-button">
          Edit Period
        </button>
      </header>

      <div className="empty-panel">
        <div className="empty-icon">◷</div>
        <h3>Winter Arc</h3>
        <p>
          3 active habits · 122 day tracking period
        </p>
      </div>
    </div>
  );
}

export default TrackingPeriod;