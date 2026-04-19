import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/FormPages.css";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Login failed");
        }

        return data;
      })
      .then((data) => {
        setUser(data);
        navigate("/recipes");
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">
          Access your recipes and manage your own uploads.
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="form-button">
            Login
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <p className="form-helper-text">
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
