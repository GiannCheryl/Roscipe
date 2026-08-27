import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

function EditRecipe() {
  const {id} = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchRecipe();
  },[id]);

  async function fetchCategories() {
    const {data, error} = await supabase
      .from('categories')
      .select('*')
      .order('name', {ascending: true});

      if(error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data);
  }

  async function fetchRecipe() {
    const {data, error} = await supabase 
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();
    
    if(error) {
      console.error('Error fetching recipes:', error);
      alert('Recipe not found');
      navigate('/');
      return;
    }

    setTitle(data.title || '');
    setCategoryId(data.category_id ? String(data.category_id) : '');
    setIngredients(data.ingredients || '');
    setInstructions(data.instructions || '');
    setNotes(data.notes || '');
    setCurrentImageUrl(data.image_url || '');

    setLoading(false);
  }

  const uploadImage = async () => {
    if (!image) {
      return null;
    }
    const formData = new FormData();
    formData.append('file', image);
    formData.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if(!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if(!title || !categoryId || !ingredients || !instructions){
      alert('Please fill in all the required field');
      return;
    }
    setSaving(true);

    try {
      let imageUrl = currentImageUrl;

      if(image) {
        imageUrl = await uploadImage();
      }

      const {data, error} = await supabase 
        .from('recipes')
        .update({
          title: title,
          category_id: categoryId,
          ingredients: ingredients,
          instructions: instructions,
          notes: notes || null,
          image_url: imageUrl || null,
        })
        .eq('id', id)
        .select();

      if(error) {
        console.error('Error updating recipe:', error);
        alert('Failed to update recipe.');
        return;
      }

      console.log('Recipe updated.', data);
      setShowSuccess(true);
    }catch(error){
      console.error('Error:', error);
      alert('Failed to update recipe.');
    }finally{
      setSaving(false);
    }
  }

  if(loading) {
    return (
      <div className="edit-recipe-page">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="edit-recipe-page">
      <h1>Edit Recipe</h1>

      <form
        onSubmit={handleSubmit}
        className="add-recipe-form">
          {/* Recipe name */}
          <div className="form-group">
            <label>Recipe name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter name..."
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.icon}{category.name}
                </option>
              ))}

            </select>  
          </div>
          
          {/* Ingredients */}
          <div className="form-group">
            <label>Ingredients</label>

            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients..."
              required
            />
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label>Cooking Steps</label>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter cooking steps..."
              required
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes (optional)..."
            />
          </div>

          {/* Image */}
          <div className="form-group">
              <label>Image</label>

              {currentImageUrl && (
                  <div className="current-image">
                    <img
                      src={currentImageUrl}
                      alt={title}
                    />
                  </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
          </div>

          {/* Buttons */}
          <div className="form-button">
            <button
              type="submit"
              className="submit-button"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update'}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className= "popup-overlay">
            <div className="popup">
              <div className="success-icon">
                ✓
              </div>

              <h2>Recipe Updated!</h2>
              <p>Recipe successfully updated.</p>
              <button
                type="button"
                onClick={() => navigate(`/recipe/${id}`)}
              >
                Ok
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
export default EditRecipe;