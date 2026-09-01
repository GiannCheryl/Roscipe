import { useNavigate } from 'react-router-dom';

function Navbar( { sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button 
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        ROSCIPE
      </button>

        <button 
          type="button"
          className="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
    </nav>
  );
}

export default Navbar;