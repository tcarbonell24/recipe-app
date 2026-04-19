import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1 className="home-title">Recipe Manager</h1>

      <p className="home-subtitle">
        Create recipes, manage ingredients, and explore your collection.
      </p>

      <div className="home-buttons">
        <button
          className="home-button primary"
          onClick={() => navigate("/recipes")}
        >
          View Recipes
        </button>

        <button
          className="home-button"
          onClick={() => navigate("/recipes/new")}
        >
          Create Recipe
        </button>
      </div>
    </div>
  );
}
