import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logout,
  type CurrentUser,
} from "../services/authService";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

  const navigate = useNavigate();

  const [user, setUser] =
    useState<CurrentUser | null>(null);


  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  useEffect(() => {

    async function loadUser() {

      try {

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

      } catch {

        logout();

        navigate("/login", {
          replace: true,
        });

      }

    }

    loadUser();

  }, [navigate]);


  // ==========================================
  // HANDLE LOGOUT
  // ==========================================

  function handleLogout() {

    onClose();

    logout();

    navigate("/login", {
      replace: true,
    });

  }


  // ==========================================
  // CLOSE SIDEBAR WHEN NAVIGATION ITEM
  // IS CLICKED
  // ==========================================

  function handleNavigation() {
    onClose();
  }


  // ==========================================
  // USER DISPLAY
  // ==========================================

  const displayName =
    user?.name ?? "User";

  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase();


  return (

    <aside
      className={`sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* ======================================
          LOGO
          ====================================== */}

      <div className="sidebar-logo">

        <div className="logo-mark">
          H
        </div>

        <div>

          <h1>
            HabitFlow
          </h1>

          <span>
            Build your consistency
          </span>

        </div>

      </div>


      {/* ======================================
          MOBILE CLOSE BUTTON
          ====================================== */}

      <button
        type="button"
        className="sidebar-close-button"
        onClick={onClose}
        aria-label="Close navigation"
      >
        ×
      </button>


      {/* ======================================
          NAVIGATION
          ====================================== */}

      <nav className="sidebar-nav">

        <p className="nav-label">
          WORKSPACE
        </p>


        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ⌂
          </span>

          Dashboard

        </NavLink>


        {/* HABITS */}

        <NavLink
          to="/habits"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ✓
          </span>

          Habits

        </NavLink>


        {/* TASKS */}

        <NavLink
          to="/tasks"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ☑
          </span>

          Tasks

        </NavLink>


        {/* PROGRESS */}

        <NavLink
          to="/progress"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ◔
          </span>

          Progress

        </NavLink>


        {/* TRACKING PERIOD */}

        <NavLink
          to="/tracking-period"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ◷
          </span>

          Tracking Period

        </NavLink>


        {/* SYSTEM */}

        <p className="nav-label settings-label">
          SYSTEM
        </p>


        {/* SETTINGS */}

        <NavLink
          to="/settings"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `nav-item ${
              isActive ? "active" : ""
            }`
          }
        >

          <span className="nav-icon">
            ⚙
          </span>

          Settings

        </NavLink>

      </nav>


      {/* ======================================
          USER
          ====================================== */}

      <div className="sidebar-bottom">

        <div className="user-card">

          <div className="user-avatar">
            {avatarLetter}
          </div>


          <div className="user-info">

            <strong>
              {displayName}
            </strong>

            <span>
              {user?.email ?? ""}
            </span>

          </div>


          <button
            type="button"
            className="user-menu"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            ⇥
          </button>

        </div>

      </div>

    </aside>

  );

}


export default Sidebar;