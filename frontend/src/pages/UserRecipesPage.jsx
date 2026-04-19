import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import "../styles/RecipeList.css";

export default function UserRecipesPage({ user }) {
  const { user_id } = useParams();

  // Stores recipes for a specific user
  const [recipes, setRecipes] = useState([]);

  // Error + loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch recipes for given user ID
  useEffect(() => {
    setError("");
    setLoading(true);

    fetch(`http://localhost:5000/recipes/user/${user_id}`)
      .then(async (res) => {
        const data = await res.json();

        // Handle API errors
        if (!res.ok) {
          throw new Error(data.error || "Failed to load user recipes");
        }

        return data;
      })
      .then((data) => setRecipes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Determine page title (My Recipes vs username)
  const pageTitle =
    user && user.id === Number(user_id)
      ? "My Recipes"
      : recipes.length > 0
        ? `${recipes[0].user.username}'s Recipes`
        : "User Recipes";

  return (
    <div className="recipe-list-page">
      <h1 className="recipe-list-title">{pageTitle}</h1>

      {recipes.length === 0 ? (
        <p>No recipes found for this user.</p>
      ) : (
        <div className="recipe-list-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
