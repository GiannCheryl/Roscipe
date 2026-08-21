import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

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
            <p>Discover delicious recipes for every meal of the day!</p>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <section className="recipes-section">
            <div className="recipes-header">
              <h2>All Recipes</h2>
              <span>( {filteredRecipes.length} )</span>

              <p>Recipes: {recipes.length}</p>
              <p>Filtered: {filteredRecipes.length}</p>
            </div>

            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <div
                  className="recipe-card"
                  key={recipe.id}
                >
                  <div className="recipe-image">
                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                      />
                    ):(
                      <div className="no-image">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="recipe-card-footer">
                    <h3>{recipe.title}</h3>

                    <div className="recipe-menu-container">
                      <button className="menu-button"
                      onClick={() => 
                        setOpenMenuId(openMenuId === recipe.id ? null : recipe.id
                      )}> ⋮ </button>

                      {openMenuId === recipe.id && (
                        <div className="dropdown-menu recipe-dropdown">
                          <button className="dropdown-item">
                            Edit Recipe
                          </button>

                          <button className="dropdown-item">
                            Delete Recipe
                          </button>
                        </div>
                      )}
                    </div>

                  
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>  
  );
}

export default Homepage;