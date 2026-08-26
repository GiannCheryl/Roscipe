import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js'

function AddCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !icon.trim() || !description.trim()){
      alert("Please fill in all the required fields.");
      return;
    }

    setSaving(true);

    const {error} = await supabase
      .from('categories')
      .insert([
        {
          name: name.trim(),
          icon: icon.trim(),
          description: description.trim(),
        },
      ]);

    if (error) {
      console.error('Error adding category:', error);
      if(error.code === "23505"){
        alert("Category already exists.");
      }else{
        alert("Failed to add category.");
      }
      setSaving(false);
      return;
    }

    setSaving(false);
    setShowSuccess(true);
  }

  return (
    <div className="add-category">
      <h1>Add Category</h1>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..." 
            required 
          />
        </div>

        {/* Icon */}
        <div className="form-group">
          <label>Icon</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Enter icon..."
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            required
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

            <h2>Category Added!</h2>
            <p>Category successfully added.</p>
            <button
              type='button'
              onClick={() => {
                setShowSuccess(false);
                navigate("/");
              }}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCategory;