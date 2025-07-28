import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="flex gap-5 mx-auto">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/register">Register</NavLink>
      <NavLink to="/login">Log In</NavLink>
      <NavLink to="/posts">Posts</NavLink>
    </nav>
  );
}
export default NavBar;