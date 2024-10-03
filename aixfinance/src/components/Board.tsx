// src/components/Board.tsx

import React from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Panel from './Panel';
import { usePanelContext } from '../contexts/PanelContext';
import styles from '../styles/Board.module.css';

const Board: React.FC = () => {
  const { panels, setPanels, addCard } = usePanelContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    // Encontrar la tarjeta arrastrada
    const draggedCard = panels
      .flatMap(panel => panel.cards)
      .find(card => card.id === active.id);

    if (!draggedCard) return;

    // Encontrar los paneles de origen y destino
    const sourcePanelIndex = panels.findIndex(panel =>
      panel.cards.find(card => card.id === draggedCard.id)
    );
    const destinationPanelIndex = panels.findIndex(panel => panel.id === over.id);

    if (sourcePanelIndex === -1 || destinationPanelIndex === -1) return;

    // Si se suelta en el mismo panel, no hacer nada
    if (sourcePanelIndex === destinationPanelIndex) return;

    const sourcePanel = panels[sourcePanelIndex];
    const destinationPanel = panels[destinationPanelIndex];

    // Remover la tarjeta del panel de origen
    const updatedSourceCards = sourcePanel.cards.filter(card => card.id !== draggedCard.id);

    // Agregar la tarjeta al panel de destino y actualizar el tipo de gasto
    const updatedDestinationCards = [...destinationPanel.cards, { ...draggedCard, category: destinationPanel.name }];

    // Calcular nuevos totales
    const updatedSourceTotal = updatedSourceCards.reduce((sum, card) => sum + card.amount, 0);
    const updatedDestinationTotal = updatedDestinationCards.reduce((sum, card) => sum + card.amount, 0);

    // Actualizar el estado de los paneles
    const updatedPanels = [...panels];
    updatedPanels[sourcePanelIndex] = {
      ...sourcePanel,
      cards: updatedSourceCards,
      total: updatedSourceTotal,
    };
    updatedPanels[destinationPanelIndex] = {
      ...destinationPanel,
      cards: updatedDestinationCards,
      total: updatedDestinationTotal,
    };

    setPanels(updatedPanels);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {panels.map(panel => (
          <Panel key={panel.id} panel={panel} />
        ))}
      </div>
    </DndContext>
  );
};

export default Board;
