import React from 'react';
import './Navbar.css';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-item">
        <div className="button-container">
          <button className="nav-button">Bedroom</button>
          <button className="nav-button">Computer Lab</button>
          <button className="nav-button">Hardware Lab</button>
          <button className="nav-button">Button 4</button>
        </div>
      </div>
      <div className="navbar-item">
        <div className="button-container">
          <button className="nav-button">VL</button>
          <button className="nav-button">UV</button>
          <button className="nav-button">IR</button>
        </div>
      </div>
      <div className="navbar-item">
        {/* Container for future content */}
      </div>
      <div className="navbar-item">
        {/* Container for future content */}
      </div>
    </nav>
  );
};

export default Navbar;
