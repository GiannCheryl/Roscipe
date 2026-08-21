import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

function Homepage() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecipes();
  })

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from('recipe')
      .select('*')
      .order('title', { ascending: true })

    if (error) {
      console.log('Error fetching recipes:', error);
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
            </div>

            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => {
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

                    <button className="menu-button"> ⋮ </button>
                  </div>
                </div>
              })}
            </div>
          </section>
        </main>
      </div>
    </div>  
  );
}

export default Homepage;