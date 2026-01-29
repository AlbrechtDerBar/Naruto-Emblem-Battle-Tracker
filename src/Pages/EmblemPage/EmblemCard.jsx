import React, { useState, useEffect } from 'react';
import styles from './Naruto.module.css';
import { useNavigate } from 'react-router-dom';

export default function EmblemCard({ emblem, isOwned, openEmblemInfo, updateOwnedEmblemCount, count }) {
  const navigate = useNavigate();
  const emblemIcon = emblem.imageUrl;
  const [numOwned, setNumOwned] = useState(count);

  // Sync numOwned with count prop whenever count changes
  useEffect(() => {
    setNumOwned(count);
  }, [count]);

  const rarityName = () => {
    switch (emblem.rarity) {
      case '6':
        return 'six-star';
      case '5':
        return 'five-star';
      case '4':
        return 'four-star';
      case '3':
        return 'three-star';
      case '2':
        return 'two-star';
      case '1':
        return 'one-star';
      default:
        return '';
    }
  };

  const handleNumOwnedChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
  
    if (newValue >= 0) {
      setNumOwned(newValue);
      // Update the parent's state when count changes
      updateOwnedEmblemCount(emblem.id, newValue);
    }
  };
  
  const incrementOwned = () => {
    setNumOwned(prev => prev + 1);
    // Update the parent's state when incrementing
    updateOwnedEmblemCount(emblem.id, numOwned + 1);
  };
  
  const decrementOwned = () => {
    if (numOwned > 0) {
      setNumOwned(prev => prev - 1);
      // Update the parent's state when decrementing
      updateOwnedEmblemCount(emblem.id, numOwned - 1);
    }
  };

  async function addToCollection(emblemId, count) {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You need to be logged in to add items to your collection.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/add-to-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          emblem_id: emblemId,
          count: count,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Successfully added ${count} of emblem ID: ${emblemId} to your collection.`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding emblem to collection:", error);
      alert("There was an error while updating your collection. Please try again.");
    }
  }

  useEffect(() => {
    if (numOwned > 0) {
      addToCollection(emblem.id, numOwned);
    }
  }, [numOwned, emblem.id]);

  return (
    <div className={`${styles['emblem-container']} ${styles[rarityName()]}`}>
      <h2 className={styles['emblem-name']}>
        {emblem.name}
      </h2>
      <h3 className={styles['emblem-name']}>
        {emblem.id}
      </h3>

      <input
        type="checkbox"
        checked={isOwned || numOwned > 0}
        onChange={() => {}}
        className={styles['emblem-toggle']}
      />

      <img
        src={emblemIcon}
        alt={emblem.name}
        className={`${styles['emblem-icon']} ${numOwned <= 0 ? styles['unowned'] : ''}`}
        onClick={() => openEmblemInfo(emblem.id)}
      />

      <div className={styles['counter-container']}>
        <button
          className={styles['counter-button']}
          onClick={decrementOwned}
          disabled={numOwned === 0}
        >
          -
        </button>

        <input
          type="number"
          name="owned"
          value={numOwned}
          id={styles.owned}
          min="0"
          onChange={handleNumOwnedChange}
          className={styles['counter-input']}
        />

        <button
          className={styles['counter-button']}
          onClick={incrementOwned}
        >
          +
        </button>
      </div>

      <p className={`${styles['emblem-name']} ${styles['emblem-tags']}`}>{emblem.tags.join(', ')}</p>

      <div className={`${styles['rarity-stars']}`}>
        {'★'.repeat(emblem.rarity)}
      </div>
    </div>
  );
}
