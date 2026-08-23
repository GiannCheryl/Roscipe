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
  const [currentImage, setCurrentImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setCategoryId(data.category_id || '');
    setIngredients(data.ingredients || '');
    setInstructions(data.instructions || '');
    setNotes(data.notes || '');
    setCurrentImage(data.image_url || '');

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
    )
  }
}
export default EditRecipe;