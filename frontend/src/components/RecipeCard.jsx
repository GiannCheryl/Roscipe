import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ recipe, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm ] = useState(false);

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
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              ⋮
            </button>

            {showMenu && (
              <div 
                className='recipe-dropdown'
                onClick={(e) => e.stopPropagation()}>
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
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className='delete-overlay'>
          <div
            className='detele-group'
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Recipe?</h2>
            <p>Are you sure you want to delete <strong>"{recipe.title}"</strong>?</p>

            <div className='delete-actions'>
              <button
                type='button'
                className='delete-button'
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete(recipe.id)
                }}  
              >
                Delete
              </button>

              <button 
                type='button'
                className='cancel-button'
                onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecipeCard;