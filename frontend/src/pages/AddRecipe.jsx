import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js'

function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);


  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
      if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data);
  }

  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();

    formData.append('file', image);
    formData.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
      `http://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok){
      throw new Error('Gagal upload gambar');
    }

    const data = await response.json();

    return data.secure_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !categoryId || !ingredients || !instructions){
      alert("Please fill in all the required fields.");
      return;
    }

    setSaving(true);

    try {
      // Upload image ke Cloudinary
      const imageUrl = await uploadImage();

      // Simpan recipe + image URL ke supabase
      const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title: title,
          category_id: categoryId,
          ingredients: ingredients,
          instructions: instructions,
          notes: notes || null,
          image_url: imageUrl,
        },
      ]).select();

      if (error) {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe.');
        setSaving(false);
        return;
      }

      console.log('Recipe added:', data);
      setShowSuccess(true);

      // Reset form fields
      setTitle('');
      setCategoryId('');
      setIngredients('');
      setInstructions('');
      setNotes('');

      // kalau mau otomatis di arahin ke homepage
      // navigate('/');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add recipe.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="add-recipe-page">
      <h1>Add Recipe</h1>

      <form onSubmit={handleSubmit} className="add-recipe-form">
        {/* Recipe Name */}
        <div className="form-group">
          <label>Recipe Name</label>
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
              Select category
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
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
        <div className='form-group'>
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
      

        <div className="form-button">
          <button 
            type="submit" 
            className="submit-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          
          <button 
            type="button"
            className="cancel-button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className='popup-overlay'>
          <div className='popup'>
            <div className='success-icon'>
              ✓
            </div>

            <h2>Recipe Added!</h2>
            <p>Resep telah berhasil di save.</p>
            <button
              type='button'
              onClick={() => setShowSuccess(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddRecipe;