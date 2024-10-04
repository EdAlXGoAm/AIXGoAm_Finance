// src/data/dummyData.ts

export interface CardData {
    id: number;
    title: string;
    content: string;
  }
  
  export const dummyCards: CardData[] = [
    { id: 1, title: 'Tarjeta 1', content: 'Contenido de la tarjeta 1' },
    { id: 2, title: 'Tarjeta 2', content: 'Contenido de la tarjeta 2' },
    { id: 3, title: 'Tarjeta 3', content: 'Contenido de la tarjeta 3' },
    // Agrega más tarjetas según sea necesario
  ];