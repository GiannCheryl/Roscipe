import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <button 
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        ROSCIPE
      </button>

      <div className="navbar-menu-container">
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item category-button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
              <span>Categories</span>
              <span>›</span>
            </button>

            {isCategoryOpen && (
              <div className="category-dropdown">
                <button className="dropdown-item">
                  Add Category
                </button>
                <button className="dropdown-item">
                  Edit Category
                </button>
              </div>
            )}

            <button 
            className="dropdown-item"
            onClick={() => navigate('/add-recipe')}>
              Add Recipe
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;