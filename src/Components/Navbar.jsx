// src/Components/Navbar.jsx
import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="hamburger">&#9776;</label>

      <ul className="menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/naruto-emblem-battle">Naruto Emblem Battle</Link></li>
        <li><Link to="/pokemon-frienda">Pokémon Frienda</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
