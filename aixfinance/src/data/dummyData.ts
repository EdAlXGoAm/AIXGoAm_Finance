// src/data/dummyData.ts

import { PanelData, CardData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialPanels: PanelData[] = [
  {
    id: 'panel-1',
    name: 'Gastos Personales',
    total: 0,
    cards: [],
  },
  {
    id: 'panel-2',
    name: 'Gastos Ajenos',
    total: 0,
    cards: [],
  },
  {
    id: 'panel-3',
    name: 'Sin Categoría',
    total: 0,
    cards: [
      {
        id: uuidv4(),
        title: 'Gasto Inicial 1',
        amount: -100,
        account: 'Tarjeta de Crédito',
        category: '',
      },
      {
        id: uuidv4(),
        title: 'Gasto Inicial 2',
        amount: -200,
        account: 'Efectivo',
        category: '',
      },
    ],
  },
];
