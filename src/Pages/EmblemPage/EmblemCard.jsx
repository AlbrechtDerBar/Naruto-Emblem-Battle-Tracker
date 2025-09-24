import React from 'react';
import styles from './Naruto.module.css'

export default function EmblemCard({ emblem, isOwned, toggleOwned }) {
  const emblemIcon = require(`../../Images/NarutoEmblemBattle/Volume${emblem.id[0]}/u${emblem.id}.webp`);

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

      <img
        src={emblemIcon}
        alt={emblem.name}
        className={styles['emblem-icon']}
        owned={isOwned ? 'true' : 'false'}
      />

      <p className={`${styles['emblem-name']} ${styles['emblem-tags']}`}>{emblem.tags.join(", ")}</p>

      {/* Star rarity display */}
      <div className={`${styles['emblem-rarity']}`}>
        {'★'.repeat(emblem.rarity)}
      </div>
    </div>
  );
}