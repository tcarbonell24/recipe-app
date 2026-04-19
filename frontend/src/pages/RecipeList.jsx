import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import "../styles/RecipeList.css";

export default function RecipeList() {
  // Stores all recipes returned from backend
  const [recipes, setRecipes] = useState([]);

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Error and loading states for UX
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Runs whenever searchTerm changes
  useEffect(() => {
    // Determine which endpoint to use (search vs all recipes)
    const url = searchTerm.trim()
      ? `http://localhost:5000/recipes/search?q=${encodeURIComponent(searchTerm)}`
      : "http://localhost:5000/recipes";

    setError("");
    setLoading(true);

    // Fetch recipes from backend
    fetch(url)
      .then(async (res) => {
        const data = await res.json();

        // Handle API errors
        if (!res.ok) {
          throw new Error(data.error || "Failed to load recipes");
        }

        return data;
      })
      .then((data) => setRecipes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div className="recipe-list-page">
      <h1 className="recipe-list-title">All Recipes</h1>

      {/* Search input */}
      <input
        className="recipe-search-input"
        type="text"
        placeholder="Search by recipe, ingredient, or uploader..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Conditional rendering for loading/error states */}
      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p>{error}</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="recipe-list-grid">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
