import React from 'react';

export default function FriendaCard({ emblem, isOwned, toggleOwned }) {
  const emblemIcon = require(`../Images/${emblem.img}`);

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

      <img
        src={emblemIcon}
        alt={emblem.name}
        className='emblem-icon'
        owned={isOwned ? 'true' : 'false'}
      />

      {/* Star rarity display */}
      <div className={`emblem-rarity ${rarityName()}`}>
        {'★'.repeat(emblem.rarity)}
      </div>
    </div>
  );
}