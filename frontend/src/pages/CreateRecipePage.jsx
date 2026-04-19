import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/FormPages.css";

export default function CreateRecipePage({ user }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [allergyWarnings, setAllergyWarnings] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create a recipe.");
      return;
    }

    if (!name.trim()) {
      setError("Recipe name is required.");
      return;
    }

    fetch("http://localhost:5000/recipes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        prep_time: prepTime === "" ? null : Number(prepTime),
        cook_time: cookTime === "" ? null : Number(cookTime),
        servings: servings === "" ? null : Number(servings),
        allergy_warnings: allergyWarnings,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error creating recipe");
        }

        return data;
      })
      .then((newRecipe) => {
        navigate(`/recipes/${newRecipe.id}`);
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">Create Recipe</h1>
        <p className="form-subtitle">
          Add the main recipe details first, then manage ingredients on the
          recipe page.
        </p>

        {!user && (
          <p className="form-helper-text">
            You need to <Link to="/login">log in</Link> before creating a
            recipe.
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            className="form-input"
            placeholder="Recipe name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="form-input"
            type="number"
            placeholder="Prep time in minutes"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />

          <input
            className="form-input"
            type="number"
            placeholder="Cook time in minutes"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />

          <input
            className="form-input"
            type="number"
            placeholder="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />

          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={allergyWarnings}
              onChange={(e) => setAllergyWarnings(e.target.checked)}
            />
            Allergy warnings
          </label>

          <button type="submit" className="form-button">
            Create
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
}
