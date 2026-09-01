import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RecipeCard from "../components/RecipeCard";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
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
    return(
      recipe.title.toLowerCase().includes(keyword) || recipe.ingredients.toLowerCase().includes(keyword) 
    );
  })

  return (
    <div className="homepage">
      <div className="content">
        <Sidebar />
        <main className="main-content">
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
                  onDelete={(id) => {
                    console.log("Delete recipe:", id)
                  }}
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