// src/components/Card.tsx

import React from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Card.module.css';

interface CardProps {
  id: number;
  title: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ id, title, content }) => {
  return (
    <Draggable>
      <div className={styles.card}>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </Draggable>
  );
};

export default Card;
