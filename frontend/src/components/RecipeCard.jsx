import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ recipe, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu ] = useState(false);

  return(
    <>
      <div 
        className='recipe-card'
        onClick={() => navigate(`/recipe/${recipe.id}`)}>
        <div className='recipe-image'>
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
            />
          ) : (
            <div className='no-image'>
              No image
            </div>
          )}
        </div>

        <div className='recipe-card-footer'>
          <h3>{recipe.title}</h3>
          <div className='recipe-menu'>
            <button
              type='button'
              className='menu-button'
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </button>

            {showMenu && (
              <div className='recipe-dropdown'>
                <button
                  type='button'
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(recipe);
                  }}
                >
                  Edit Recipe
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(recipe.id);
                  }}
                >
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RecipeCard;