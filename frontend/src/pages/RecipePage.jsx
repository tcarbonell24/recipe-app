import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/RecipePage.css";

export default function RecipePage({ user }) {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [measurement, setMeasurement] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrepTime, setEditPrepTime] = useState("");
  const [editCookTime, setEditCookTime] = useState("");
  const [editServings, setEditServings] = useState("");
  const [editAllergyWarnings, setEditAllergyWarnings] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => setRecipe(data))
      .catch((err) => console.error("Error loading recipe:", err));
  }, [id]);

  function startEditing() {
    setEditName(recipe.name || "");
    setEditDescription(recipe.description || "");
    setEditPrepTime(recipe.prep_time ?? "");
    setEditCookTime(recipe.cook_time ?? "");
    setEditServings(recipe.servings ?? "");
    setEditAllergyWarnings(Boolean(recipe.allergy_warnings));
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError("");
  }

  function handleUpdateRecipe(e) {
    e.preventDefault();
    setError("");

    fetch(`http://localhost:5000/recipes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: editName,
        description: editDescription,
        prep_time: editPrepTime === "" ? null : Number(editPrepTime),
        cook_time: editCookTime === "" ? null : Number(editCookTime),
        servings: editServings === "" ? null : Number(editServings),
        allergy_warnings: editAllergyWarnings,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to update recipe");
        }

        return data;
      })
      .then((updatedRecipe) => {
        setRecipe(updatedRecipe);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating recipe:", err);
        setError(err.message);
      });
  }

  function handleIngredientSearch(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    fetch(`http://localhost:5000/ingredients/search?q=${value}`)
      .then((res) => res.json())
      .then((data) => setSearchResults(data))
      .catch((err) => console.error("Error searching ingredients:", err));
  }

  function handleRemoveIngredient(ingredientId) {
    fetch(`http://localhost:5000/recipes/${id}/ingredients/${ingredientId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to remove ingredient");
        }

        return data;
      })
      .then((updatedRecipe) => {
        setRecipe(updatedRecipe);
      })
      .catch((err) => {
        console.error("Error removing ingredient:", err);
        setError(err.message);
      });
  }

  function handleSelectIngredient(ingredient) {
    setSelectedIngredient(ingredient);
    setSearchTerm(ingredient.name);
    setSearchResults([]);
  }

  function handleAddIngredient(e) {
    e.preventDefault();
    setError("");

    if (!measurement.trim()) return;

    const payload = {
      measurement: measurement,
    };

    if (selectedIngredient) {
      payload.item_id = selectedIngredient.id;
    } else if (searchTerm.trim()) {
      payload.item_name = searchTerm.trim();
    } else {
      return;
    }

    fetch(`http://localhost:5000/recipes/${id}/ingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to add ingredient");
        }

        return data;
      })
      .then((updatedRecipe) => {
        setRecipe(updatedRecipe);
        setMeasurement("");
        setSearchTerm("");
        setSearchResults([]);
        setSelectedIngredient(null);
      })
      .catch((err) => {
        console.error("Error adding ingredient:", err);
        setError(err.message);
      });
  }

  if (!recipe) return <p>Loading...</p>;

  const canEdit = user && user.id === recipe.user_id;

  return (
    <div className="recipe-page">
      <section className="recipe-details-card">
        {isEditing ? (
          <>
            <h1 className="recipe-page-title">Edit Recipe</h1>

            <form onSubmit={handleUpdateRecipe} className="edit-recipe-form">
              <input
                className="recipe-input"
                type="text"
                placeholder="Recipe name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <input
                className="recipe-input"
                type="text"
                placeholder="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />

              <input
                className="recipe-input"
                type="number"
                placeholder="Prep time"
                value={editPrepTime}
                onChange={(e) => setEditPrepTime(e.target.value)}
              />

              <input
                className="recipe-input"
                type="number"
                placeholder="Cook time"
                value={editCookTime}
                onChange={(e) => setEditCookTime(e.target.value)}
              />

              <input
                className="recipe-input"
                type="number"
                placeholder="Servings"
                value={editServings}
                onChange={(e) => setEditServings(e.target.value)}
              />

              <label className="recipe-checkbox-label">
                <input
                  type="checkbox"
                  checked={editAllergyWarnings}
                  onChange={(e) => setEditAllergyWarnings(e.target.checked)}
                />
                Allergy warnings
              </label>

              <div className="recipe-button-row">
                <button type="submit" className="recipe-button">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="recipe-button secondary-button"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="recipe-page-title">{recipe.name}</h1>

            <p className="recipe-page-user">
              Uploaded by{" "}
              <Link
                to={`/recipes/user/${recipe.user.id}`}
                className="recipe-user-link"
              >
                {recipe.user?.username}
              </Link>
            </p>

            <p className="recipe-page-description">{recipe.description}</p>

            <div className="recipe-meta">
              <p>Prep time: {recipe.prep_time}</p>
              <p>Cook time: {recipe.cook_time}</p>
              <p>Servings: {recipe.servings}</p>
              <p>Allergy warnings: {recipe.allergy_warnings ? "Yes" : "No"}</p>
            </div>

            {canEdit && (
              <button
                type="button"
                className="recipe-button"
                onClick={startEditing}
              >
                Edit Recipe
              </button>
            )}
          </>
        )}

        {error && <p className="recipe-error">{error}</p>}
      </section>

      <section className="recipe-section-card">
        <h2>Ingredients</h2>
        <ul className="ingredient-list">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} className="ingredient-list-item">
              <div className="ingredient-row">
                <span>
                  <span className="ingredient-measurement">
                    {ing.measurement}
                  </span>{" "}
                  <span className="ingredient-name">{ing.item?.item_name}</span>
                </span>

                {canEdit && (
                  <button
                    type="button"
                    className="remove-ingredient-button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {canEdit && (
        <section className="recipe-section-card">
          <h2>Add Ingredient</h2>

          <form onSubmit={handleAddIngredient} className="add-ingredient-form">
            <input
              className="recipe-input"
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={handleIngredientSearch}
            />

            {searchResults.length > 0 && (
              <ul className="ingredient-search-results">
                {searchResults.map((ingredient) => (
                  <li key={ingredient.id}>
                    <button
                      type="button"
                      className="ingredient-result-button"
                      onClick={() => handleSelectIngredient(ingredient)}
                    >
                      {ingredient.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedIngredient && (
              <p className="selected-ingredient">
                Selected ingredient: {selectedIngredient.name}
              </p>
            )}

            <input
              className="recipe-input"
              type="text"
              placeholder="Measurement"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
            />

            <button type="submit" className="recipe-button">
              Add Ingredient
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
