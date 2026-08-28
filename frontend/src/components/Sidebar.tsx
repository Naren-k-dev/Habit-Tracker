import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">H</div>

        <div>
          <h1>HabitFlow</h1>
          <span>Build your consistency</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">WORKSPACE</p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/habits"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">✓</span>
          Habits
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◔</span>
          Progress
        </NavLink>

        <NavLink
          to="/tracking-period"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">◷</span>
          Tracking Period
        </NavLink>

        <p className="nav-label settings-label">SYSTEM</p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⚙</span>
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="user-avatar">N</div>

          <div className="user-info">
            <strong>Naren</strong>
            <span>Free account</span>
          </div>

          <span className="user-menu">•••</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;