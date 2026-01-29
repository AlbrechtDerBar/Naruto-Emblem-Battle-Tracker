import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';

export default function Home() {
  const narutoLogo = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/logo.webp`;
  const friendaLogo = `/Naruto-Emblem-Battle-Tracker/Images/frienda/logo.png`;

  return (
    <div className='wrapper'>
      <section className='logo'>
        <a href="https://www.naruto-emblem-battle.com/" target="_blank" rel="noopener noreferrer">
          <img src={narutoLogo} alt="Naruto Emblem Battle Logo" />
        </a>
        <div id='links'>
          <a href="https://www.naruto-emblem-battle.com/" target="_blank" rel="noopener noreferrer" className='link-button'>Official Site</a>
          <Link to="/naruto-emblem-battle" className='link-button'>Emblem Tracker</Link>
        </div>
      </section>

      <section className='logo'>
        <a href="https://pokemonfrienda.com/" target="_blank" rel="noopener noreferrer">
          <img src={friendaLogo} alt="Pokemon Frienda Logo" />
        </a>
        <div id='links'>
          <a href="https://pokemonfrienda.com/" target="_blank" rel="noopener noreferrer" className='link-button'>Official Site</a>
          <Link to="/pokemon-frienda" className='link-button'>Frienda Tracker</Link>
        </div>
      </section>
    </div>
  )
}
