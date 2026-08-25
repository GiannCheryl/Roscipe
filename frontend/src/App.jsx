import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetail/>}/>
        <Route path="/edit-recipe/:id" element={<EditRecipe/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;