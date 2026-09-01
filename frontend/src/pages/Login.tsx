import {
  useState,
  type FormEvent,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

function Login() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ==========================================
  // FORM STATE
  // ==========================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
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


  // ==========================================
  // REGISTRATION SUCCESS
  // ==========================================

  const registrationSuccess =
    location.state?.registered === true;


  // ==========================================
  // LOGIN
  // ==========================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError("");


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

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


    // ----------------------------------------
    // API REQUEST
    // ----------------------------------------

    try {

      setLoading(true);


      const response =
        await fetch(
          `${API_BASE_URL}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
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
          "Invalid email or password.";


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

      const data =
        await response.json();


      localStorage.setItem(
        "access_token",
        data.access_token
      );


      navigate(
        "/dashboard",
        {
          replace: true,
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
          "Unable to login. Please try again."
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
            WELCOME BACK
          </p>


          <h2>
            Sign in
          </h2>


          <p>
            Continue your journey.
          </p>

        </div>


        {/* ====================================
            SUCCESS MESSAGE
        ==================================== */}

        {registrationSuccess && (

          <div className="form-success">

            ✓ Account created successfully.
            You can now sign in.

          </div>

        )}


        {/* ====================================
            FORM
        ==================================== */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >


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
                placeholder="Enter your password"
                autoComplete="current-password"
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
              ? "Signing in..."
              : "Sign In"}

          </button>

        </form>


        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>


          <button
            type="button"
            className="auth-link"
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </button>

        </div>

      </div>

    </div>

  );

}


export default Login;