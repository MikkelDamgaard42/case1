import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="site-nav" aria-label="Primær navigation">
      <NavLink className="brand" to="/">
        mellemrum<span>.</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/">Events</NavLink>
        <NavLink to="/om">Om Mellemrum</NavLink>
      </div>
    </nav>
  );
}
