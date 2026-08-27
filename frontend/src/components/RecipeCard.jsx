import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ recipe, onEdit, onDelete, openMenuId, setOpenMenuId }) {
  const navigate = useNavigate();
  // const [showMenu, setShowMenu] = useState(false);
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
                setOpenMenuId(
                  openMenuId === recipe.id ? null : recipe.id
                );
              }}
            >
              ⋮
            </button>

            {openMenuId === recipe.id && (
              <div 
                className='recipe-dropdown'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type='button'
                  onClick={() => {
                    setOpenMenuId(null);
                    onEdit(recipe);
                  }}
                >
                  Edit Recipe
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setOpenMenuId(null);
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
        <div className='popup-overlay'>
          <div className='popup' onClick={(e) => e.stopPropagation()}>
            <h2>Delete Recipe?</h2>
            <p>Are you sure you want to delete <strong>"{recipe.title}"</strong></p>
            <div className='delete-action'>
              <button
                type='button'
                className='delete-button'
                onClick={() => {
                  setShowDeleteConfirm(false)
                  onDelete(recipe.id)
                }}
              >
                Delete
              </button>
              <button
                type='button'
                className='popup-cancel-button'
                onClick={() => setShowDeleteConfirm(false)}
              >
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