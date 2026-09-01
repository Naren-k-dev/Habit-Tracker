import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Login from "./pages/Login";
import Progress from "./pages/Progress";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import TrackingPeriod from "./pages/TrackingPeriod";


import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ======================================
            PUBLIC ROUTES
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ======================================
            PROTECTED ROUTES
        ====================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* ROOT */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />


            {/* DASHBOARD */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* HABITS */}

            <Route
              path="/habits"
              element={<Habits />}
            />


            {/* TASKS */}

            <Route
              path="/tasks"
              element={<Tasks />}
            />


            {/* PROGRESS */}

            <Route
              path="/progress"
              element={<Progress />}
            />


            {/* TRACKING PERIOD */}

            <Route
              path="/tracking-period"
              element={<TrackingPeriod />}
            />


            {/* SETTINGS */}

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* ======================================
            UNKNOWN ROUTES
        ====================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;