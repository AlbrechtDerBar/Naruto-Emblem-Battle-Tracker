import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="hamburger">&#9776;</label>

      <ul className="menu">
        <li><Link to="/" className="menu-link">Home</Link></li>
        <li><Link to="/login" className="menu-link">Login</Link></li>
        <li><Link to="/naruto-emblem-battle" className="menu-link">Naruto Emblem Battle</Link></li>
        <li><Link to="/pokemon-frienda" className="menu-link">Pokémon Frienda</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
