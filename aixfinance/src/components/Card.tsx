// src/components/Card.tsx

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styles from '../styles/Card.module.css';
import { CardData } from '../types';

interface CardProps {
  card: CardData;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.card} {...listeners} {...attributes}>
      <h4>{card.title}</h4>
      <p>Monto: ${card.amount}</p>
      <p>Cuenta: {card.account}</p>
    </div>
  );
};

export default Card;
