// PrioritySelector.tsx
import React from 'react';
import styles from './levelSelector.module.css';

interface LevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  levels?: string[];
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ value, onChange, levels = ['Level 1', 'Level 2', 'Level 3'] }) => {
  return (
    <div className={styles.levelSelector}>
      {levels.map((level) => (
        <div
          key={level}
          className={`${styles.levelItem} ${value === level ? styles.selected : ''}`}
          onClick={() => onChange(level)}
        >
          <div className={styles.point}></div>
          <span className={styles.label}>{level}</span>
        </div>
      ))}
    </div>
  );
};

export default LevelSelector;
