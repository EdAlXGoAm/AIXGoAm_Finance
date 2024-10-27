"use client";

import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import Caducidad from '../components/Alimentos/Caducidad'
import '../styles/globals.css';

const HomePage: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleAdd = () => {
    setRefresh((prev) => !prev); // Cambia el estado para forzar la recarga de gastos
  };

  return (
    <div>
      {/* <div>
        <Canvas refresh={refresh} setRefresh={setRefresh} />
      </div> */}
      <div>
        <Caducidad refresh={refresh} setRefresh={setRefresh}/>
      </div>
    </div>
  );
};

export default HomePage;