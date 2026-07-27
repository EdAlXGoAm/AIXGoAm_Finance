// PrioritySelector.tsx
import React from 'react';
import styles from '@/styles/utils/PrioritySelector/prioritySelector.module.css';

interface PrioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const priorities = ['Deseo', 'Necesario', 'Urgente'];

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  return (
    <div className={styles.prioritySelector}>
      {priorities.map((priority) => (
        <div
          key={priority}
          className={`${styles.priorityItem} ${value === priority ? styles.selected : ''}`}
          onClick={() => onChange(priority)}
        >
          <div className={styles.point}></div>
          <span className={styles.label}>{priority}</span>
        </div>
      ))}
    </div>
  );
};

export default PrioritySelector;
