"use client";


import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import NewCardForm from '../components/NewCardForm';
import '../styles/globals.css';

const HomePage: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleAdd = () => {
    setRefresh((prev) => !prev); // Cambia el estado para forzar la recarga de gastos
  };

  return (
    <div>
      <Canvas refresh={refresh} />
      <NewCardForm onAdd={handleAdd} />
    </div>
  );
};

export default HomePage;