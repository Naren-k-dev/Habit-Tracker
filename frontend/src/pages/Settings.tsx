import { useState } from "react";


type SettingsSection =
  | "profile"
  | "password"
  | "notifications"
  | "appearance"
  | "about";


function Settings() {

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const [theme, setTheme] =
    useState<"Light" | "Dark">("Light");

  const [notifications, setNotifications] =
    useState(true);


  // ==========================================
  // SECTION NAVIGATION
  // ==========================================

  function renderSection() {

    switch (activeSection) {

      case "profile":
        return (
          <ProfileSection />
        );

      case "password":
        return (
          <PasswordSection />
        );

      case "notifications":
        return (
          <NotificationsSection
            enabled={notifications}
            setEnabled={setNotifications}
          />
        );

      case "appearance":
        return (
          <AppearanceSection
            theme={theme}
            setTheme={setTheme}
          />
        );

      case "about":
        return (
          <AboutSection />
        );

      default:
        return null;
    }
  }


  return (
    <div className="page settings-page">

      {/* ======================================
          HEADER
          ====================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            SYSTEM
          </p>

          <h2>
            Settings
          </h2>

          <p className="page-subtitle">
            Manage your account and preferences.
          </p>

        </div>

      </header>


      {/* ======================================
          SETTINGS LAYOUT
          ====================================== */}

      <div className="settings-layout">

        {/* ====================================
            LEFT NAVIGATION
            ==================================== */}

        <aside className="settings-sidebar">

          <button
            className={
              activeSection === "profile"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("profile")
            }
          >
            <span className="settings-nav-icon">
              ◯
            </span>

            <span>
              Profile
            </span>
          </button>


          <button
            className={
              activeSection === "password"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("password")
            }
          >
            <span className="settings-nav-icon">
              ◈
            </span>

            <span>
              Change Password
            </span>
          </button>


          <button
            className={
              activeSection === "notifications"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("notifications")
            }
          >
            <span className="settings-nav-icon">
              ◇
            </span>

            <span>
              Notifications
            </span>
          </button>


          <button
            className={
              activeSection === "appearance"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("appearance")
            }
          >
            <span className="settings-nav-icon">
              ◐
            </span>

            <span>
              Appearance
            </span>
          </button>


          <button
            className={
              activeSection === "about"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("about")
            }
          >
            <span className="settings-nav-icon">
              ⓘ
            </span>

            <span>
              About
            </span>
          </button>

        </aside>


        {/* ====================================
            CONTENT
            ==================================== */}

        <main className="settings-content">

          {renderSection()}


          {/* ==================================
              DANGER ZONE
              ================================== */}

          <div className="settings-danger-zone">

            <div>

              <p className="settings-danger-label">
                DANGER ZONE
              </p>

              <h3>
                Log out
              </h3>

              <p>
                Log out from your account on this device.
              </p>

            </div>


            <button
              className="settings-danger-button"
              onClick={() => {
                console.log(
                  "Logout will be connected to authentication."
                );
              }}
            >
              Log out
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}


// ==========================================
// PROFILE
// ==========================================

function ProfileSection() {

  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div>

          <p className="eyebrow">
            PROFILE
          </p>

          <h3>
            Profile Information
          </h3>

          <p>
            Manage the information associated
            with your account.
          </p>

        </div>


        <button
          className="secondary-button"
          onClick={() => {
            console.log(
              "Profile editing will be connected to the user API."
            );
          }}
        >
          Edit Profile
        </button>

      </div>


      <div className="settings-profile-card">

        <div className="settings-avatar">
          N
        </div>


        <div className="settings-profile-info">

          <div className="settings-profile-field">

            <span>
              NAME
            </span>

            <strong>
              Naren
            </strong>

          </div>


          <div className="settings-profile-field">

            <span>
              EMAIL
            </span>

            <strong>
              naren@example.com
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
}


// ==========================================
// PASSWORD
// ==========================================

function PasswordSection() {

  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div>

          <p className="eyebrow">
            SECURITY
          </p>

          <h3>
            Change Password
          </h3>

          <p>
            Update your account password.
          </p>

        </div>

      </div>


      <div className="settings-form">

        <div className="settings-form-group">

          <label>
            Current password
          </label>

          <input
            type="password"
            placeholder="Enter current password"
          />

        </div>


        <div className="settings-form-group">

          <label>
            New password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
          />

        </div>


        <div className="settings-form-group">

          <label>
            Confirm new password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
          />

        </div>


        <div className="settings-form-actions">

          <button
            className="primary-button"
            onClick={() => {
              console.log(
                "Password change will be connected to authentication."
              );
            }}
          >
            Update Password
          </button>

        </div>

      </div>

    </section>
  );
}


// ==========================================
// NOTIFICATIONS
// ==========================================

interface NotificationsSectionProps {
  enabled: boolean;
  setEnabled: (
    value: boolean
  ) => void;
}


function NotificationsSection({
  enabled,
  setEnabled,
}: NotificationsSectionProps) {

  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div>

          <p className="eyebrow">
            PREFERENCES
          </p>

          <h3>
            Notifications
          </h3>

          <p>
            Control how HabitFlow keeps you informed.
          </p>

        </div>

      </div>


      <div className="settings-option">

        <div>

          <strong>
            Daily reminders
          </strong>

          <p>
            Receive reminders about your daily habits.
          </p>

        </div>


        <button
          className={
            enabled
              ? "settings-toggle active"
              : "settings-toggle"
          }
          onClick={() =>
            setEnabled(!enabled)
          }
          aria-label="Toggle daily reminders"
        >

          <span />

        </button>

      </div>

    </section>
  );
}


// ==========================================
// APPEARANCE
// ==========================================

interface AppearanceSectionProps {
  theme: "Light" | "Dark";
  setTheme: (
    value: "Light" | "Dark"
  ) => void;
}


function AppearanceSection({
  theme,
  setTheme,
}: AppearanceSectionProps) {

  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div>

          <p className="eyebrow">
            PREFERENCES
          </p>

          <h3>
            Appearance
          </h3>

          <p>
            Choose how HabitFlow looks on your device.
          </p>

        </div>

      </div>


      <div className="settings-option">

        <div>

          <strong>
            Theme
          </strong>

          <p>
            Current theme: {theme}
          </p>

        </div>


        <div className="settings-theme-options">

          <button
            className={
              theme === "Light"
                ? "settings-theme-button active"
                : "settings-theme-button"
            }
            onClick={() =>
              setTheme("Light")
            }
          >
            Light
          </button>


          <button
            className={
              theme === "Dark"
                ? "settings-theme-button active"
                : "settings-theme-button"
            }
            onClick={() =>
              setTheme("Dark")
            }
          >
            Dark
          </button>

        </div>

      </div>

    </section>
  );
}


// ==========================================
// ABOUT
// ==========================================

function AboutSection() {

  return (
    <section className="settings-section">

      <div className="settings-section-header">

        <div>

          <p className="eyebrow">
            ABOUT
          </p>

          <h3>
            HabitFlow
          </h3>

          <p>
            A focused habit tracking system
            built for consistency and daily progress.
          </p>

        </div>

      </div>


      <div className="settings-about-card">

        <div className="settings-about-row">

          <span>
            Application
          </span>

          <strong>
            HabitFlow
          </strong>

        </div>


        <div className="settings-about-row">

          <span>
            Version
          </span>

          <strong>
            1.0.0
          </strong>

        </div>


        <div className="settings-about-row">

          <span>
            Purpose
          </span>

          <strong>
            Habit & consistency tracking
          </strong>

        </div>

      </div>

    </section>
  );
}


export default Settings;