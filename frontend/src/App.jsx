import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

function RecipePage() {
  return <h2>Recipe Page (ID in URL)</h2>;
}

function UserRecipesPage() {
  return <h2>User Recipes Page</h2>;
}

function ItemPage() {
  return <h2>Item Page (ID in URL)</h2>;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* New routes */}
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/recipes/user/:user_id" element={<UserRecipesPage />} />

        <Route path="/items/" element={<ItemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
