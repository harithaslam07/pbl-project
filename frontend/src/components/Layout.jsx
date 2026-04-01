import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Academic Carbon Tracker</h1>
        <div className="row">
          <span>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <nav className="sidebar">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <main className="content">{children}</main>
    </div>
  );
}
