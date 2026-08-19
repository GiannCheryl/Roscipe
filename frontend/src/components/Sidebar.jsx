import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    console.log("Categories data:", data);
    console.log("Categories error:", error);

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    setCategories(data);
  }

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from("recipes")
      .select("id, category_id");

    console.log("Recipes data:", data);
    console.log("Recipes error:", error);

    if (error) {
      console.error("Error fetching recipes:", error);
      return;
    }
    setRecipes(data);
  }

  return (
    <aside className="sidebar">
      <h2>Categories</h2>

      <div className="category-list">
        {categories.map((category) => (
          <label 
            className="category-item"
            key={category.id}
          >
            <input type="checkbox" />

            <span className="category-icon">
              {category.icon}
            </span>

            <span className="category-name">
              {category.name}
            </span>

            <span className="category-count">
              {recipes.filter(
                (recipe) => recipe.category_id === category.id).length
              }
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;