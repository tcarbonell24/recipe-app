import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const baseURL = "http://127.0.0.1:5000/recipes";

  const [output, setOutput] = useState("");
  const [getId, setGetId] = useState("");
  const [userId, setUserId] = useState("");
  const [createName, setCreateName] = useState("");
  const [createUserId, setCreateUserId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const navigate = useNavigate();

  function display(data) {
    setOutput(JSON.stringify(data, null, 2));
  }

  async function getAllRecipes() {
    const res = await fetch(`${baseURL}/`);
    const data = await res.json();
    display(data);
  }

  async function getRecipe() {
    const res = await fetch(`${baseURL}/${getId}`);
    const data = await res.json();
    display(data);
  }

  async function getRecipesByUser() {
    const res = await fetch(`${baseURL}/user/${userId}`);
    const data = await res.json();
    display(data);
  }

  async function createRecipe() {
    const res = await fetch(`${baseURL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: createName,
        user_id: Number(createUserId),
      }),
    });

    const data = await res.json();
    display(data);
  }

  async function updateRecipe() {
    const res = await fetch(`${baseURL}/${updateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: updateName,
      }),
    });

    const data = await res.json();
    display(data);
  }

  async function deleteRecipe() {
    const res = await fetch(`${baseURL}/${deleteId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    display(data);
  }

  return (
    <div>
      <h1>Recipe API Tester</h1>

      <button onClick={() => navigate("/recipes/1")}>Go to Recipe 1</button>
      <button onClick={() => navigate("/recipes/user/1")}>
        Go to User 1 Recipes
      </button>

      <hr />

      <button onClick={getAllRecipes}>Get All Recipes</button>

      <div>
        <input
          type="text"
          placeholder="Recipe ID"
          value={getId}
          onChange={(e) => setGetId(e.target.value)}
        />
        <button onClick={getRecipe}>Get Recipe By ID</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={getRecipesByUser}>Get Recipes By User</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Recipe Name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="User ID"
          value={createUserId}
          onChange={(e) => setCreateUserId(e.target.value)}
        />
        <button onClick={createRecipe}>Create Recipe</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Recipe ID"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Name"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
        />
        <button onClick={updateRecipe}>Update Recipe</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Recipe ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <button onClick={deleteRecipe}>Delete Recipe</button>
      </div>

      <h2>Output:</h2>
      <pre>{output}</pre>
    </div>
  );
}
