// src/components/Canvas.tsx

import React from 'react';
import Card from './Card';
import { dummyCards } from '../data/dummyData';
import styles from '../styles/Canvas.module.css';

const Canvas: React.FC = () => {
  return (
    <div className={styles.canvas}>
      {dummyCards.map(card => (
        <Card key={card.id} id={card.id} title={card.title} content={card.content} />
      ))}
    </div>
  );
};

export default Canvas;
