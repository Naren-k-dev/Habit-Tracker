import {
  useState,
  type FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


function Register() {

  const navigate =
    useNavigate();


  // ==========================================
  // FORM STATE
  // ==========================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // ==========================================
  // UI STATE
  // ==========================================

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ==========================================
  // REGISTER
  // ==========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError("");


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name.trim()) {

      setError(
        "Name is required."
      );

      return;
    }


    if (!email.trim()) {

      setError(
        "Email is required."
      );

      return;
    }


    if (!password) {

      setError(
        "Password is required."
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
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


    // ----------------------------------------
    // API REQUEST
    // ----------------------------------------

    try {

      setLoading(true);


      const response =
        await fetch(
          `${API_BASE_URL}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                name.trim(),

              email:
                email.trim(),

              password,
            }),
          }
        );


      // --------------------------------------
      // ERROR RESPONSE
      // --------------------------------------

      if (!response.ok) {

        let message =
          "Unable to create account.";


        try {

          const data =
            await response.json();


          if (
            typeof data.detail ===
            "string"
          ) {

            message =
              data.detail;

          }

        } catch {

          // Ignore invalid error response

        }


        throw new Error(
          message
        );

      }


      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      navigate(
        "/login",
        {
          replace: true,

          state: {
            registered: true,
          },
        }
      );


    } catch (err) {

      if (
        err instanceof Error
      ) {

        setError(
          err.message
        );

      } else {

        setError(
          "Unable to create account."
        );

      }

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="auth-page">

      <div className="auth-card">


        {/* ====================================
            BRAND
        ==================================== */}

        <div className="auth-brand">

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


        {/* ====================================
            HEADER
        ==================================== */}

        <div className="auth-header">

          <p className="eyebrow">
            GET STARTED
          </p>


          <h2>
            Create account
          </h2>


          <p>
            Start building your consistency.
          </p>

        </div>


        {/* ====================================
            FORM
        ==================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >


          {/* NAME */}

          <div className="form-field">

            <label htmlFor="name">
              Name
            </label>


            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Your name"
              autoComplete="name"
              disabled={loading}
            />

          </div>


          {/* EMAIL */}

          <div className="form-field">

            <label htmlFor="email">
              Email
            </label>


            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />

          </div>


          {/* PASSWORD */}

          <div className="form-field">

            <label htmlFor="password">
              Password
            </label>


            <div className="password-field">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={loading}
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword
                  ? "Hide"
                  : "Show"}

              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-field">

            <label htmlFor="confirm-password">
              Confirm password
            </label>


            <div className="password-field">

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password again"
                autoComplete="new-password"
                disabled={loading}
              />


              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword
                  ? "Hide"
                  : "Show"}

              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="form-error">
              {error}
            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create Account"}

          </button>

        </form>


        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>


          <button
            type="button"
            className="auth-link"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>

        </div>

      </div>

    </div>

  );

}


export default Register;