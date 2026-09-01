import { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import AddCategory from './pages/AddCategory';
import ManageCategories from './pages/ManageCategories';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Routes>
        <Route path="/" element={<Homepage sidebarOpen={sidebarOpen}/>} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetail/>}/>
        <Route path="/edit-recipe/:id" element={<EditRecipe/>}/>
        <Route path="/add-category" element={<AddCategory/>}/>
        <Route path="/manage-categories" element={<ManageCategories/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;