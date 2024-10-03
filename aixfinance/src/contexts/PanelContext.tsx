// src/contexts/PanelContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PanelData, CardData } from '../types';
import { initialPanels } from '../data/dummyData';
import { v4 as uuidv4 } from 'uuid';

interface PanelContextProps {
  panels: PanelData[];
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
  addCard: (card: Omit<CardData, 'id' | 'category'>) => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

export const PanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panels, setPanels] = useState<PanelData[]>(initialPanels);

  const addCard = (card: Omit<CardData, 'id' | 'category'>) => {
    const newCard: CardData = {
      id: uuidv4(),
      category: 'Sin Categoría',
      ...card,
    };

    const updatedPanels = panels.map(panel => {
      if (panel.name === 'Sin Categoría') {
        return {
          ...panel,
          cards: [...panel.cards, newCard],
          total: panel.total + newCard.amount,
        };
      }
      return panel;
    });

    setPanels(updatedPanels);
  };

  return (
    <PanelContext.Provider value={{ panels, setPanels, addCard }}>
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanelContext debe ser usado dentro de PanelProvider');
  }
  return context;
};
