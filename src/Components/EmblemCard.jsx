// EmblemCard.jsx
import React from 'react';

export default function EmblemCard({ emblem, isOwned, toggleOwned }) {
  const emblemIcon = require(`../Images/u${emblem.id}.webp`);

  const rarityName = () => {
    switch (emblem.rarity) {
      case 6:
        return 'six-star';
      case 5:
        return 'five-star';
      case 4:
        return 'four-star';
      case 3:
        return 'three-star';
      case 2:
        return 'two-star';
      case 1:
        return 'one-star';
      default:
        return '';
    }
  };

  return (
    <div className={'emblem-container ' + rarityName()}>
      <h2 className='emblem-name'>
        {emblem.id}{' '}
        <input
          type="checkbox"
          checked={isOwned}
          onChange={() => toggleOwned(emblem.id)}
        />
      </h2>
      <img src={emblemIcon} alt={emblem.name} className='emblem-icon' owned={isOwned ? 'true' : 'false'} />
    </div>
  );
}
