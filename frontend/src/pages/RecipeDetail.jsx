import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from '../lib/supabase.js'

function RecipeDetail()  {
  const {id} = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  async function fetchRecipe () {
    const {data, error} = await supabase 
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
      
      if (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
        return;
      }

      setRecipe(data);
      setLoading(false);
    }

    if (loading) {
      return <div className="recipe-detail-page">Loading...</div>
    }
    
    if (!recipe) {
      return (
        <div>
          <h2>Recipe not found</h2>
        </div>
      )
    }

    const ingredients = recipe.ingredients ? recipe.ingredients
      .split('/n')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      : []

      const instructions = recipe.instructions ? recipe.instructions
      .split('/n')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      : []
      
  return(
    <div className="recipe-detail-page">
      <h1>{recipe.title}</h1>
      <div className="recipe-detail-grid">
        {/* image */}
        <div className="detail-image-box">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.title} />
          ):(
            <div className="no-image">No image</div>
          )}
        </div>

        {/* ingredients */}
        <div className="detail-box ingredients-box">
          <h2>Ingredients</h2>

          <ul>
            {recipe.ingredients
              .split(/\r?\n/)
              .filter(ingredient => ingredient.trim() !== '')
              .map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* instructions */}
        <div className="detail-box cooking-box">
          <h2>Cooking Steps</h2>

          <ol>
            {recipe.instructions
              .split(/\r?\n/)
              .filter(step => step.trim() !== '')
              .map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Notes */}
        <div className="detail-box notes-box">
            <h2>Notes</h2>

            {recipe.notes ? (
              <p>{recipe.notes}</p>
            ):(
              <p>No Notes</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail