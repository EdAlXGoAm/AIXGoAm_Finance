"use client";

import React, { useState } from 'react';
import Canvas from '../components/Canvas';
import Caducidad from '../components/Alimentos/Caducidad'
import Estado from '../components/Alimentos/Estado'
import ParamConfig from '../components/Alimentos/ParamConfig'
import Articulo from '../components/Alimentos/Articulo';
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
      <div>
        <Estado refresh={refresh} setRefresh={setRefresh}/>
      </div>
      <div>
        <ParamConfig refresh={refresh} setRefresh={setRefresh}/>
      </div>
      <div>
        <Articulo refresh={refresh} setRefresh={setRefresh}/>
      </div>
    </div>
  );
};

export default HomePage;