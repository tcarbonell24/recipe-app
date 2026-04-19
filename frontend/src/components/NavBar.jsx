import { NavLink, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:5000/auth/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((err) => console.error("Error logging out:", err));
  }

  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/recipes"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Recipes
      </NavLink>

      {user ? (
        <>
          <NavLink
            to="/recipes/new"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Create Recipe
          </NavLink>

          <NavLink
            to={`/recipes/user/${user.id}`}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            My Recipes
          </NavLink>

          <button
            type="button"
            className="nav-link nav-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Signup
          </NavLink>
        </>
      )}
    </nav>
  );
}
