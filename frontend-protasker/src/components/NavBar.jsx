import { NavLink } from "react-router-dom";




const NavBar = () => {
  return (
    <nav style={{ backgroundColor: "#2b7bddff", padding: "1rem 2rem" ,display: "flex", gap: "12rem", borderRadius: "8px" }} className="flex gap-5 mx-auto">
      <NavLink to="/" style={{  color: "white", textDecoration: "none" }}>Home</NavLink>
      <NavLink to="/register" style={{  color: "white", textDecoration: "none" }}>Register</NavLink>
      <NavLink to="/login" style={{  color: "white", textDecoration: "none" }}>Log In</NavLink>
      <NavLink to="/tasks" style={{ color: "white", textDecoration: "none" }}>Tasks</NavLink>
    </nav>
  );
}
export default NavBar;  