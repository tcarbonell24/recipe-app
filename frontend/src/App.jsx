import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RecipeList from "./pages/RecipeList";
import RecipePage from "./pages/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import UserRecipesPage from "./pages/UserRecipesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import NavBar from "./components/NavBar";

function ItemPage() {
  return <h2>Item Page (ID in URL)</h2>;
}

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not logged in");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <NavBar user={user} setUser={setUser} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/:id" element={<RecipePage user={user} />} />
          <Route
            path="/recipes/new"
            element={<CreateRecipePage user={user} />}
          />
          <Route
            path="/recipes/user/:user_id"
            element={<UserRecipesPage user={user} />}
          />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/items/" element={<ItemPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
