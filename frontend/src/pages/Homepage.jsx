import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RecipeCard from "../components/RecipeCard";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Homepage({ sidebarOpen }) {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedCategory, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('title', { ascending: true });
        
    console.log('Homepage recipes:', data);
    console.log('Homepage error:', error);

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    setRecipes(data);
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const keyword = search.toLowerCase();

    // me-return data dengan title atau ingredients, jd nanti bisa di search dengan title atau ingredients
    const matchesSearch = recipe.title.toLowerCase().includes(keyword) || recipe.ingredients.toLowerCase().includes(keyword);

    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(recipe.category_id);

    return matchesSearch && matchesCategory;
  })

  function handleCategorySelect(categoryId) {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recipe:', error);
      return;
    }

    // Remove the deleted recipe from the state
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }

  return (
    <div className="homepage">
      <div className={`content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onCategorySelect={handleCategorySelect}
          selectedCategories={selectedCategory}
        />

        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="welcome"> 
            <h1>ROSCIPE</h1>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="button"
                className="add-recipe-button"
                onClick={() => navigate('/add-recipe')}
              >Add Recipe</button>
            </div>
          </div>

          <section className="recipes-section">
            <div className="recipes-header">
              <h2>All Recipes</h2>
              <span>( {recipes.length} )</span>

              <p>Filtered: {filteredRecipes.length}</p>
            </div>

            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id}
                  recipe={recipe}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  onEdit={(recipe) => {
                    navigate(`/edit-recipe/${recipe.id}`);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>  
  );
}

export default Homepage;