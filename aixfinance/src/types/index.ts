// src/types/index.ts

export interface CardData {
    id: string;
    title: string;
    amount: number;
    account: string;
    category: string;
  }
  
  export interface PanelData {
    id: string;
    name: string;
    total: number;
    cards: CardData[];
  }
  