import { Link, useNavigate } from "react-router-dom";
import "../styles/RecipeCard.css";

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  // Navigate to recipe detail page when card is clicked
  function handleCardClick() {
    navigate(`/recipes/${recipe.id}`);
  }

  // Allow keyboard accessibility (Enter/Space triggers navigation)
  function handleCardKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/recipes/${recipe.id}`);
    }
  }

  return (
    <div
      className="recipe-card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
    >
      <h2 className="recipe-card-title">{recipe.name}</h2>

      <p className="recipe-card-user">
        Uploaded by{" "}
        <Link
          to={`/recipes/user/${recipe.user.id}`}
          className="recipe-user-link"
          onClick={(e) => e.stopPropagation()} // Prevent card click from triggering
        >
          {recipe.user?.username}
        </Link>
      </p>

      {recipe.description && (
        <p className="recipe-card-description">{recipe.description}</p>
      )}
    </div>
  );
}
