import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";


// ==========================================
// TYPES
// ==========================================

type Section =
  | "profile"
  | "password"
  | "notifications"
  | "appearance"
  | "about";


interface User {
  id: number;
  name: string;
  email: string;
}


type Theme = "Light" | "Dark";


// ==========================================
// PASSWORD FIELD
// IMPORTANT:
// This component is OUTSIDE Settings()
// so it does not get recreated on every
// keystroke.
// ==========================================

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (value: boolean) => void;
  autoComplete: string;
  disabled?: boolean;
}


function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  setVisible,
  autoComplete,
  disabled = false,
}: PasswordFieldProps) {

  return (

    <div className="settings-form-group">

      <label htmlFor={id}>
        {label}
      </label>


      <div className="settings-password-wrapper">

        <input
          id={id}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          autoComplete={autoComplete}
          disabled={disabled}
          className="settings-password-input"
        />


        <button
          type="button"
          className="password-visibility-button"
          onClick={() => {
            setVisible(!visible);
          }}
          disabled={disabled}
        >
          {visible ? "Hide" : "Show"}
        </button>

      </div>

    </div>

  );
}


// ==========================================
// SETTINGS PAGE
// ==========================================

function Settings() {

  const navigate = useNavigate();


  // ==========================================
  // ACTIVE SECTION
  // ==========================================

  const [
    activeSection,
    setActiveSection,
  ] = useState<Section>("profile");


  // ==========================================
  // USER
  // ==========================================

  const [
    user,
    setUser,
  ] = useState<User | null>(null);


  const [
    loadingUser,
    setLoadingUser,
  ] = useState(true);


  const [
    userError,
    setUserError,
  ] = useState("");


  // ==========================================
  // PASSWORD
  // ==========================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");


  const [
    newPassword,
    setNewPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);


  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // ==========================================
  // PASSWORD STATUS
  // ==========================================

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);


  const [
    passwordError,
    setPasswordError,
  ] = useState("");


  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const [
    notifications,
    setNotifications,
  ] = useState<boolean>(() => {

    const saved =
      localStorage.getItem(
        "habitflow_notifications"
      );


    if (saved === null) {
      return true;
    }


    return saved === "true";

  });


  // ==========================================
  // APPEARANCE
  // ==========================================

  const [
    theme,
    setTheme,
  ] = useState<Theme>(() => {

    const saved =
      localStorage.getItem(
        "habitflow_theme"
      );


    return saved === "Dark"
      ? "Dark"
      : "Light";

  });


  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {

    async function loadUser() {

      try {

        setLoadingUser(true);
        setUserError("");


        const currentUser =
          await apiRequest<User>(
            "/api/auth/me"
          );


        setUser(currentUser);

      } catch (err) {

        setUserError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );

      } finally {

        setLoadingUser(false);

      }

    }


    void loadUser();

  }, []);


  // ==========================================
  // SAVE THEME
  //
  // IMPORTANT:
  // This effect ONLY saves the preference.
  //
  // The actual initial theme is applied
  // by main.tsx before React renders.
  // ==========================================

  useEffect(() => {

    localStorage.setItem(
      "habitflow_theme",
      theme
    );

  }, [theme]);


  // ==========================================
  // SAVE NOTIFICATION SETTING
  // ==========================================

  useEffect(() => {

    localStorage.setItem(
      "habitflow_notifications",
      String(notifications)
    );

  }, [notifications]);


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  async function handleChangePassword() {

    setPasswordError("");
    setPasswordSuccess("");


    // ------------------------------------------
    // CURRENT PASSWORD
    // ------------------------------------------

    if (!currentPassword.trim()) {

      setPasswordError(
        "Please enter your current password."
      );

      return;

    }


    // ------------------------------------------
    // NEW PASSWORD
    // ------------------------------------------

    if (!newPassword.trim()) {

      setPasswordError(
        "Please enter a new password."
      );

      return;

    }


    if (newPassword.length < 6) {

      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;

    }


    // ------------------------------------------
    // CONFIRM PASSWORD
    // ------------------------------------------

    if (!confirmPassword.trim()) {

      setPasswordError(
        "Please confirm your new password."
      );

      return;

    }


    if (
      newPassword !==
      confirmPassword
    ) {

      setPasswordError(
        "New passwords do not match."
      );

      return;

    }


    // ------------------------------------------
    // SAME PASSWORD
    // ------------------------------------------

    if (
      currentPassword ===
      newPassword
    ) {

      setPasswordError(
        "New password must be different from your current password."
      );

      return;

    }


    // ------------------------------------------
    // API REQUEST
    // ------------------------------------------

    try {

      setChangingPassword(true);


      await apiRequest<{
        message: string;
      }>(
        "/api/auth/change-password",
        {
          method: "POST",

          body: JSON.stringify({
            current_password:
              currentPassword,

            new_password:
              newPassword,
          }),
        }
      );


      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      setPasswordSuccess(
        "Password changed successfully!"
      );


      // ----------------------------------------
      // CLEAR PASSWORD FIELDS
      // ----------------------------------------

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      // ----------------------------------------
      // HIDE PASSWORDS
      // ----------------------------------------

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

    } catch (err) {

      setPasswordError(
        err instanceof Error
          ? err.message
          : "Failed to change password."
      );

    } finally {

      setChangingPassword(false);

    }

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {

    localStorage.removeItem(
      "access_token"
    );


    navigate(
      "/login",
      {
        replace: true,
      }
    );

  }


  // ==========================================
  // CHANGE THEME
  // ==========================================

  function changeTheme(
    selectedTheme: Theme
  ) {

    setTheme(selectedTheme);


    // Apply immediately when the user
    // explicitly chooses a theme.

    document.documentElement.dataset.theme =
      selectedTheme.toLowerCase();

  }


  // ==========================================
  // PROFILE
  // ==========================================

  function renderProfile() {

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

        </div>


        {/* LOADING */}

        {loadingUser && (

          <div className="settings-profile-card">

            <p>
              Loading profile...
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loadingUser &&
          userError && (

            <div className="settings-error">

              {userError}

            </div>

          )}


        {/* USER */}

        {!loadingUser &&
          user && (

            <div className="settings-profile-card">

              <div className="settings-avatar">

                {user.name
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div className="settings-profile-info">

                <div className="settings-profile-field">

                  <span>
                    NAME
                  </span>

                  <strong>
                    {user.name}
                  </strong>

                </div>


                <div className="settings-profile-field">

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {user.email}
                  </strong>

                </div>

              </div>

            </div>

          )}

      </section>

    );

  }


  // ==========================================
  // PASSWORD
  // ==========================================

  function renderPassword() {

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


          {/* CURRENT PASSWORD */}

          <PasswordField

            id="current-password"

            label="Current password"

            value={currentPassword}

            onChange={(value) => {

              setCurrentPassword(value);

              setPasswordError("");

              setPasswordSuccess("");

            }}

            visible={
              showCurrentPassword
            }

            setVisible={
              setShowCurrentPassword
            }

            autoComplete="current-password"

            disabled={
              changingPassword
            }

          />


          {/* NEW PASSWORD */}

          <PasswordField

            id="new-password"

            label="New password"

            value={newPassword}

            onChange={(value) => {

              setNewPassword(value);

              setPasswordError("");

              setPasswordSuccess("");

            }}

            visible={
              showNewPassword
            }

            setVisible={
              setShowNewPassword
            }

            autoComplete="new-password"

            disabled={
              changingPassword
            }

          />


          {/* CONFIRM PASSWORD */}

          <PasswordField

            id="confirm-password"

            label="Confirm new password"

            value={confirmPassword}

            onChange={(value) => {

              setConfirmPassword(value);

              setPasswordError("");

              setPasswordSuccess("");

            }}

            visible={
              showConfirmPassword
            }

            setVisible={
              setShowConfirmPassword
            }

            autoComplete="new-password"

            disabled={
              changingPassword
            }

          />


          {/* PASSWORD REQUIREMENTS */}

          <div className="settings-password-requirements">

            <strong>
              Password requirements
            </strong>


            <div
              className={
                newPassword.length >= 6
                  ? "valid"
                  : ""
              }
            >

              {newPassword.length >= 6
                ? "✓"
                : "○"}

              {" "}
              At least 6 characters

            </div>


            <div
              className={
                newPassword.length > 0 &&
                newPassword === confirmPassword
                  ? "valid"
                  : ""
              }
            >

              {newPassword.length > 0 &&
              newPassword === confirmPassword
                ? "✓"
                : "○"}

              {" "}
              Passwords match

            </div>

          </div>


          {/* ERROR */}

          {passwordError && (

            <div
              className="settings-error"
              role="alert"
            >

              {passwordError}

            </div>

          )}


          {/* SUCCESS */}

          {passwordSuccess && (

            <div
              className="settings-success"
              role="status"
            >

              <strong>
                ✓ {passwordSuccess}
              </strong>

              <p>
                Your new password will be used
                the next time you sign in.
              </p>

            </div>

          )}


          {/* BUTTON */}

          <div className="settings-form-actions">

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                void handleChangePassword();
              }}
              disabled={
                changingPassword
              }
            >

              {changingPassword
                ? "Changing Password..."
                : "Change Password"}

            </button>

          </div>


          {/* SECURITY NOTE */}

          <p className="settings-note">

            Your password is securely stored and
            is never displayed after changing it.

          </p>

        </div>

      </section>

    );

  }


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  function renderNotifications() {

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
              Control your notification preferences.
            </p>

          </div>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              Daily reminders
            </strong>

            <p>
              Receive reminders about your daily
              habits.
            </p>

          </div>


          <button
            type="button"
            className={
              notifications
                ? "settings-toggle active"
                : "settings-toggle"
            }
            onClick={() => {

              setNotifications(
                (previous) =>
                  !previous
              );

            }}
            aria-pressed={
              notifications
            }
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

  function renderAppearance() {

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
              Choose how HabitFlow looks.
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


            {/* LIGHT */}

            <button
              type="button"
              className={
                theme === "Light"
                  ? "settings-theme-button active"
                  : "settings-theme-button"
              }
              onClick={() =>
                changeTheme("Light")
              }
            >
              Light
            </button>


            {/* DARK */}

            <button
              type="button"
              className={
                theme === "Dark"
                  ? "settings-theme-button active"
                  : "settings-theme-button"
              }
              onClick={() =>
                changeTheme("Dark")
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

  function renderAbout() {

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
              Your personal habit and consistency
              tracking system.
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


  // ==========================================
  // ACTIVE SECTION
  // ==========================================

  function renderSection() {

    switch (activeSection) {

      case "profile":
        return renderProfile();


      case "password":
        return renderPassword();


      case "notifications":
        return renderNotifications();


      case "appearance":
        return renderAppearance();


      case "about":
        return renderAbout();


      default:
        return null;

    }

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="page settings-page">


      {/* ====================================
          HEADER
      ==================================== */}

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


      {/* ====================================
          SETTINGS LAYOUT
      ==================================== */}

      <div className="settings-layout">


        {/* ==================================
            SIDEBAR
        ================================== */}

        <aside className="settings-sidebar">


          {/* PROFILE */}

          <button
            type="button"
            className={
              activeSection === "profile"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("profile")
            }
          >

            <span>
              ◯
            </span>

            Profile

          </button>


          {/* PASSWORD */}

          <button
            type="button"
            className={
              activeSection === "password"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("password")
            }
          >

            <span>
              ◈
            </span>

            Change Password

          </button>


          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={
              activeSection === "notifications"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("notifications")
            }
          >

            <span>
              ◇
            </span>

            Notifications

          </button>


          {/* APPEARANCE */}

          <button
            type="button"
            className={
              activeSection === "appearance"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("appearance")
            }
          >

            <span>
              ◐
            </span>

            Appearance

          </button>


          {/* ABOUT */}

          <button
            type="button"
            className={
              activeSection === "about"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() =>
              setActiveSection("about")
            }
          >

            <span>
              ⓘ
            </span>

            About

          </button>


        </aside>


        {/* ==================================
            CONTENT
        ================================== */}

        <main className="settings-content">

          {renderSection()}


          {/* =================================
              LOGOUT
          ================================= */}

          <div className="settings-danger-zone">

            <div>

              <p className="settings-danger-label">
                DANGER ZONE
              </p>

              <h3>
                Log out
              </h3>

              <p>
                Log out from your account on this
                device.
              </p>

            </div>


            <button
              type="button"
              className="settings-danger-button"
              onClick={handleLogout}
            >
              Log out
            </button>

          </div>

        </main>

      </div>

    </div>

  );

}


export default Settings;