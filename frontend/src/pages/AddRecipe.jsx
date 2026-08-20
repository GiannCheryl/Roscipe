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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !categoryId || !ingredients || !instructions){
      alert("Please fill in all the required fields.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          title: title,
          category_id: categoryId,
          ingredients: ingredients,
          instructions: instructions,
          notes: notes || null,
        },
      ]).select();

      if (error) {
        console.error('Error adding recipe:', error);
        alert('Failed to add recipe.');
        setSaving(false);
        return;
      }

      console.log('Recipe added:', data);
      alert('Recipe added successfully!');

      setSaving(false);

      // kalau mau otomatis di arahin ke homepage
      // navigate('/');

      // Reset form fields
      setTitle('');
      setCategoryId('');
      setIngredients('');
      setInstructions('');
      setNotes('');
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
          <label>Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter instructions..."
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

        <div className="form-button">
          <button type="submit" className="submit-button"
          disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          
          <button type="button"
          className="cancel-button"
          onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default AddRecipe;