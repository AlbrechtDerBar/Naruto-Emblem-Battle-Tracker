import React from 'react'
import '../App.css';

export default function Home() {
  const narutoLogo = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/logo.webp`;
  const friendaLogo = `/Naruto-Emblem-Battle-Tracker/Images/frienda/logo.png`;
  return (
    <div className='wrapper'>
      <section className='logo'>
        <a href="https://www.naruto-emblem-battle.com/"><img src={narutoLogo} alt="Naruto Emblem Battle Logo" /></a>
      </section>

      <section className='logo'>
        <a href="https://pokemonfrienda.com/"><img src={friendaLogo} alt="Pokemon Frienda Logo" /></a>
      </section>
    </div>
  )
}
