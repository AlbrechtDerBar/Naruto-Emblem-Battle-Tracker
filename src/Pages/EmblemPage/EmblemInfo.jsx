import React from 'react';
import styles from './Naruto.module.css';

export default function EmblemInfo({ emblem, closeEmblemInfo }) {
    const emblemIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Volume${emblem.id[0]}/u${emblem.id}.webp`;
    const chakraIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_chakra.png`;
    const cloneIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_clone.png`;
    const sceneIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_scene.png`;
    const summoningIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_summoning.png`;
    const supportIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_support.png`;
    const teamIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_team.png`;
    const transformIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_transform.png`;
    const pwrIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_pwr.png`;
    const spdIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_spd.png`;
    const techIcon = `/Naruto-Emblem-Battle-Tracker/Images/NarutoEmblemBattle/Icons/icon_tech.png`;

  const rarityName = () => {
    switch (emblem.rarity) {
      case 6: return 'six-star';
      case 5: return 'five-star';
      case 4: return 'four-star';
      case 3: return 'three-star';
      case 2: return 'two-star';
      case 1: return 'one-star';
      default: return '';
    }
  };

  const getIcon = (iconName) => {
    switch (iconName.toLowerCase()) {
      case "chakra": return chakraIcon;
      case "clone": return cloneIcon;
      case "scene": return sceneIcon;
      case "summoning": return summoningIcon;
      case "support": return supportIcon;
      case "team": return teamIcon;
      case "transform": return transformIcon;
      case "pwr": return pwrIcon;
      case "spd": return spdIcon;
      case "tech": return techIcon;
      default: return '';
    }
  };

  return (
    <div className={styles['fullscreen-overlay']} onClick={closeEmblemInfo}>
      <div
        className={styles['info-container']}
        onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
      >
        <div className={styles['emblem-modal']}>
          <div className={styles['modal-image']}>
            <img src={emblemIcon} alt={emblem.name} />
            <div className={styles['emblem-keywords']}>
              {emblem.tags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
            </div>
          </div>

          <div className={styles['modal-content']}>
            <h2 className={styles['modal-title']}>{emblem.name}</h2>
            <div className={styles['modal-header']}>
              <div className={styles['emblem-rarity']}>
                <h2>
                    Rarity: <span className={styles['rarity-stars']}>{'★'.repeat(emblem.rarity)}</span>
                </h2>
            </div>
              <div className={styles['emblem-type']}>
                <h2>Type: <img src={getIcon(emblem.type)} alt="" className={styles['icon']}/></h2>
              </div>
            </div>

            <div className={styles['emblem-special-attack']}>
              <h3>Special Attack: <span>{emblem.specialAttack.name}</span></h3>
              <h3>
                <span><img src={getIcon("chakra")} alt="chakra" className={styles['chakra']}/></span> X {emblem.specialAttack.chakra}
              </h3>
              <p>{emblem.specialAttack.desc}</p>
            </div>

            {emblem.skill1 && (
              <div className={styles['emblem-skills']}>
                <h3>Skill 1: <span>{emblem.skill1.name}</span>{emblem.skill1.icon && <img src={getIcon(emblem.skill1.icon)} className={styles['icon']} />}</h3>
                <div className={styles['skill-desc']}>{emblem.skill1.desc}</div>
              </div>
            )}

            {emblem.skill2 && (
              <div className={styles['emblem-skills']}>
                <h3>Skill 2: <span>{emblem.skill2.name}</span>{emblem.skill2Icon && <img src={getIcon(emblem.skill2Icon)} />}</h3>
                <div className={styles['skill-desc']}>{emblem.skill2.desc}</div>
              </div>
            )}
          </div>

          <button className={styles['close-btn']} onClick={closeEmblemInfo}>&times;</button>
        </div>
      </div>
    </div>
  );
}
