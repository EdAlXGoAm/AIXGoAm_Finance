// src/components/Panel.tsx

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styles from '../styles/Panel.module.css';
import { PanelData } from '../types';
import Card from './Card';

interface PanelProps {
  panel: PanelData;
}

const Panel: React.FC<PanelProps> = ({ panel }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: panel.id,
    data: { panel },
  });

  const isActive = isOver;

  return (
    <div
      ref={setNodeRef}
      className={`${styles.panel} ${isActive ? styles.active : ''}`}
    >
      <h2>{panel.name}</h2>
      <p>Total: ${panel.total.toFixed(2)}</p>
      <div className={styles.cardsContainer}>
        {panel.cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default Panel;
