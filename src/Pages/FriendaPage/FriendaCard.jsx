import React from 'react';
import styles from './Pokemon.module.css'

export default function FriendaCard({ emblem, isOwned, toggleOwned }) {
  const emblemIcon = `/Naruto-Emblem-Battle-Tracker/Images/${emblem.img}`;

  const rarityName = () => {
    switch (emblem.rarity) {
      case "6":
        return 'six-star';
      case "5":
        return 'five-star';
      case "4":
        return 'four-star';
      case "3":
        return 'three-star';
      case "2":
        return 'two-star';
      case "1":
        return 'one-star';
      default:
        return '';
    }
  };

  return (
    <div className={`${styles['emblem-container']} ${styles[rarityName()]}`}>
      <h2 className={styles['emblem-name']}>
        {emblem.name}{' '}
      </h2>
      <h3 className={styles['emblem-name']}>
        {emblem.id}
      </h3>
      <input
          type="checkbox"
          checked={isOwned}
          className={styles['emblem-toggle']}
          onChange={() => toggleOwned(emblem.id)}
        />

      <div className={styles['emblem-icon-container']}>
        <img
          src={emblemIcon}
          alt={emblem.name}
          className={styles[`emblem-icon-${emblem.rarity}`]}
          owned={isOwned ? 'true' : 'false'}
        />
      </div>

      <div className={`${styles['rarity-stars']}`}>
        {'★'.repeat(emblem.rarity)}
      </div>
    </div>
  );
}