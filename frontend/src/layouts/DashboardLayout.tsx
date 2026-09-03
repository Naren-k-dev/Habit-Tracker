import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  // ==========================================
  // OPEN SIDEBAR
  // ==========================================

  function openSidebar() {
    setSidebarOpen(true);
  }


  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================

  function closeSidebar() {
    setSidebarOpen(false);
  }


  // ==========================================
  // PREVENT BODY SCROLL
  // ==========================================

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);


  return (
    <div className="app-shell">

      {/* ======================================
          MOBILE TOP BAR
      ====================================== */}

      <header className="mobile-topbar">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={openSidebar}
          aria-label="Open navigation"
          aria-expanded={sidebarOpen}
        >
          ☰
        </button>


        <div className="mobile-brand">

          <div className="mobile-logo-mark">
            H
          </div>

          <div>
            <strong>
              HabitFlow
            </strong>

            <span>
              Build your consistency
            </span>
          </div>

        </div>

      </header>


      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation"
        />
      )}


      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />


      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;