import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function ManageCategories() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');

  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  },[]);

  async function fetchCategories() {
    const {data, error} = await supabase
      .from('categories')
      .select('*')
      .order('name', {ascending: true});

      if(error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
        return;
      }

    setCategories(data);
    setLoading(false);
  }

  function handleEdit(category) {
    setEditingCategory(category);

    setName(category.name || "");
    setIcon(category.icon || "");
    setDescription(category.description || "");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if(!name || !icon || !description) {
      alert("Please fill in all the required field");
      return;
    }

    setSaving(true);

    try{
      const {data,error} = await supabase
        .from("categories")
        .update({
          name: name,
          icon: icon,
          description: description,
        })
        .eq("id", editingCategory)
        .select();

      if(error){
        console.error("Error updating category:", error);
        if(error.code === "23505") {
          alert("Category already exists.");
        }else{
          alert("Failed to update category.");
        }
        return;
      }

      console.log("Category updated.", data);
      await fetchCategories();

      setEditingCategory(null);
      setName("");
      setIcon("");
      setDescription("");

      setShowSuccess(true);

    }catch (error){
      console.error("Error:", error);
      alert("Failed to update category.");
    }finally{
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const {error} = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    
    if(error){
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
      return;
    }

    console.log("Category deleted.");

    await fetchCategories();
    setSelectedCategory(null);
    setShowSuccess(true);
  }

  if(loading) {
    return (
      <div className="manage-categories-page">
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className = 'manage-categories-page'>
      <h1>Manage Categories</h1>
    </div>
  )
}

export default ManageCategories